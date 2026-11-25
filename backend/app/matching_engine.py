import math
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session
from .models import FoodDonation, User, ReceiverProfile
from .schemas import ReceiverMatchOut, MatchFactorBreakdown, DonationRecommendationResponse

# Preset reference coordinates for coastal Karnataka (Udupi / Manipal district)
KNOWN_COORDINATES: Dict[str, Tuple[float, float]] = {
    "manipal": (13.3525, 74.7864),
    "mit campus": (13.3565, 74.7890),
    "tiger circle": (13.3530, 74.7850),
    "kmc hospital": (13.3540, 74.7875),
    "udupi": (13.3409, 74.7421),
    "car street udupi": (13.3420, 74.7450),
    "santhekatte": (13.3750, 74.7550),
    "malpe": (13.3516, 74.7042),
    "brahmavar": (13.4284, 74.7490),
    "karkala": (13.2144, 74.9961),
    "katapadi": (13.2842, 74.7380),
    "shirva": (13.2427, 74.8190),
    "kundapura": (13.6268, 74.6934),
    "surathkal": (13.0089, 74.7937),
    "mangalore": (12.9141, 74.8560),
}

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth (km)."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def resolve_location_coordinates(location_str: str, lat: Optional[float], lon: Optional[float]) -> Tuple[float, float]:
    """Resolve latitude & longitude from inputs or known local database."""
    if lat is not None and lon is not None and abs(lat) > 0.001:
        return (lat, lon)
    
    loc_clean = (location_str or "").strip().lower()
    for key, coords in KNOWN_COORDINATES.items():
        if key in loc_clean:
            return coords
            
    # Default fallback to Manipal center
    return (13.3525, 74.7864)

def calculate_location_compatibility(
    don_lat: float, don_lon: float,
    rec_lat: float, rec_lon: float
) -> Tuple[float, float]:
    """
    Computes location score (0 - 100) and distance in km.
    Formula:
      <= 2 km: 100%
      <= 5 km: 92%
      <= 10 km: 80%
      <= 20 km: 60%
      <= 35 km: 40%
      <= 60 km: 20%
      > 60 km: max(5, 100 - (dist * 1.5))
    """
    dist_km = haversine_distance(don_lat, don_lon, rec_lat, rec_lon)
    if dist_km <= 2.0:
        score = 100.0
    elif dist_km <= 5.0:
        score = 92.0 - ((dist_km - 2.0) / 3.0) * 12.0
    elif dist_km <= 10.0:
        score = 80.0 - ((dist_km - 5.0) / 5.0) * 20.0
    elif dist_km <= 20.0:
        score = 60.0 - ((dist_km - 10.0) / 10.0) * 20.0
    elif dist_km <= 35.0:
        score = 40.0 - ((dist_km - 20.0) / 15.0) * 20.0
    elif dist_km <= 60.0:
        score = 20.0 - ((dist_km - 35.0) / 25.0) * 15.0
    else:
        score = max(5.0, 100.0 - (dist_km * 1.5))
    
    return round(score, 1), dist_km

def calculate_quantity_compatibility(
    donation_qty: float,
    receiver_capacity: float
) -> Tuple[float, float]:
    """
    Computes quantity compatibility score (0 - 100) and absorption ratio.
    """
    if receiver_capacity <= 0 or donation_qty <= 0:
        return (50.0, 1.0)
    
    ratio = donation_qty / receiver_capacity
    
    # Perfect match: receiver capacity equals or slightly exceeds donation
    if 0.85 <= ratio <= 1.15:
        score = 100.0
    elif ratio < 0.85:
        # Receiver has capacity for more meals (e.g. Needs 50, donation is 30)
        # All food is utilized! Very favorable.
        score = max(70.0, 100.0 - (1.0 - ratio) * 35.0)
    else:
        # Donation exceeds receiver capacity (e.g. Donation is 100, receiver only needs 40)
        # Receiver cannot absorb all food alone
        score = max(30.0, 100.0 - (ratio - 1.0) * 45.0)
        
    return round(score, 1), round(ratio, 2)

def calculate_urgency_score(deadline: datetime) -> Tuple[float, float, str]:
    """
    Computes urgency score (0 - 100), remaining hours, and urgency tier.
    Uses UTC consistently with database naive timestamps.
    """
    if not deadline:
        return (0.0, 0.0, "Expired")
    now = datetime.utcnow()
    if deadline.tzinfo:
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        deadline = deadline.astimezone(timezone.utc).replace(tzinfo=None)
        
    time_diff = (deadline - now).total_seconds()
    if time_diff <= 0:
        return (0.0, 0.0, "Expired")

    hours_left = max(0.1, round(time_diff / 3600.0, 1))
    if hours_left <= 2.0:
        # Critical urgency - immediate redistribution required
        return (100.0, hours_left, "Critical")
    elif hours_left <= 5.0:
        # Urgent - next few hours
        return (85.0, hours_left, "Urgent")
    elif hours_left <= 12.0:
        # Moderate urgency - same day
        return (65.0, hours_left, "Moderate")
    else:
        # Normal
        return (45.0, hours_left, "Normal")

def calculate_preference_compatibility(
    food_dietary: str,
    receiver_pref: str
) -> Tuple[float, bool]:
    """
    Computes food preference compatibility (0 - 100) and boolean match status.
    Strict handling for vegetarian and vegan requirements.
    """
    f_diet = (food_dietary or "Vegetarian").lower()
    r_pref = (receiver_pref or "Both").lower()
    
    if r_pref in ["both", "any", "all"]:
        return (100.0, True)
    
    if r_pref == "vegetarian":
        if "veg" in f_diet and "non" not in f_diet:
            return (100.0, True)
        else:
            # Strictly vegetarian receiver cannot accept non-veg
            return (0.0, False)
            
    if r_pref == "vegan":
        if "vegan" in f_diet:
            return (100.0, True)
        elif "veg" in f_diet and "non" not in f_diet:
            return (60.0, True)  # Might contain dairy
        else:
            return (0.0, False)
            
    if r_pref == "non-vegetarian":
        # Non-veg receiver can consume veg or non-veg
        return (100.0, True)
        
    return (80.0, True)

def generate_recommendation_reason(
    receiver_name: str,
    dist_km: float,
    loc_score: float,
    qty_ratio: float,
    urgency_tier: str,
    pref_match: bool,
    dietary_type: str,
    total_score: float
) -> str:
    """Generates explainable, human-readable rationale for matching recommendation."""
    reasons = []
    
    if not pref_match:
        return f"{receiver_name} is not compatible because their dietary policy does not accept {dietary_type} items."
        
    if dist_km <= 2.5:
        reasons.append(f"is located extremely close ({dist_km} km away)")
    elif dist_km <= 6.0:
        reasons.append(f"is in the nearby vicinity ({dist_km} km away)")
    else:
        reasons.append(f"is {dist_km} km away")
        
    if 0.85 <= qty_ratio <= 1.2:
        reasons.append("has an ideal capacity match for the listed quantity")
    elif qty_ratio < 0.85:
        reasons.append("can comfortably absorb the entire food donation")
    else:
        reasons.append("can absorb a significant portion of this batch")
        
    reasons.append(f"accepts {dietary_type} food")
    
    if urgency_tier in ["Critical", "Urgent"]:
        reasons.append("is situated well for rapid collection within the consumption deadline")
        
    joined = ", ".join(reasons[:-1]) + f", and {reasons[-1]}." if len(reasons) > 1 else reasons[0] + "."
    
    if total_score >= 85:
        prefix = f"Highly Recommended: {receiver_name} "
    elif total_score >= 70:
        prefix = f"Strong Alternative: {receiver_name} "
    else:
        prefix = f"Potential Match: {receiver_name} "
        
    return prefix + joined

def compute_matches_for_donation(
    donation: FoodDonation,
    db: Session
) -> DonationRecommendationResponse:
    """
    Main AI Matching Engine implementation.
    Evaluates all registered receivers against the food donation:
      1. Location Compatibility: 40%
      2. Quantity Compatibility: 25%
      3. Urgency: 25%
      4. Food Preference Compatibility: 10%
    """
    # Resolve donation location coordinates
    don_lat, don_lon = resolve_location_coordinates(
        donation.pickup_location, donation.latitude, donation.longitude
    )
    
    urgency_score, hours_left, urgency_tier = calculate_urgency_score(donation.consumption_deadline)

    # Expired or non-available donations must never be matched or recommended
    if donation.status == "Expired" or urgency_tier == "Expired" or hours_left <= 0:
        return DonationRecommendationResponse(
            donation_id=donation.id,
            food_name=donation.food_name,
            category=donation.category,
            quantity=donation.quantity,
            remaining_quantity=donation.remaining_quantity,
            quantity_unit=donation.quantity_unit,
            dietary_type=donation.dietary_type,
            pickup_location=donation.pickup_location,
            urgency_level="Expired",
            hours_left=0.0,
            best_match=None,
            alternative_matches=[],
            all_recommendations=[],
            algorithm_summary="This food listing has expired and is excluded from AI matching recommendations."
        )
    
    # Query all active receiver users
    receivers = db.query(User).filter(User.role == "receiver", User.is_active == True).all()
    
    matches: List[ReceiverMatchOut] = []
    
    for user in receivers:
        profile: Optional[ReceiverProfile] = user.receiver_profile
        rec_capacity = profile.required_capacity_meals if profile and profile.required_capacity_meals else 40
        rec_diet = profile.dietary_preference if profile and profile.dietary_preference else "Both"
        org_name = profile.organization_name if profile and profile.organization_name else user.full_name
        org_type = profile.organization_type if profile and profile.organization_type else "NGO"
        
        # Coordinates
        rec_lat, rec_lon = resolve_location_coordinates(
            user.location_name or user.address, user.latitude, user.longitude
        )
        
        # 1. Location (40%)
        loc_score, dist_km = calculate_location_compatibility(don_lat, don_lon, rec_lat, rec_lon)
        
        # 2. Quantity (25%)
        qty_score, qty_ratio = calculate_quantity_compatibility(donation.quantity, rec_capacity)
        
        # 3. Urgency (25%)
        # Urgency is global to the donation, but proximity strengthens urgency urgency execution
        final_urg_score = urgency_score
        if urgency_tier in ["Critical", "Urgent"] and dist_km > 15.0:
            # Urgent food far away is harder to rescue in time
            final_urg_score = max(20.0, urgency_score - (dist_km * 1.5))
            
        # 4. Food Preference (10%)
        pref_score, pref_match = calculate_preference_compatibility(donation.dietary_type, rec_diet)
        
        # Calculate Weighted Total (out of 100)
        # If dietary preference is completely incompatible (e.g. strictly veg shelter given non-veg), disqualification applies
        if not pref_match and pref_score == 0:
            total_score = 0.0
        else:
            total_score = round(
                (loc_score * 0.40) +
                (qty_score * 0.25) +
                (final_urg_score * 0.25) +
                (pref_score * 0.10),
                1
            )
            
        breakdown = MatchFactorBreakdown(
            location_score=loc_score,
            distance_km=dist_km,
            quantity_score=qty_score,
            quantity_ratio=qty_ratio,
            urgency_score=round(final_urg_score, 1),
            hours_left=hours_left,
            preference_score=pref_score,
            preference_match=pref_match
        )
        
        reason = generate_recommendation_reason(
            org_name, dist_km, loc_score, qty_ratio,
            urgency_tier, pref_match, donation.dietary_type, total_score
        )
        
        tier = "Best Match" if total_score >= 85 else ("High Match" if total_score >= 70 else "Moderate Match")
        
        matches.append(ReceiverMatchOut(
            receiver_id=user.id,
            receiver_name=user.full_name,
            organization_name=org_name,
            organization_type=org_type,
            location_name=user.location_name or "Manipal",
            contact_phone=user.phone,
            required_quantity=float(rec_capacity),
            dietary_preference=rec_diet,
            total_match_score=total_score,
            factors=breakdown,
            rank=0,  # Will be set after sorting
            tier=tier,
            recommendation_reason=reason
        ))
        
    # Sort descending by match score
    matches.sort(key=lambda m: m.total_match_score, reverse=True)
    
    # Assign ranks
    for idx, match in enumerate(matches):
        match.rank = idx + 1
        
    best_match = matches[0] if matches else None
    alternative_matches = matches[1:4] if len(matches) > 1 else []
    
    summary = (
        "This recommendation is powered by the FoodBridge AI Multi-Factor Optimization Engine. "
        "It applies a weighted formula: Location Compatibility (40%), Quantity Capacity Fit (25%), "
        "Consumption Urgency (25%), and Dietary Preference Verification (10%) to minimize food transit time and ensure zero wastage."
    )
    
    return DonationRecommendationResponse(
        donation_id=donation.id,
        food_name=donation.food_name,
        category=donation.category,
        quantity=donation.quantity,
        quantity_unit=donation.quantity_unit,
        dietary_type=donation.dietary_type,
        pickup_location=donation.pickup_location,
        urgency_level=urgency_tier,
        hours_left=hours_left,
        best_match=best_match,
        alternative_matches=alternative_matches,
        all_recommendations=matches,
        algorithm_summary=summary
    )
