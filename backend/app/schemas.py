from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str  # "donor", "receiver"
    phone: Optional[str] = None
    address: Optional[str] = None
    location_name: Optional[str] = "Manipal"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserRegister(UserBase):
    password: Optional[str] = "password123"
    organization_type: Optional[str] = None
    # Receiver-specific
    organization_name: Optional[str] = None
    organization_id: Optional[str] = None  # Mandatory verification ID (Govt Reg / DARPAN ID)
    contact_person: Optional[str] = None
    required_capacity_meals: Optional[int] = 50
    dietary_preference: Optional[str] = "Both"
    # Donor-specific
    fssai_license: Optional[str] = None
    operating_hours: Optional[str] = None
    description: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class DonorProfileOut(BaseModel):
    organization_type: Optional[str] = None
    fssai_license: Optional[str] = None
    operating_hours: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class ReceiverProfileOut(BaseModel):
    organization_name: Optional[str] = None
    organization_id: Optional[str] = None
    organization_type: Optional[str] = None
    contact_person: Optional[str] = None
    required_capacity_meals: Optional[int] = None
    dietary_preference: Optional[str] = None
    preferred_categories: Optional[str] = None
    verification_status: Optional[str] = "Verified"

    class Config:
        from_attributes = True

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    donor_profile: Optional[DonorProfileOut] = None
    receiver_profile: Optional[ReceiverProfileOut] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Food Donation Schemas
class FoodDonationCreate(BaseModel):
    food_name: str
    category: str  # Cooked Meals, Rice and Grains, Fruits, Vegetables, Bakery Items, Packaged Food, Other
    description: Optional[str] = None
    quantity: float
    remaining_quantity: Optional[float] = None
    quantity_unit: str = "Meals"  # Meals, Kg, Packets
    dietary_type: str = "Vegetarian"  # Vegetarian, Non-Vegetarian, Vegan
    prep_time: datetime
    consumption_deadline: datetime
    storage_condition: str = "Room Temperature"  # Refrigerated, Frozen, Room Temperature, Hot Holding
    allergen_info: Optional[str] = "None reported"
    pickup_location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    available_pickup_time: Optional[str] = None
    donor_contact: Optional[str] = None
    image_url: Optional[str] = None

class FoodDonationUpdate(BaseModel):
    food_name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = None
    quantity_unit: Optional[str] = None
    dietary_type: Optional[str] = None
    consumption_deadline: Optional[datetime] = None
    storage_condition: Optional[str] = None
    allergen_info: Optional[str] = None
    pickup_location: Optional[str] = None
    available_pickup_time: Optional[str] = None
    donor_contact: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

class StatusHistoryOut(BaseModel):
    id: int
    status: str
    notes: Optional[str] = None
    timestamp: datetime
    updated_by_user_id: Optional[int] = None

    class Config:
        from_attributes = True

class FoodRequestOut(BaseModel):
    id: int
    donation_id: int
    receiver_id: int
    requested_quantity: float
    approved_quantity: Optional[float] = None
    message: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    receiver: Optional[UserOut] = None

    class Config:
        from_attributes = True

class FoodDonationOut(BaseModel):
    id: int
    donor_id: int
    food_name: str
    category: str
    description: Optional[str] = None
    quantity: float
    remaining_quantity: Optional[float] = None
    quantity_unit: str
    dietary_type: str
    prep_time: datetime
    consumption_deadline: datetime
    storage_condition: str
    allergen_info: Optional[str] = None
    pickup_location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    available_pickup_time: Optional[str] = None
    donor_contact: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    donor: Optional[UserOut] = None
    requests: Optional[List[FoodRequestOut]] = []
    status_history: Optional[List[StatusHistoryOut]] = []
    
    # Dynamic computed fields
    urgency_level: Optional[str] = "Normal"  # Expired, Critical, Urgent, Normal
    hours_left: Optional[float] = None

    class Config:
        from_attributes = True

# Food Request Schemas
class FoodRequestCreate(BaseModel):
    donation_id: int
    requested_quantity: float
    message: Optional[str] = None

class StatusUpdateSchema(BaseModel):
    status: str
    approved_quantity: Optional[float] = None
    notes: Optional[str] = None

# AI Matching Result Schemas
class MatchFactorBreakdown(BaseModel):
    location_score: float
    location_weight: float = 0.40
    distance_km: float
    
    quantity_score: float
    quantity_weight: float = 0.25
    quantity_ratio: float
    
    urgency_score: float
    urgency_weight: float = 0.25
    hours_left: float
    
    preference_score: float
    preference_weight: float = 0.10
    preference_match: bool

class ReceiverMatchOut(BaseModel):
    receiver_id: int
    receiver_name: str
    organization_name: str
    organization_type: str
    location_name: str
    contact_phone: Optional[str] = None
    required_quantity: float
    dietary_preference: str
    
    total_match_score: float
    factors: MatchFactorBreakdown
    rank: int
    tier: str  # "Best Match", "High Match", "Moderate Match"
    recommendation_reason: str

class DonationRecommendationResponse(BaseModel):
    donation_id: int
    food_name: str
    category: str
    quantity: float
    remaining_quantity: Optional[float] = None
    quantity_unit: str
    dietary_type: str
    pickup_location: str
    urgency_level: str
    hours_left: float
    
    best_match: Optional[ReceiverMatchOut] = None
    alternative_matches: List[ReceiverMatchOut] = []
    all_recommendations: List[ReceiverMatchOut] = []
    algorithm_summary: str

# Notification Schema
class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics / Hotspots Schemas
class HotspotItem(BaseModel):
    location: str
    donation_count: int
    total_meals: float
    top_category: str
    active_donors_count: int

class ImpactMetricsOut(BaseModel):
    total_donations: int
    active_donors: int
    active_receivers: int
    total_meals_listed: float
    total_meals_redistributed: float
    redistribution_rate: float
    estimated_people_fed: int
    estimated_co2_saved_kg: float
    estimated_water_saved_liters: float
    pending_requests: int
    completed_donations: int
    urgent_donations: int
    expired_donations: int

# AI Surplus Food Prediction Schemas
class SurplusPredictionRequest(BaseModel):
    establishment_type: str = "College Canteen"  # College Canteen, Hostel Mess, Restaurant, Hotel Banquet, Corporate Cafeteria
    day_of_week: str = "Friday"
    meal_type: str = "Lunch"
    prepared_meals: int = 300
    event_factor: str = "Normal Day"  # Normal Day, Exam Week, Campus Fest / Event, Weekend Outing, Heavy Rain / Weather

class SurplusCategoryItem(BaseModel):
    category: str
    expected_meals: float
    percentage: float

class SurplusPredictionResponse(BaseModel):
    establishment_type: str
    day_of_week: str
    meal_type: str
    prepared_meals: int
    predicted_surplus_meals: float
    predicted_surplus_kg: float
    surplus_percentage: float
    confidence_score: float
    risk_level: str  # Low, Medium, High, Critical
    top_surplus_categories: List[SurplusCategoryItem]
    actionable_recommendations: List[str]
    forecast_timeline: List[dict]

# AI Pickup Route Planner Schemas
class RouteStop(BaseModel):
    stop_number: int
    stop_type: str  # "pickup" or "delivery"
    location_name: str
    address: str
    contact_phone: Optional[str] = None
    donation_id: Optional[int] = None
    food_name: Optional[str] = None
    quantity: Optional[float] = None
    urgency_tier: Optional[str] = None
    hours_left: Optional[float] = None
    estimated_arrival_minutes: int
    latitude: float
    longitude: float

class RouteOptimizationResponse(BaseModel):
    total_stops: int
    total_distance_km: float
    estimated_travel_time_minutes: int
    carbon_saved_kg: float
    route_summary: str
    stops: List[RouteStop]

# Verified Trust & Reliability Schemas
class OrganizationTrustProfile(BaseModel):
    user_id: int
    organization_name: str
    role: str
    verification_badge: str
    verification_id: Optional[str] = None
    reliability_score: float  # e.g. 98.5%
    trust_tier: str  # "Gold Verified", "Silver Verified", "Pending Review"
    completed_pickups: int
    cancelled_pickups: int
    missed_pickups: int
    feedback_rating: float  # 0 to 5.0
    feedback_count: int
    flagged_for_review: bool
    review_notes: Optional[str] = None
