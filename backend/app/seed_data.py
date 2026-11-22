import datetime
from sqlalchemy.orm import Session
from .models import (
    User, DonorProfile, ReceiverProfile, FoodDonation,
    FoodRequest, DonationStatusHistory, Notification
)
from .auth import hash_password

def seed_initial_data(db: Session):
    """Seed comprehensive realistic data for the college innovation exhibition."""
    # Check if data already exists
    existing_users = db.query(User).count()
    if existing_users > 0:
        return

    print("Seeding initial database with realistic donors, receivers, and donations...")

    # Default password for all demo accounts
    demo_pw = hash_password("password123")
    now = datetime.datetime.utcnow()

    # 1. ADMIN USER
    admin_user = User(
        email="admin@foodbridge.ai",
        hashed_password=demo_pw,
        full_name="Dr. Arvind Prabhu (Sustainability Director)",
        role="admin",
        phone="+91 98450 12345",
        address="Academic Block 1, MIT Campus",
        location_name="Manipal",
        latitude=13.3565,
        longitude=74.7890,
        is_active=True,
        created_at=now - datetime.timedelta(days=30)
    )
    db.add(admin_user)

    # 2. DONOR USERS & PROFILES
    donors_data = [
        {
            "email": "donor.manipal@foodbridge.ai",
            "name": "Manipal Food Court & MIT Canteen",
            "phone": "+91 98451 11223",
            "address": "MIT Campus Food Court, Manipal",
            "location": "Manipal",
            "lat": 13.3565, "lon": 74.7890,
            "org_type": "College Canteen",
            "fssai": "FSSAI-11223344556677",
            "hours": "7:30 AM - 10:30 PM",
            "desc": "Official campus canteen serving over 4,000 students daily with strict quality and hygiene standards."
        },
        {
            "email": "donor.udupi@foodbridge.ai",
            "name": "Hotel Sri Krishna Woodlands",
            "phone": "+91 98452 22334",
            "address": "Car Street, Near Krishna Temple, Udupi",
            "location": "Udupi",
            "lat": 13.3420, "lon": 74.7450,
            "org_type": "Restaurant",
            "fssai": "FSSAI-22334455667788",
            "hours": "7:00 AM - 11:00 PM",
            "desc": "Renowned traditional Udupi vegetarian restaurant preparing nutritious, high-quality meals."
        },
        {
            "email": "donor.bistro@foodbridge.ai",
            "name": "Green Valley Bistro & Cafe",
            "phone": "+91 98453 33445",
            "address": "Tiger Circle, End Point Road, Manipal",
            "location": "Tiger Circle, Manipal",
            "lat": 13.3530, "lon": 74.7850,
            "org_type": "Restaurant",
            "fssai": "FSSAI-33445566778899",
            "hours": "11:00 AM - 11:30 PM",
            "desc": "Continental and multi-cuisine restaurant committed to zero food waste initiatives."
        },
        {
            "email": "donor.bakery@foodbridge.ai",
            "name": "Crown Bakery & Patisserie",
            "phone": "+91 98454 44556",
            "address": "Eshwar Nagar, Manipal",
            "location": "Manipal",
            "lat": 13.3510, "lon": 74.7880,
            "org_type": "Bakery",
            "fssai": "FSSAI-44556677889900",
            "hours": "8:00 AM - 10:00 PM",
            "desc": "Artisan bakery producing fresh sourdough, whole wheat breads, sandwiches and pastries."
        },
        {
            "email": "donor.hostel@foodbridge.ai",
            "name": "KMC Central Hostel Mess",
            "phone": "+91 98455 55667",
            "address": "Madhav Kripa Road, Manipal",
            "location": "Manipal",
            "lat": 13.3540, "lon": 74.7875,
            "org_type": "Hostel",
            "fssai": "FSSAI-55667788990011",
            "hours": "6:30 AM - 9:30 PM",
            "desc": "Student mess catering to medical resident doctors and students with wholesome balanced food."
        },
        {
            "email": "donor.events@foodbridge.ai",
            "name": "Udupi Royal Convention Center",
            "phone": "+91 98456 66778",
            "address": "NH 66, Santhekatte, Udupi",
            "location": "Santhekatte, Udupi",
            "lat": 13.3750, "lon": 74.7550,
            "org_type": "Event Organizer",
            "fssai": "FSSAI-66778899001122",
            "hours": "24 Hours Event Services",
            "desc": "Large banquet and convention venue hosting weddings, seminars, and community banquets."
        }
    ]

    donor_users = []
    for d in donors_data:
        u = User(
            email=d["email"],
            hashed_password=demo_pw,
            full_name=d["name"],
            role="donor",
            phone=d["phone"],
            address=d["address"],
            location_name=d["location"],
            latitude=d["lat"],
            longitude=d["lon"],
            is_active=True,
            created_at=now - datetime.timedelta(days=15)
        )
        db.add(u)
        db.flush()
        donor_users.append(u)

        dp = DonorProfile(
            user_id=u.id,
            organization_type=d["org_type"],
            fssai_license=d["fssai"],
            operating_hours=d["hours"],
            description=d["desc"]
        )
        db.add(dp)

    # 3. RECEIVER USERS & PROFILES
    receivers_data = [
        {
            "email": "receiver.hope@foodbridge.ai",
            "name": "Sister Jacintha (Director)",
            "org_name": "Hope Children's Orphanage & Care Home",
            "phone": "+91 98457 77889",
            "address": "Perampalli Road, Manipal",
            "location": "Manipal",
            "lat": 13.3550, "lon": 74.7840,
            "org_type": "Orphanage",
            "capacity": 35,
            "diet": "Vegetarian",
            "categories": "Cooked Meals,Rice and Grains,Bakery Items,Fruits",
            "contact": "Sister Jacintha"
        },
        {
            "email": "receiver.udupi@foodbridge.ai",
            "name": "Ramesh Nayak (Shelter Lead)",
            "org_name": "Karunalaya Destitute Care Shelter",
            "phone": "+91 98458 88990",
            "address": "Bannanje, Near City Bus Stand, Udupi",
            "location": "Udupi",
            "lat": 13.3415, "lon": 74.7430,
            "org_type": "Shelter",
            "capacity": 50,
            "diet": "Both",
            "categories": "Cooked Meals,Rice and Grains,Vegetables,Packaged Food",
            "contact": "Ramesh Nayak"
        },
        {
            "email": "receiver.seva@foodbridge.ai",
            "name": "Ganesh Bhat (Trustee)",
            "org_name": "Seva Sangama Community Kitchen",
            "phone": "+91 98459 99001",
            "address": "Main Road, Brahmavar",
            "location": "Brahmavar",
            "lat": 13.4284, "lon": 74.7490,
            "org_type": "Community Kitchen",
            "capacity": 80,
            "diet": "Vegetarian",
            "categories": "Rice and Grains,Vegetables,Cooked Meals",
            "contact": "Ganesh Bhat"
        },
        {
            "email": "receiver.vatsalya@foodbridge.ai",
            "name": "Dr. Suma Hegde (Manager)",
            "org_name": "Vatsalya Home for the Elderly",
            "phone": "+91 98460 00112",
            "address": "Anekere Road, Karkala",
            "location": "Karkala",
            "lat": 13.2144, "lon": 74.9961,
            "org_type": "Old Age Home",
            "capacity": 30,
            "diet": "Vegetarian",
            "categories": "Cooked Meals,Fruits,Bakery Items",
            "contact": "Dr. Suma Hegde"
        },
        {
            "email": "receiver.annapurna@foodbridge.ai",
            "name": "Prakash Rao (Coordinator)",
            "org_name": "Annapurna Food Bank & Relief Trust",
            "phone": "+91 98461 11223",
            "address": "Port Road, Malpe",
            "location": "Malpe",
            "lat": 13.3516, "lon": 74.7042,
            "org_type": "Food Bank",
            "capacity": 60,
            "diet": "Both",
            "categories": "Packaged Food,Rice and Grains,Cooked Meals,Fruits",
            "contact": "Prakash Rao"
        },
        {
            "email": "receiver.street@foodbridge.ai",
            "name": "Kavya Shenoy (Field Officer)",
            "org_name": "Manipal Youth Hunger Action NGO",
            "phone": "+91 98462 22334",
            "address": "Vidyaratna Nagar, Manipal",
            "location": "Manipal",
            "lat": 13.3535, "lon": 74.7860,
            "org_type": "NGO",
            "capacity": 25,
            "diet": "Both",
            "categories": "Cooked Meals,Bakery Items,Packaged Food",
            "contact": "Kavya Shenoy"
        }
    ]

    receiver_users = []
    for r in receivers_data:
        u = User(
            email=r["email"],
            hashed_password=demo_pw,
            full_name=r["name"],
            role="receiver",
            phone=r["phone"],
            address=r["address"],
            location_name=r["location"],
            latitude=r["lat"],
            longitude=r["lon"],
            is_active=True,
            created_at=now - datetime.timedelta(days=20)
        )
        db.add(u)
        db.flush()
        receiver_users.append(u)

        rp = ReceiverProfile(
            user_id=u.id,
            organization_name=r["org_name"],
            organization_type=r["org_type"],
            contact_person=r["contact"],
            required_capacity_meals=r["capacity"],
            dietary_preference=r["diet"],
            preferred_categories=r["categories"],
            verification_status="Verified"
        )
        db.add(rp)

    # 4. FOOD DONATIONS
    # Diverse categories, quantities, locations, and deadlines
    donations_data = [
        {
            "donor_idx": 0, # Manipal Food Court
            "food_name": "Fresh Royal Vegetable Biryani & Cucumber Raita",
            "category": "Cooked Meals",
            "description": "Aromatic basmati rice cooked with fresh seasonal vegetables and authentic spices. Prepared fresh for lunch banquet with surplus portions.",
            "quantity": 35.0,
            "unit": "Meals",
            "diet": "Vegetarian",
            "prep_offset_hrs": -2.0,
            "deadline_offset_hrs": 3.0, # Urgent (expires in 3 hrs)
            "storage": "Hot Holding",
            "allergens": "Dairy (Ghee, Curd)",
            "pickup": "MIT Campus Food Court Counter 3, Manipal",
            "lat": 13.3565, "lon": 74.7890,
            "time_window": "Within next 2 hours",
            "contact": "+91 98451 11223",
            "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
            "status": "Available"
        },
        {
            "donor_idx": 1, # Hotel Sri Krishna Woodlands Udupi
            "food_name": "Traditional Udupi Sambar, Rasam & Steamed Ponni Rice",
            "category": "Rice and Grains",
            "description": "Authentic temple-style lentil stew with drumsticks, carrots, steaming hot rice, and digestive pepper rasam.",
            "quantity": 50.0,
            "unit": "Meals",
            "diet": "Vegetarian",
            "prep_offset_hrs": -1.5,
            "deadline_offset_hrs": 5.5,
            "storage": "Hot Holding",
            "allergens": "Mustard seeds, Asafoetida",
            "pickup": "Sri Krishna Woodlands Kitchen Bay, Car Street, Udupi",
            "lat": 13.3420, "lon": 74.7450,
            "time_window": "3:00 PM - 5:00 PM",
            "contact": "+91 98452 22334",
            "image": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80",
            "status": "Available"
        },
        {
            "donor_idx": 3, # Crown Bakery Manipal
            "food_name": "Artisan Whole Wheat Sourdough & Fresh Fruit Pastries",
            "category": "Bakery Items",
            "description": "Nutritious freshly baked whole grain loaves, dinner rolls, and seasonal fruit tarts baked this morning.",
            "quantity": 40.0,
            "unit": "Packets",
            "diet": "Vegetarian",
            "prep_offset_hrs": -4.0,
            "deadline_offset_hrs": 16.0,
            "storage": "Room Temperature",
            "allergens": "Gluten, Dairy",
            "pickup": "Crown Bakery Back Delivery Entrance, Eshwar Nagar, Manipal",
            "lat": 13.3510, "lon": 74.7880,
            "time_window": "4:00 PM - 8:00 PM",
            "contact": "+91 98454 44556",
            "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
            "status": "Available"
        },
        {
            "donor_idx": 4, # KMC Hostel Mess
            "food_name": "Fresh Soft Chapatis with Paneer Butter Masala & Dal Tadka",
            "category": "Cooked Meals",
            "description": "Warm whole wheat rotis served with protein-rich cottage cheese curry and yellow lentil soup.",
            "quantity": 30.0,
            "unit": "Meals",
            "diet": "Vegetarian",
            "prep_offset_hrs": -1.0,
            "deadline_offset_hrs": 4.0,
            "storage": "Hot Holding",
            "allergens": "Dairy, Gluten",
            "pickup": "KMC Central Hostel Block 2 Mess Dispatch, Manipal",
            "lat": 13.3540, "lon": 74.7875,
            "time_window": "2:30 PM - 4:30 PM",
            "contact": "+91 98455 55667",
            "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
            "status": "Requested"
        },
        {
            "donor_idx": 2, # Green Valley Bistro
            "food_name": "Chilled Cut Fresh Fruit Platters (Watermelon, Papaya, Melon)",
            "category": "Fruits",
            "description": "Hygienically washed, sanitized, peeled, and boxed fresh seasonal fruits kept in cold storage.",
            "quantity": 25.0,
            "unit": "Kg",
            "diet": "Vegan",
            "prep_offset_hrs": -2.0,
            "deadline_offset_hrs": 6.0,
            "storage": "Refrigerated",
            "allergens": "None",
            "pickup": "Green Valley Bistro Kitchen, Tiger Circle, Manipal",
            "lat": 13.3530, "lon": 74.7850,
            "time_window": "3:00 PM - 6:00 PM",
            "contact": "+91 98453 33445",
            "image": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80",
            "status": "Accepted"
        },
        {
            "donor_idx": 5, # Udupi Royal Convention Center
            "food_name": "Grand Wedding Festive Vegetable Pulao & Dum Aloo",
            "category": "Cooked Meals",
            "description": "Massive surplus from marriage reception feast. Spiced basmati rice with cashews, raisins, and baby potatoes in rich gravy.",
            "quantity": 85.0,
            "unit": "Meals",
            "diet": "Vegetarian",
            "prep_offset_hrs": -3.5,
            "deadline_offset_hrs": 1.8, # Critical Urgency! Less than 2 hours left
            "storage": "Hot Holding",
            "allergens": "Cashews, Dairy",
            "pickup": "Royal Convention Center Service Dock, Santhekatte, Udupi",
            "lat": 13.3750, "lon": 74.7550,
            "time_window": "Immediate pickup required",
            "contact": "+91 98456 66778",
            "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
            "status": "Available"
        },
        {
            "donor_idx": 2, # Green Valley Bistro
            "food_name": "Roasted Vegetable & Spinach Cream Soup with Croutons",
            "category": "Cooked Meals",
            "description": "Hearty, comforting roasted tomato and bell pepper soup with crispy garlic croutons sealed in thermal containers.",
            "quantity": 28.0,
            "unit": "Meals",
            "diet": "Vegetarian",
            "prep_offset_hrs": -2.0,
            "deadline_offset_hrs": 5.0,
            "storage": "Hot Holding",
            "allergens": "Gluten, Dairy",
            "pickup": "Green Valley Bistro, Tiger Circle, Manipal",
            "lat": 13.3530, "lon": 74.7850,
            "time_window": "4:00 PM - 6:00 PM",
            "contact": "+91 98453 33445",
            "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80",
            "status": "Ready for Pickup"
        },
        {
            "donor_idx": 0, # Manipal Food Court
            "food_name": "Packaged Whole Grain Nutrition Cookies & High Protein Bars",
            "category": "Packaged Food",
            "description": "Sealed manufacturer surplus packages with original factory seal intact. Shelf stable and highly nutritious.",
            "quantity": 120.0,
            "unit": "Packets",
            "diet": "Vegetarian",
            "prep_offset_hrs": -24.0,
            "deadline_offset_hrs": 72.0,
            "storage": "Room Temperature",
            "allergens": "Oats, Wheat, Nuts",
            "pickup": "MIT Student Center Logistics Desk, Manipal",
            "lat": 13.3565, "lon": 74.7890,
            "time_window": "9:00 AM - 5:00 PM",
            "contact": "+91 98451 11223",
            "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
            "status": "Completed" # Successfully redistributed
        },
        {
            "donor_idx": 1, # Hotel Sri Krishna Woodlands
            "food_name": "Steamed White Idlis & Mixed Vegetable Sambar",
            "category": "Cooked Meals",
            "description": "Soft fermented rice cakes and coconut vegetable stew prepared for breakfast batch.",
            "quantity": 40.0,
            "unit": "Meals",
            "diet": "Vegetarian",
            "prep_offset_hrs": -36.0,
            "deadline_offset_hrs": -12.0, # EXPIRED: Demonstrates safety restriction
            "storage": "Room Temperature",
            "allergens": "Coconut, Mustard",
            "pickup": "Car Street, Udupi",
            "lat": 13.3420, "lon": 74.7450,
            "time_window": "Morning batch",
            "contact": "+91 98452 22334",
            "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
            "status": "Expired"
        },
        {
            "donor_idx": 5, # Convention Center
            "food_name": "Farm Fresh Cabbage, Carrots, Beans & Bell Peppers",
            "category": "Vegetables",
            "description": "Uncooked, crisp fresh produce from the banquet kitchen prep station, packed in clean wooden crates.",
            "quantity": 45.0,
            "unit": "Kg",
            "diet": "Vegan",
            "prep_offset_hrs": -5.0,
            "deadline_offset_hrs": 24.0,
            "storage": "Room Temperature",
            "allergens": "None",
            "pickup": "Santhekatte Market Dock, Udupi",
            "lat": 13.3750, "lon": 74.7550,
            "time_window": "Flexible daytime",
            "contact": "+91 98456 66778",
            "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
            "status": "Available"
        },
        {
            "donor_idx": 2, # Green Valley Bistro
            "food_name": "Egg Fried Rice with Indo-Chinese Garlic Sauce",
            "category": "Cooked Meals",
            "description": "Wok-tossed rice with farm eggs, spring onions, and oriental garlic gravy. Prepared for dinner rush.",
            "quantity": 30.0,
            "unit": "Meals",
            "diet": "Non-Vegetarian", # Non-Veg scenario
            "prep_offset_hrs": -1.5,
            "deadline_offset_hrs": 4.5,
            "storage": "Hot Holding",
            "allergens": "Egg, Soy",
            "pickup": "Green Valley Bistro, Manipal",
            "lat": 13.3530, "lon": 74.7850,
            "time_window": "3:00 PM - 5:30 PM",
            "contact": "+91 98453 33445",
            "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
            "status": "Available"
        },
        {
            "donor_idx": 4, # KMC Hostel Mess
            "food_name": "Wholesome Foxtail Millet Upma with Coconut Mint Chutney",
            "category": "Cooked Meals",
            "description": "Gluten-free diabetic-friendly healthy millet porridge seasoned with mustard, curry leaves, ginger, and roasted peanuts.",
            "quantity": 25.0,
            "unit": "Meals",
            "diet": "Vegan",
            "prep_offset_hrs": -2.0,
            "deadline_offset_hrs": 4.0,
            "storage": "Hot Holding",
            "allergens": "Peanuts",
            "pickup": "KMC Hostel Mess Entrance, Manipal",
            "lat": 13.3540, "lon": 74.7875,
            "time_window": "2:00 PM - 4:00 PM",
            "contact": "+91 98455 55667",
            "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
            "status": "Available"
        }
    ]

    donations_list = []
    for d in donations_data:
        donor = donor_users[d["donor_idx"]]
        prep_dt = now + datetime.timedelta(hours=d["prep_offset_hrs"])
        deadline_dt = now + datetime.timedelta(hours=d["deadline_offset_hrs"])

        donation = FoodDonation(
            donor_id=donor.id,
            food_name=d["food_name"],
            category=d["category"],
            description=d["description"],
            quantity=d["quantity"],
            quantity_unit=d["unit"],
            dietary_type=d["diet"],
            prep_time=prep_dt,
            consumption_deadline=deadline_dt,
            storage_condition=d["storage"],
            allergen_info=d["allergens"],
            pickup_location=d["pickup"],
            latitude=d["lat"],
            longitude=d["lon"],
            available_pickup_time=d["time_window"],
            donor_contact=d["contact"],
            image_url=d["image"],
            status=d["status"],
            created_at=prep_dt,
            updated_at=prep_dt
        )
        db.add(donation)
        db.flush()
        donations_list.append(donation)

        # Status history record
        hist1 = DonationStatusHistory(
            donation_id=donation.id,
            status="Available",
            updated_by_user_id=donor.id,
            notes="Donation listed by donor on FoodBridge AI.",
            timestamp=prep_dt
        )
        db.add(hist1)

    # 5. FOOD REQUESTS & ACTIVE LIFECYCLES
    # Donation 3 (KMC Hostel Chapatis) -> Requested by Hope Children's Orphanage
    req1 = FoodRequest(
        donation_id=donations_list[3].id,
        receiver_id=receiver_users[0].id, # Hope Orphanage
        requested_quantity=30.0,
        message="We have 35 children in the orphanage and these chapatis and paneer curry would be wonderful for their early dinner.",
        status="Requested",
        created_at=now - datetime.timedelta(minutes=45),
        updated_at=now - datetime.timedelta(minutes=45)
    )
    db.add(req1)

    hist_req1 = DonationStatusHistory(
        donation_id=donations_list[3].id,
        status="Requested",
        updated_by_user_id=receiver_users[0].id,
        notes="Hope Children's Orphanage submitted a request for 30 meals.",
        timestamp=now - datetime.timedelta(minutes=45)
    )
    db.add(hist_req1)

    # Donation 4 (Fruit Platters) -> Accepted for Seva Sangama Community Kitchen
    req2 = FoodRequest(
        donation_id=donations_list[4].id,
        receiver_id=receiver_users[2].id, # Seva Sangama
        requested_quantity=25.0,
        message="Requesting fresh fruit platters for distribution to elderly patients at the community clinic.",
        status="Accepted",
        created_at=now - datetime.timedelta(hours=1.5),
        updated_at=now - datetime.timedelta(hours=1)
    )
    db.add(req2)

    hist_req2 = DonationStatusHistory(
        donation_id=donations_list[4].id,
        status="Accepted",
        updated_by_user_id=donor_users[2].id, # Green Valley Bistro
        notes="Green Valley Bistro accepted the request from Seva Sangama Community Kitchen.",
        timestamp=now - datetime.timedelta(hours=1)
    )
    db.add(hist_req2)

    # Donation 6 (Soup) -> Ready for Pickup
    req3 = FoodRequest(
        donation_id=donations_list[6].id,
        receiver_id=receiver_users[1].id, # Karunalaya Shelter
        requested_quantity=28.0,
        message="Our evening soup kitchen opens at 5:00 PM. Our volunteer van is ready.",
        status="Ready for Pickup",
        created_at=now - datetime.timedelta(hours=2),
        updated_at=now - datetime.timedelta(minutes=20)
    )
    db.add(req3)

    hist_req3_1 = DonationStatusHistory(
        donation_id=donations_list[6].id,
        status="Accepted",
        updated_by_user_id=donor_users[2].id,
        notes="Request approved by donor.",
        timestamp=now - datetime.timedelta(hours=1.5)
    )
    hist_req3_2 = DonationStatusHistory(
        donation_id=donations_list[6].id,
        status="Ready for Pickup",
        updated_by_user_id=donor_users[2].id,
        notes="Food packaged in insulated containers, ready at reception.",
        timestamp=now - datetime.timedelta(minutes=20)
    )
    db.add(hist_req3_1)
    db.add(hist_req3_2)

    # Donation 7 (Packaged Cookies) -> Completed
    req4 = FoodRequest(
        donation_id=donations_list[7].id,
        receiver_id=receiver_users[4].id, # Annapurna Food Bank
        requested_quantity=120.0,
        message="Food bank warehouse has storage space. Will distribute to coastal fishing colonies.",
        status="Completed",
        created_at=now - datetime.timedelta(hours=20),
        updated_at=now - datetime.timedelta(hours=6)
    )
    db.add(req4)

    hist_req4_1 = DonationStatusHistory(
        donation_id=donations_list[7].id,
        status="Accepted",
        updated_by_user_id=donor_users[0].id,
        notes="Request accepted.",
        timestamp=now - datetime.timedelta(hours=18)
    )
    hist_req4_2 = DonationStatusHistory(
        donation_id=donations_list[7].id,
        status="Collected",
        updated_by_user_id=receiver_users[4].id,
        notes="Collected by Annapurna logistics vehicle.",
        timestamp=now - datetime.timedelta(hours=8)
    )
    hist_req4_3 = DonationStatusHistory(
        donation_id=donations_list[7].id,
        status="Completed",
        updated_by_user_id=donor_users[0].id,
        notes="Redistribution successfully verified and completed.",
        timestamp=now - datetime.timedelta(hours=6)
    )
    db.add(hist_req4_1)
    db.add(hist_req4_2)
    db.add(hist_req4_3)

    # 6. IN-APP NOTIFICATIONS
    notifs = [
        Notification(
            user_id=donor_users[4].id, # KMC Hostel
            title="New Food Request Received",
            message="Hope Children's Orphanage requested 30 meals from your donation 'Fresh Soft Chapatis'.",
            notification_type="request",
            is_read=False,
            link="/donor-dashboard",
            created_at=now - datetime.timedelta(minutes=45)
        ),
        Notification(
            user_id=receiver_users[0].id, # Hope Orphanage
            title="AI High Match Recommendation",
            message="Fresh Royal Vegetable Biryani (35 meals) in Manipal is an ideal 96% match for your capacity!",
            notification_type="match",
            is_read=False,
            link="/receiver-dashboard",
            created_at=now - datetime.timedelta(minutes=30)
        ),
        Notification(
            user_id=donor_users[5].id, # Convention Center
            title="Urgency Alert: 1.8 Hours Remaining",
            message="Your donation 'Grand Wedding Vegetable Pulao' expires soon. AI has prioritized nearby shelters.",
            notification_type="deadline_alert",
            is_read=False,
            link="/donor-dashboard",
            created_at=now - datetime.timedelta(minutes=15)
        ),
        Notification(
            user_id=receiver_users[1].id, # Karunalaya
            title="Food Ready for Collection",
            message="Green Valley Bistro marked 'Roasted Vegetable Soup' ready for pickup at Tiger Circle.",
            notification_type="status_change",
            is_read=False,
            link="/receiver-dashboard",
            created_at=now - datetime.timedelta(minutes=20)
        ),
        Notification(
            user_id=admin_user.id,
            title="Platform Milestone Reached",
            message="FoodBridge AI has successfully redistributed over 500 meals this month across Udupi & Manipal!",
            notification_type="system",
            is_read=True,
            link="/admin-dashboard",
            created_at=now - datetime.timedelta(hours=12)
        )
    ]
    for n in notifs:
        db.add(n)

    db.commit()
    print("Database seeding completed successfully!")


def ensure_fresh_demo_data(db: Session):
    """Refreshes available donation deadlines so demo food is always fresh and edible for exhibitions."""
    try:
        now = datetime.datetime.utcnow()
        avail_dons = db.query(FoodDonation).filter(FoodDonation.status == "Available").all()
        for d in avail_dons:
            # If remaining time is less than 1.5 hours or expired, refresh deadline
            diff = (d.consumption_deadline - now).total_seconds() / 3600.0
            if diff < 1.5:
                d.preparation_date = now - datetime.timedelta(hours=1)
                if "Biryani" in d.food_name:
                    d.consumption_deadline = now + datetime.timedelta(hours=4.5)
                elif "Pulao" in d.food_name:
                    d.consumption_deadline = now + datetime.timedelta(hours=2.5)
                elif "Fried Rice" in d.food_name:
                    d.consumption_deadline = now + datetime.timedelta(hours=5.0)
                elif "Millet" in d.food_name or "Upma" in d.food_name:
                    d.consumption_deadline = now + datetime.timedelta(hours=6.0)
                elif "Sourdough" in d.food_name or "Bakery" in d.category:
                    d.consumption_deadline = now + datetime.timedelta(hours=18.0)
                elif "Vegetables" in d.category or "Fruits" in d.category:
                    d.consumption_deadline = now + datetime.timedelta(hours=28.0)
                else:
                    d.consumption_deadline = now + datetime.timedelta(hours=8.0)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Notice in ensure_fresh_demo_data: {e}")

