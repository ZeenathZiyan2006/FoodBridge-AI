import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # "donor", "receiver", "admin"
    phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    location_name = Column(String(100), default="Manipal", nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    profile_picture = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    donor_profile = relationship("DonorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    receiver_profile = relationship("ReceiverProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    donations = relationship("FoodDonation", back_populates="donor", foreign_keys="FoodDonation.donor_id")
    requests = relationship("FoodRequest", back_populates="receiver", foreign_keys="FoodRequest.receiver_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class DonorProfile(Base):
    __tablename__ = "donor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    organization_type = Column(String(50), default="Restaurant")  # Restaurant, College Canteen, Hotel, Hostel, Event Organizer, Supermarket, Other
    fssai_license = Column(String(50), nullable=True)
    operating_hours = Column(String(100), default="9:00 AM - 10:00 PM")
    description = Column(Text, nullable=True)

    user = relationship("User", back_populates="donor_profile")


class ReceiverProfile(Base):
    __tablename__ = "receiver_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    organization_name = Column(String(150), nullable=False)
    organization_id = Column(String(100), nullable=True)  # Mandatory verification ID (e.g. DARPAN / Govt Reg ID)
    organization_type = Column(String(50), default="NGO")  # NGO, Orphanage, Shelter, Community Kitchen, Food Bank, Old Age Home
    contact_person = Column(String(100), nullable=True)
    required_capacity_meals = Column(Integer, default=50)
    dietary_preference = Column(String(50), default="Both")  # Vegetarian, Non-Vegetarian, Both, Vegan
    preferred_categories = Column(String(255), default="Cooked Meals,Rice and Grains,Bakery Items")
    verification_status = Column(String(20), default="Verified")

    user = relationship("User", back_populates="receiver_profile")


class FoodDonation(Base):
    __tablename__ = "food_donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # Cooked Meals, Rice and Grains, Fruits, Vegetables, Bakery Items, Packaged Food, Other
    description = Column(Text, nullable=True)
    quantity = Column(Float, nullable=False)
    remaining_quantity = Column(Float, nullable=True)  # Remaining available quantity for multi-receiver allocation
    quantity_unit = Column(String(20), default="Meals")  # Meals, Kg, Packets
    dietary_type = Column(String(30), default="Vegetarian")  # Vegetarian, Non-Vegetarian, Vegan
    prep_time = Column(DateTime, nullable=False)
    consumption_deadline = Column(DateTime, nullable=False)
    storage_condition = Column(String(50), default="Room Temperature")  # Refrigerated, Frozen, Room Temperature, Hot Holding
    allergen_info = Column(String(150), default="None reported")
    pickup_location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    available_pickup_time = Column(String(100), nullable=True)
    donor_contact = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(30), default="Available")  # Available, Requested, Accepted, Ready for Pickup, Collected, Completed, Expired, Cancelled
    expired_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    donor = relationship("User", back_populates="donations")
    requests = relationship("FoodRequest", back_populates="donation", cascade="all, delete-orphan")
    status_history = relationship("DonationStatusHistory", back_populates="donation", cascade="all, delete-orphan", order_by="DonationStatusHistory.timestamp")


class FoodRequest(Base):
    __tablename__ = "food_requests"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("food_donations.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    requested_quantity = Column(Float, nullable=False)
    approved_quantity = Column(Float, nullable=True)  # Quantity allocated by the donor to this receiver
    message = Column(Text, nullable=True)
    status = Column(String(30), default="Requested")  # Requested, Accepted, Rejected, Cancelled, Completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    donation = relationship("FoodDonation", back_populates="requests")
    receiver = relationship("User", back_populates="requests")


class DonationStatusHistory(Base):
    __tablename__ = "donation_status_history"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("food_donations.id"), nullable=False)
    status = Column(String(30), nullable=False)
    updated_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    donation = relationship("FoodDonation", back_populates="status_history")
    updated_by = relationship("User")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(30), default="system")  # request, match, status_change, deadline_alert, system
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
