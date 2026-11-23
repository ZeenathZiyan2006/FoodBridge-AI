import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import FoodDonation, User, ReceiverProfile
from ..schemas import DonationRecommendationResponse, ReceiverMatchOut
from ..matching_engine import compute_matches_for_donation, calculate_location_compatibility, calculate_quantity_compatibility, calculate_urgency_score, calculate_preference_compatibility, resolve_location_coordinates, generate_recommendation_reason
from ..auth import get_current_user

router = APIRouter(prefix="/api/matching", tags=["AI Matching Engine"])

@router.get("/recommendations/{donation_id}", response_model=DonationRecommendationResponse)
def get_recommendations_for_donation(donation_id: int, db: Session = Depends(get_db)):
    """
    Core AI Feature: Runs the multi-factor weighted recommendation algorithm
    for a given food donation and returns ranked receiver matches with
    explainable reasoning.
    """
    donation = db.query(FoodDonation).filter(FoodDonation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found.")

    recommendations = compute_matches_for_donation(donation, db)
    return recommendations

@router.get("/receiver-feed")
def get_personalized_receiver_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns available food donations ranked specifically for the logged-in receiver,
    ordered by highest compatibility score.
    """
    if current_user.role not in ["receiver", "admin"]:
        raise HTTPException(status_code=403, detail="Available only to receivers or admin.")

    profile = current_user.receiver_profile
    rec_capacity = profile.required_capacity_meals if profile and profile.required_capacity_meals else 40
    rec_diet = profile.dietary_preference if profile and profile.dietary_preference else "Both"
    org_name = profile.organization_name if profile and profile.organization_name else current_user.full_name

    rec_lat, rec_lon = resolve_location_coordinates(
        current_user.location_name or current_user.address,
        current_user.latitude,
        current_user.longitude
    )

    now = datetime.datetime.utcnow()
    # Fetch all Available and active donations
    donations = db.query(FoodDonation).filter(
        FoodDonation.status == "Available",
        FoodDonation.consumption_deadline > now
    ).all()

    scored_donations = []

    for d in donations:
        urg_score, hours_left, urg_tier = calculate_urgency_score(d.consumption_deadline)
        rem = d.remaining_quantity if d.remaining_quantity is not None else d.quantity

        # Requirement 7: Strictly exclude expired, exhausted, or unavailable food from receiver recommendations
        if hours_left <= 0 or urg_tier == "Expired" or rem <= 0:
            continue

        don_lat, don_lon = resolve_location_coordinates(
            d.pickup_location, d.latitude, d.longitude
        )

        loc_score, dist_km = calculate_location_compatibility(don_lat, don_lon, rec_lat, rec_lon)
        qty_score, qty_ratio = calculate_quantity_compatibility(rem, rec_capacity)
        pref_score, pref_match = calculate_preference_compatibility(d.dietary_type, rec_diet)

        if not pref_match and pref_score == 0:
            total_score = 0.0
        else:
            total_score = round(
                (loc_score * 0.40) +
                (qty_score * 0.25) +
                (urg_score * 0.25) +
                (pref_score * 0.10),
                1
            )

        reason = generate_recommendation_reason(
            org_name, dist_km, loc_score, qty_ratio,
            urg_tier, pref_match, d.dietary_type, total_score
        )

        scored_donations.append({
            "donation": {
                "id": d.id,
                "donor_id": d.donor_id,
                "food_name": d.food_name,
                "category": d.category,
                "description": d.description,
                "quantity": d.quantity,
                "quantity_unit": d.quantity_unit,
                "dietary_type": d.dietary_type,
                "prep_time": d.prep_time,
                "consumption_deadline": d.consumption_deadline,
                "storage_condition": d.storage_condition,
                "allergen_info": d.allergen_info,
                "pickup_location": d.pickup_location,
                "available_pickup_time": d.available_pickup_time,
                "donor_contact": d.donor_contact,
                "image_url": d.image_url,
                "status": d.status,
                "urgency_level": urg_tier,
                "hours_left": hours_left
            },
            "match_score": total_score,
            "distance_km": dist_km,
            "quantity_ratio": qty_ratio,
            "dietary_compatible": pref_match,
            "reason": reason
        })

    # Sort descending by match score
    scored_donations.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_donations
