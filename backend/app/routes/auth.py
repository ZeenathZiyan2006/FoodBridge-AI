from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, DonorProfile, ReceiverProfile
from ..schemas import UserRegister, UserLogin, TokenResponse, UserOut
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

    # Validate role
    role = user_in.role.lower()
    if role not in ["donor", "receiver", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be one of: donor, receiver, admin"
        )

    # Create User
    new_user = User(
        email=user_in.email.lower(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        role=role,
        phone=user_in.phone,
        address=user_in.address,
        location_name=user_in.location_name or "Manipal",
        latitude=user_in.latitude,
        longitude=user_in.longitude,
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
        profile = ReceiverProfile(
            user_id=new_user.id,
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
            detail="Your account has been deactivated. Please contact the administrator."
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, token_type="bearer", user=user)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns sample demo accounts with roles and passwords for 1-click evaluation."""
    return [
        {
            "role": "donor",
            "title": "Food Donor (College Canteen)",
            "name": "Manipal Food Court & MIT Canteen",
            "email": "donor.manipal@foodbridge.ai",
            "password": "password123",
            "location": "MIT Campus, Manipal",
            "description": "Lists large batches of surplus lunch and dinner meals from campus canteens."
        },
        {
            "role": "donor",
            "title": "Food Donor (Udupi Restaurant)",
            "name": "Hotel Sri Krishna Woodlands",
            "email": "donor.udupi@foodbridge.ai",
            "password": "password123",
            "location": "Car Street, Udupi",
            "description": "Traditional South Indian vegetarian restaurant listing authentic meals."
        },
        {
            "role": "receiver",
            "title": "Food Receiver (Orphanage)",
            "name": "Hope Children's Orphanage",
            "email": "receiver.hope@foodbridge.ai",
            "password": "password123",
            "location": "Manipal",
            "description": "Requires ~35 vegetarian meals daily for children in need."
        },
        {
            "role": "receiver",
            "title": "Food Receiver (Shelter)",
            "name": "Karunalaya Destitute Care Shelter",
            "email": "receiver.udupi@foodbridge.ai",
            "password": "password123",
            "location": "Bannanje, Udupi",
            "description": "Requires ~50 meals daily for homeless destitutes and elderly patients."
        },
        {
            "role": "admin",
            "title": "System Administrator",
            "name": "Dr. Arvind Prabhu (Sustainability Director)",
            "email": "admin@foodbridge.ai",
            "password": "password123",
            "location": "MIT Campus, Manipal",
            "description": "Full platform oversight, waste hotspot analytics, and redistribution audits."
        }
    ]


@router.post("/quick-login/{role}", response_model=TokenResponse)
def quick_demo_login(role: str, db: Session = Depends(get_db)):
    """Fast 1-click demo login endpoint for evaluator convenience."""
    role = role.lower()
    email_map = {
        "donor": "donor.manipal@foodbridge.ai",
        "receiver": "receiver.hope@foodbridge.ai",
        "admin": "admin@foodbridge.ai"
    }
    target_email = email_map.get(role)
    if not target_email:
        raise HTTPException(status_code=400, detail="Invalid demo role. Use donor, receiver, or admin.")

    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        # Fallback to any user with this role
        user = db.query(User).filter(User.role == role).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"No demo user found for role: {role}")

    token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, token_type="bearer", user=user)
