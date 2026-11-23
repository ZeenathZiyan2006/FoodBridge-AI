import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import FoodRequest, FoodDonation, User, DonationStatusHistory, Notification
from ..schemas import FoodRequestCreate, FoodRequestOut, StatusUpdateSchema
from ..auth import get_current_user, require_roles

router = APIRouter(prefix="/api/requests", tags=["Food Requests"])

LIFECYCLE_STAGES = ["Available", "Requested", "Accepted", "Ready for Pickup", "Collected", "Completed", "Cancelled"]

@router.post("", response_model=FoodRequestOut, status_code=status.HTTP_201_CREATED)
def create_food_request(
    request_in: FoodRequestCreate,
    current_user: User = Depends(require_roles(["receiver", "admin"])),
    db: Session = Depends(get_db)
):
    """Receiver requests surplus food donation."""
    donation = db.query(FoodDonation).filter(FoodDonation.id == request_in.donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found.")

    # Check if expired
    now = datetime.datetime.utcnow()
    if donation.consumption_deadline <= now or donation.status == "Expired":
        raise HTTPException(
            status_code=400,
            detail="Safety Violation: This food donation has passed its consumption deadline and cannot be requested."
        )

    # Check if donation is available or accepting requests
    if donation.status in ["Completed", "Cancelled"]:
        raise HTTPException(
            status_code=400,
            detail=f"This donation is currently '{donation.status}' and no longer accepts requests."
        )

    # Quantity validation (must be positive integer)
    if request_in.requested_quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Requested quantity must be a positive whole number (at least 1)."
        )

    # Check available remaining quantity
    available_qty = donation.remaining_quantity if donation.remaining_quantity is not None else donation.quantity
    if available_qty <= 0:
        raise HTTPException(
            status_code=400,
            detail="This food donation has already been fully allocated to receivers."
        )

    if request_in.requested_quantity > available_qty:
        raise HTTPException(
            status_code=400,
            detail=f"Requested quantity ({int(request_in.requested_quantity)}) exceeds available quantity ({int(available_qty)} {donation.quantity_unit})."
        )

    # Check for duplicate active request by this receiver for this donation
    existing_req = db.query(FoodRequest).filter(
        FoodRequest.donation_id == donation.id,
        FoodRequest.receiver_id == current_user.id,
        FoodRequest.status.in_(["Requested", "Accepted", "Ready for Pickup"])
    ).first()
    if existing_req:
        raise HTTPException(
            status_code=400,
            detail="You already have an active request submitted for this donation."
        )

    # Create the request
    new_request = FoodRequest(
        donation_id=donation.id,
        receiver_id=current_user.id,
        requested_quantity=int(request_in.requested_quantity),
        message=request_in.message or "Food request submitted via FoodBridge AI.",
        status="Requested"
    )
    db.add(new_request)

    # Keep donation status as Available so other receivers can also request portions!
    # If remaining_quantity is not yet set, set it to total quantity
    if donation.remaining_quantity is None:
        donation.remaining_quantity = donation.quantity

    # Log in DonationStatusHistory
    history = DonationStatusHistory(
        donation_id=donation.id,
        status="Requested",
        updated_by_user_id=current_user.id,
        notes=f"Food requested by receiver '{current_user.full_name}' ({request_in.requested_quantity} {donation.quantity_unit}).",
        timestamp=now
    )
    db.add(history)

    # In-app notification to the Donor
    donor_notif = Notification(
        user_id=donation.donor_id,
        title="New Food Request Received",
        message=f"{current_user.full_name} has requested {request_in.requested_quantity} {donation.quantity_unit} of your listing '{donation.food_name}'.",
        notification_type="request",
        is_read=False,
        link="/donor-dashboard",
        created_at=now
    )
    db.add(donor_notif)

    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/my-requests", response_model=List[FoodRequestOut])
def get_my_requests(
    current_user: User = Depends(require_roles(["receiver", "admin"])),
    db: Session = Depends(get_db)
):
    """Retrieve all requests made by the logged-in receiver."""
    requests = db.query(FoodRequest)\
        .filter(FoodRequest.receiver_id == current_user.id)\
        .order_by(desc(FoodRequest.created_at))\
        .all()
    return requests

@router.get("/donation/{donation_id}", response_model=List[FoodRequestOut])
def get_requests_for_donation(
    donation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve requests for a specific donation (owner donor, receiver who requested, or admin)."""
    donation = db.query(FoodDonation).filter(FoodDonation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found.")

    if current_user.role != "admin" and donation.donor_id != current_user.id:
        # If receiver, only show their own request
        requests = db.query(FoodRequest).filter(
            FoodRequest.donation_id == donation_id,
            FoodRequest.receiver_id == current_user.id
        ).all()
        return requests

    return db.query(FoodRequest).filter(FoodRequest.donation_id == donation_id).all()

@router.patch("/{request_id}/status", response_model=FoodRequestOut)
def update_request_status(
    request_id: int,
    status_update: StatusUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Lifecycle status progression:
    Available -> Requested -> Accepted -> Ready for Pickup -> Collected -> Completed
    """
    req = db.query(FoodRequest).filter(FoodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found.")

    donation = req.donation
    new_status = status_update.status
    now = datetime.datetime.utcnow()

    # Permissions check:
    # Accept / Reject / Ready for Pickup / Completed can be done by Donor or Admin
    # Collected / Cancelled can also be marked by Receiver
    is_donor = (donation.donor_id == current_user.id)
    is_receiver = (req.receiver_id == current_user.id)
    is_admin = (current_user.role == "admin")

    if not (is_donor or is_receiver or is_admin):
        raise HTTPException(status_code=403, detail="You do not have permission to update this request.")

    # Apply status change
    req.status = new_status
    req.updated_at = now

    # Handle donor partial quantity allocation when accepting
    if new_status == "Accepted":
        approved_qty = status_update.approved_quantity
        if approved_qty is None or approved_qty <= 0:
            approved_qty = req.requested_quantity
        approved_qty = float(approved_qty)

        current_rem = donation.remaining_quantity if donation.remaining_quantity is not None else donation.quantity
        if approved_qty > current_rem:
            raise HTTPException(
                status_code=400,
                detail=f"Approved quantity ({int(approved_qty)}) exceeds available remaining quantity ({int(current_rem)} {donation.quantity_unit})."
            )

        req.approved_quantity = approved_qty
        donation.remaining_quantity = max(0.0, current_rem - approved_qty)

        # If all portions allocated, donation becomes Accepted; otherwise remains Available for others!
        if donation.remaining_quantity <= 0:
            donation.status = "Accepted"
        else:
            donation.status = "Available"
        donation.updated_at = now

    elif new_status in ["Ready for Pickup", "Collected", "Completed"]:
        if (donation.remaining_quantity or 0.0) <= 0:
            donation.status = new_status
            donation.updated_at = now

    elif new_status in ["Rejected", "Cancelled"]:
        # If this was previously accepted, return quantity back to pool
        if req.approved_quantity and req.approved_quantity > 0:
            donation.remaining_quantity = (donation.remaining_quantity or 0.0) + req.approved_quantity
            req.approved_quantity = 0.0
            if donation.remaining_quantity > 0:
                donation.status = "Available"
                donation.updated_at = now
        else:
            other_active = db.query(FoodRequest).filter(
                FoodRequest.donation_id == donation.id,
                FoodRequest.id != req.id,
                FoodRequest.status.in_(["Requested", "Accepted"])
            ).first()
            if not other_active and (donation.remaining_quantity or 0.0) > 0:
                donation.status = "Available"
                donation.updated_at = now

    # Status history log
    note_text = status_update.notes or f"Status transitioned to '{new_status}' by {current_user.full_name}."
    history = DonationStatusHistory(
        donation_id=donation.id,
        status=new_status,
        updated_by_user_id=current_user.id,
        notes=note_text,
        timestamp=now
    )
    db.add(history)

    # In-app notification to receiver
    if is_donor or is_admin:
        notif = Notification(
            user_id=req.receiver_id,
            title=f"Request {new_status}: {donation.food_name}",
            message=f"Your request for '{donation.food_name}' was updated to '{new_status}'. Notes: {note_text}",
            notification_type="status_change",
            is_read=False,
            link=f"/donation/{donation.id}",
            created_at=now
        )
        db.add(notif)
    elif is_receiver and is_donor is False:
        # Receiver marked collected or cancelled -> notify donor
        notif = Notification(
            user_id=donation.donor_id,
            title=f"Donation Status Update: {new_status}",
            message=f"Receiver {current_user.full_name} updated '{donation.food_name}' to '{new_status}'.",
            notification_type="status_change",
            is_read=False,
            link=f"/donation/{donation.id}",
            created_at=now
        )
        db.add(notif)

    db.commit()
    db.refresh(req)
    return req
