from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, DonorProfile, ReceiverProfile, FoodDonation, FoodRequest, DonationStatusHistory, Notification
from ..schemas import UserRegister, UserLogin, TokenResponse, UserOut, UserProfileUpdate
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Validate role - only donor and receiver are allowed
    role = user_in.role.lower()
    if role not in ["donor", "receiver"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be one of: donor, receiver"
        )

    # Create User
    new_user = User(
        email=user_in.email.lower(),
        hashed_password=hash_password(user_in.password or "password123"),
        full_name=user_in.full_name,
        role=role,
        phone=user_in.phone,
        address=user_in.address,
        location_name=user_in.location_name or "Manipal",
        latitude=user_in.latitude,
        longitude=user_in.longitude,
        profile_picture=user_in.profile_picture,
        is_active=True
    )
    db.add(new_user)
    db.flush()

    # Create associated profile
    if role == "donor":
        profile = DonorProfile(
            user_id=new_user.id,
            organization_type=user_in.organization_type or "Restaurant",
            fssai_license=user_in.fssai_license,
            operating_hours=user_in.operating_hours or "9:00 AM - 10:00 PM",
            description=user_in.description
        )
        db.add(profile)
    elif role == "receiver":
        # Compulsory Organization ID / NGO verification
        if not user_in.organization_id or not user_in.organization_id.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization ID / NGO Registration ID is mandatory for receiver registration."
            )
        profile = ReceiverProfile(
            user_id=new_user.id,
            organization_id=user_in.organization_id.strip(),
            organization_name=user_in.organization_name or user_in.full_name,
            organization_type=user_in.organization_type or "NGO",
            contact_person=user_in.contact_person or user_in.full_name,
            required_capacity_meals=user_in.required_capacity_meals or 40,
            dietary_preference=user_in.dietary_preference or "Both",
            preferred_categories="Cooked Meals,Rice and Grains,Bakery Items",
            verification_status="Verified"
        )
        db.add(profile)

    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    return TokenResponse(access_token=token, token_type="bearer", user=new_user)


@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email.lower()).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support."
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, token_type="bearer", user=user)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_my_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update permitted personal and organization profile fields for the authenticated user."""
    if profile_in.full_name is not None:
        cleaned_name = profile_in.full_name.strip()
        if not cleaned_name:
            raise HTTPException(status_code=400, detail="Full name cannot be empty.")
        current_user.full_name = cleaned_name

    if profile_in.phone is not None:
        current_user.phone = profile_in.phone.strip() or None
    if profile_in.address is not None:
        current_user.address = profile_in.address.strip() or None
    if profile_in.location_name is not None:
        current_user.location_name = profile_in.location_name.strip() or current_user.location_name
    if profile_in.profile_picture is not None:
        pic = profile_in.profile_picture.strip()
        current_user.profile_picture = pic or None

    if current_user.role == "donor":
        donor_prof = current_user.donor_profile
        if not donor_prof:
            donor_prof = DonorProfile(user_id=current_user.id)
            db.add(donor_prof)
            db.flush()
        if profile_in.organization_type is not None:
            donor_prof.organization_type = profile_in.organization_type.strip() or donor_prof.organization_type
        if profile_in.fssai_license is not None:
            donor_prof.fssai_license = profile_in.fssai_license.strip() or None
        if profile_in.operating_hours is not None:
            donor_prof.operating_hours = profile_in.operating_hours.strip() or donor_prof.operating_hours
        if profile_in.description is not None:
            donor_prof.description = profile_in.description.strip() or None

    elif current_user.role == "receiver":
        rec_prof = current_user.receiver_profile
        if not rec_prof:
            rec_prof = ReceiverProfile(
                user_id=current_user.id,
                organization_name=current_user.full_name
            )
            db.add(rec_prof)
            db.flush()
        if profile_in.organization_name is not None:
            org_name = profile_in.organization_name.strip()
            if org_name:
                rec_prof.organization_name = org_name
        if profile_in.organization_type is not None:
            rec_prof.organization_type = profile_in.organization_type.strip() or rec_prof.organization_type
        if profile_in.contact_person is not None:
            rec_prof.contact_person = profile_in.contact_person.strip() or None
        if profile_in.required_capacity_meals is not None:
            if profile_in.required_capacity_meals <= 0:
                raise HTTPException(status_code=400, detail="Required meal capacity must be greater than zero.")
            rec_prof.required_capacity_meals = profile_in.required_capacity_meals
        if profile_in.dietary_preference is not None:
            rec_prof.dietary_preference = profile_in.dietary_preference.strip() or rec_prof.dietary_preference
        if profile_in.preferred_categories is not None:
            rec_prof.preferred_categories = profile_in.preferred_categories.strip() or rec_prof.preferred_categories

    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me")
def delete_my_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Allows the authenticated account owner (Donor or Receiver) to permanently delete their own account."""
    user_id = current_user.id

    # Delete any requests where user is receiver
    db.query(FoodRequest).filter(FoodRequest.receiver_id == user_id).delete(synchronize_session=False)

    # Delete any donations where user is donor (and associated requests/history)
    user_donations = db.query(FoodDonation).filter(FoodDonation.donor_id == user_id).all()
    for d in user_donations:
        db.query(FoodRequest).filter(FoodRequest.donation_id == d.id).delete(synchronize_session=False)
        db.query(DonationStatusHistory).filter(DonationStatusHistory.donation_id == d.id).delete(synchronize_session=False)
        db.delete(d)

    # Delete profiles and notifications
    db.query(DonorProfile).filter(DonorProfile.user_id == user_id).delete(synchronize_session=False)
    db.query(ReceiverProfile).filter(ReceiverProfile.user_id == user_id).delete(synchronize_session=False)
    db.query(Notification).filter(Notification.user_id == user_id).delete(synchronize_session=False)

    # Delete user record
    db.delete(current_user)
    db.commit()

    return {"message": "Your account and all associated data have been permanently deleted."}
