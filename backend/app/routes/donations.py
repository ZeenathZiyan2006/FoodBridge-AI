import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import FoodDonation, User, DonationStatusHistory, Notification, FoodRequest
from ..schemas import FoodDonationCreate, FoodDonationUpdate, FoodDonationOut
from ..auth import get_current_user, get_optional_user, require_roles
from ..matching_engine import resolve_location_coordinates

router = APIRouter(prefix="/api/donations", tags=["Donations"])

def compute_donation_urgency(donation: FoodDonation) -> tuple[str, float]:
    """Computes urgency tier and remaining hours dynamically."""
    now = datetime.datetime.utcnow()
    diff = (donation.consumption_deadline - now).total_seconds()
    hours_left = round(diff / 3600.0, 1)

    if hours_left <= 0:
        return "Expired", hours_left
    elif hours_left <= 2.0:
        return "Critical", hours_left
    elif hours_left <= 5.0:
        return "Urgent", hours_left
    else:
        return "Normal", hours_left

def enrich_donation_out(donation: FoodDonation) -> FoodDonationOut:
    """Helper to attach computed urgency and hours_left to output schema."""
    urgency_tier, hours_left = compute_donation_urgency(donation)
    
    # Auto-adjust status to Expired if passed deadline and was still Available
    effective_status = donation.status
    if hours_left <= 0 and effective_status == "Available":
        effective_status = "Expired"

    d_out = FoodDonationOut.from_orm(donation)
    d_out.status = effective_status
    d_out.urgency_level = urgency_tier
    d_out.hours_left = hours_left
    return d_out

@router.get("", response_model=List[FoodDonationOut])
def list_donations(
    category: Optional[str] = None,
    dietary_type: Optional[str] = None,
    location: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    urgency: Optional[str] = None,
    only_available: bool = Query(False),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(FoodDonation)

    if status_filter:
        query = query.filter(FoodDonation.status == status_filter)
    elif only_available:
        query = query.filter(FoodDonation.status == "Available")
    
    if category and category != "All":
        query = query.filter(FoodDonation.category == category)

    if dietary_type and dietary_type != "All":
        query = query.filter(FoodDonation.dietary_type == dietary_type)

    if location and location != "All":
        query = query.filter(FoodDonation.pickup_location.ilike(f"%{location}%"))

    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (FoodDonation.food_name.ilike(search_fmt)) |
            (FoodDonation.description.ilike(search_fmt)) |
            (FoodDonation.pickup_location.ilike(search_fmt)) |
            (FoodDonation.category.ilike(search_fmt))
        )

    # Order newest first
    donations = query.order_by(desc(FoodDonation.created_at)).limit(limit).all()

    # Post-process urgency and filter if urgency query parameter is provided
    results = []
    for d in donations:
        enriched = enrich_donation_out(d)

        # Strict safety check: If filtering for available food or only_available is set,
        # exclude any donation that is not strictly Available or whose consumption deadline passed (expired)
        if only_available or status_filter == "Available":
            if enriched.status != "Available" or enriched.hours_left <= 0:
                continue

        if urgency and urgency != "All":
            if urgency.lower() == "urgent" and enriched.urgency_level not in ["Critical", "Urgent"]:
                continue
            elif urgency.lower() != "urgent" and enriched.urgency_level.lower() != urgency.lower():
                continue
        results.append(enriched)

    return results

@router.get("/my-donations", response_model=List[FoodDonationOut])
def get_my_donations(
    current_user: User = Depends(require_roles(["donor", "admin"])),
    db: Session = Depends(get_db)
):
    """Retrieve all donations listed by the logged-in donor."""
    donations = db.query(FoodDonation)\
        .filter(FoodDonation.donor_id == current_user.id)\
        .order_by(desc(FoodDonation.created_at))\
        .all()
    return [enrich_donation_out(d) for d in donations]

@router.get("/{donation_id}", response_model=FoodDonationOut)
def get_donation(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(FoodDonation).filter(FoodDonation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found.")
    return enrich_donation_out(donation)

@router.post("", response_model=FoodDonationOut, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation_in: FoodDonationCreate,
    current_user: User = Depends(require_roles(["donor", "admin"])),
    db: Session = Depends(get_db)
):
    """Create a new food donation listing."""
    # Ensure deadline is in the future
    now = datetime.datetime.utcnow()
    if donation_in.consumption_deadline.replace(tzinfo=None) <= now:
        raise HTTPException(
            status_code=400,
            detail="Consumption deadline must be a future time to guarantee food safety."
        )

    # Resolve coordinates if not provided
    lat, lon = resolve_location_coordinates(
        donation_in.pickup_location,
        donation_in.latitude,
        donation_in.longitude
    )

    # Default placeholder image based on category if not provided
    default_images = {
        "Cooked Meals": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        "Rice and Grains": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
        "Fruits": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80",
        "Vegetables": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        "Bakery Items": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
        "Packaged Food": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
        "Other": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80"
    }
    img = donation_in.image_url or default_images.get(donation_in.category, default_images["Other"])

    new_donation = FoodDonation(
        donor_id=current_user.id,
        food_name=donation_in.food_name,
        category=donation_in.category,
        description=donation_in.description,
        quantity=donation_in.quantity,
        quantity_unit=donation_in.quantity_unit,
        dietary_type=donation_in.dietary_type,
        prep_time=donation_in.prep_time.replace(tzinfo=None),
        consumption_deadline=donation_in.consumption_deadline.replace(tzinfo=None),
        storage_condition=donation_in.storage_condition,
        allergen_info=donation_in.allergen_info or "None reported",
        pickup_location=donation_in.pickup_location,
        latitude=lat,
        longitude=lon,
        available_pickup_time=donation_in.available_pickup_time or "Immediate / Contact Donor",
        donor_contact=donation_in.donor_contact or current_user.phone or current_user.email,
        image_url=img,
        status="Available"
    )
    db.add(new_donation)
    db.flush()

    # Add initial status history record
    history = DonationStatusHistory(
        donation_id=new_donation.id,
        status="Available",
        updated_by_user_id=current_user.id,
        notes=f"Listed by {current_user.full_name} on FoodBridge AI.",
        timestamp=now
    )
    db.add(history)

    # Smart Notification: Alert receivers in the area about fresh food
    receivers = db.query(User).filter(User.role == "receiver", User.is_active == True).all()
    for rec in receivers:
        notif = Notification(
            user_id=rec.id,
            title="Fresh Food Listed Nearby",
            message=f"{current_user.full_name} listed {new_donation.quantity} {new_donation.quantity_unit} of '{new_donation.food_name}' in {new_donation.pickup_location}.",
            notification_type="match",
            is_read=False,
            link=f"/donation/{new_donation.id}",
            created_at=now
        )
        db.add(notif)

    db.commit()
    db.refresh(new_donation)
    return enrich_donation_out(new_donation)

@router.put("/{donation_id}", response_model=FoodDonationOut)
def update_donation(
    donation_id: int,
    donation_update: FoodDonationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    donation = db.query(FoodDonation).filter(FoodDonation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found.")

    # Authorization: Only creator or admin can update
    if donation.donor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to edit this donation.")

    update_data = donation_update.dict(exclude_unset=True)
    if "consumption_deadline" in update_data and update_data["consumption_deadline"]:
        update_data["consumption_deadline"] = update_data["consumption_deadline"].replace(tzinfo=None)

    for field, value in update_data.items():
        setattr(donation, field, value)

    donation.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(donation)
    return enrich_donation_out(donation)

@router.delete("/{donation_id}")
def delete_donation(
    donation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    donation = db.query(FoodDonation).filter(FoodDonation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found.")

    if donation.donor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to delete this listing.")

    db.delete(donation)
    db.commit()
    return {"message": "Donation successfully deleted", "donation_id": donation_id}
