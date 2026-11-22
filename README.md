# FoodBridge AI – Smart Food Redistribution Platform

> **College Innovation Project Exhibition**  
> **Category:** Sustainability & Environment  
> **Theme:** *"Technology for a Sustainable and Smarter Future"*

---

## 🌿 Executive Summary

**FoodBridge AI** is an intelligent, full-stack food surplus redistribution web application designed to eliminate edible food wastage. It bridges the gap between commercial and institutional food donors (**college canteens, restaurants, hotels, hostels, event organizers**) and receiving organizations (**orphanages, homeless shelters, community kitchens, food banks**) in real time.

Built around a **multi-factor rule-based AI recommendation engine**, the platform dynamically pairs food batches with nearby care organizations based on geographic distance, capacity absorption, consumption urgency, and dietary compatibility.

---

## 🚀 Key Features

### 1. 🤖 AI-Powered Multi-Factor Food Matching Engine
* **Location Proximity (40% Weight):** Calculates real-world geodesic distances using the Haversine formula across local nodes (Manipal, Udupi, Santhekatte, Malpe, Brahmavar, Karkala).
* **Quantity Capacity Compatibility (25% Weight):** Prevents shelter over-saturation by matching donation size against receiver daily capacity.
* **Consumption Urgency Prioritization (25% Weight):** Dynamically escalates prioritization as food approaches its consumption cutoff (< 2 hours = Critical, < 5 hours = Urgent).
* **Dietary Compliance (10% Weight):** Strict policy enforcement (e.g. 0% score penalty preventing meat deliveries to vegetarian orphanages).
* **Explainable AI:** Generates natural language rationales justifying why each receiver is ranked.

### 2. 🍲 Food Safety & Urgency Management
* FSSAI compliance notices and health inspection guidance before handover.
* Visual status indicators: **Available (Green)**, **Urgent (Orange)**, **Expired (Red)**, **Requested (Blue)**, and **Completed (Purple)**.
* Automatic lockouts preventing expired items from being requested.

### 3. 🔄 6-Stage Donation Lifecycle Tracker
* Visual progress stepper tracking: `Available` ➔ `Requested` ➔ `Accepted` ➔ `Ready for Pickup` ➔ `Collected` ➔ `Completed`.
* Timestamped audit history log for every state transition.

### 4. 📊 Food Waste Hotspot Analysis
* Aggregates recurring surplus volume across geographic clusters.
* Displays donation frequencies, dominant categories, and actionable van dispatch recommendations.

### 5. 🌍 Quantified Sustainability & Carbon Mitigation Impact
* **CO₂e Emissions Prevented:** Evaluated via UNEP Food Waste Index (~2.5 kg CO₂e per meal).
* **Groundwater Preserved:** Evaluated via FAO benchmarks (~350 liters of embedded water per meal).
* **United Nations SDG Alignment:** Direct contributor to **SDG 2 (Zero Hunger)**, **SDG 12 (Responsible Consumption & Production)**, and **SDG 13 (Climate Action)**.

### 6. 🔔 Real-Time In-App Notifications
* Live alerts for donors upon receiving food requests.
* AI recommendation alerts for shelters when compatible food is listed nearby.
* Real-time status change updates across pickup milestones.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React Icons, Recharts, React Router v7 |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy ORM, Pydantic v2 |
| **Database** | SQLite (Zero-configuration, persistent relational storage) |
| **Security** | PBKDF2-HMAC-SHA256 password hashing, HMAC-SHA256 token authorization |
| **External APIs** | **None required** — 100% free, local, and offline capable |

---

## ⚡ Quick Start Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+ & npm**

---

### Step 1: Start the Backend (FastAPI + SQLite)

Open a terminal in the project directory:

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

* **API Server:** `http://127.0.0.1:8000`
* **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
* *Note:* The database (`foodbridge.db`) initializes and pre-seeds automatically on first launch!

---

### Step 2: Start the Frontend (React + Vite)

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

* **Web Application:** `http://localhost:5173`

---

## 🔑 Demo Login Accounts (1-Click Evaluation)

For exhibition judges and evaluators, demo accounts are pre-configured. You can either use the **"Demo Accounts"** switcher button in the top navigation bar or enter credentials manually:

| Role | Organization / User | Email | Password |
| :--- | :--- | :--- | :--- |
| **Food Donor** | Manipal Food Court & MIT Canteen | `donor.manipal@foodbridge.ai` | `password123` |
| **Food Donor** | Hotel Sri Krishna Woodlands (Udupi) | `donor.udupi@foodbridge.ai` | `password123` |
| **Food Receiver** | Hope Children's Orphanage (Manipal) | `receiver.hope@foodbridge.ai` | `password123` |
| **Food Receiver** | Karunalaya Destitute Care (Udupi) | `receiver.udupi@foodbridge.ai` | `password123` |
| **Administrator** | Dr. Arvind Prabhu (Director) | `admin@foodbridge.ai` | `password123` |

---

## 📁 Project Architecture

```
Food Redistribution System/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, lifespan database auto-seeding
│   │   ├── config.py            # Environment & database settings
│   │   ├── database.py          # SQLAlchemy session engine
│   │   ├── models.py            # ORM models (Users, Profiles, Donations, Requests, History)
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── auth.py              # PBKDF2 password hashing & token verification
│   │   ├── matching_engine.py   # Multi-factor AI matching engine (Location 40%, Quantity 25%, Urgency 25%, Preference 10%)
│   │   ├── seed_data.py         # Pre-seeded realistic Manipal/Udupi regional data
│   │   └── routes/              # Modular API endpoints
│   │       ├── auth.py          # /api/auth (Login, Register, Demo accounts)
│   │       ├── donations.py     # /api/donations (CRUD, filters, urgency engine)
│   │       ├── requests.py      # /api/requests (Lifecycle state machine)
│   │       ├── matching.py      # /api/matching (AI recommendations)
│   │       ├── analytics.py     # /api/analytics (Recharts, hotspots, impact metrics)
│   │       └── notifications.py # /api/notifications (In-app notification system)
│   ├── test_system.py           # 7-stage automated system validation suite
│   ├── requirements.txt         # Python dependencies
│   └── foodbridge.db            # Persistent SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       # Header with notification center & 1-click role switcher
│   │   │   ├── Footer.jsx       # Exhibition metadata & theme credentials
│   │   │   ├── FoodCard.jsx     # Food card with urgency countdown & match badge
│   │   │   ├── StatusBadge.jsx  # Color-coded lifecycle badges
│   │   │   ├── LifecycleTracker.jsx # 6-stage visual progress stepper
│   │   │   ├── SafetyBanner.jsx # FSSAI food safety advisory
│   │   │   ├── ConfirmationModal.jsx # Action verification dialogs
│   │   │   └── Toast.jsx        # Notification popups
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # User session, JWT tokens, and toast management
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Hero, live stats, 4-step workflow, impact highlights
│   │   │   ├── AvailableFoodPage.jsx # Public inventory feed with multi-criteria filters
│   │   │   ├── DonationDetailPage.jsx # Specifications, audit trail & request trigger
│   │   │   ├── MatchingEnginePage.jsx # AI flagship matching showcase with factor breakdown
│   │   │   ├── DonorDashboard.jsx # Donor stats, My Donations, request approvals
│   │   │   ├── AddDonationPage.jsx # Multi-field listing submission form
│   │   │   ├── ReceiverDashboard.jsx # NGO feed, search, AI personalized recommendations
│   │   │   ├── AdminDashboard.jsx # Platform analytics, Recharts, user management
│   │   │   ├── HotspotsPage.jsx # Spatial food waste cluster analysis
│   │   │   ├── ImpactPage.jsx   # Quantitative carbon, water, and SDG metrics
│   │   │   ├── LoginPage.jsx    # Authentication & 1-click demo login buttons
│   │   │   └── RegisterPage.jsx # Validated donor & receiver onboarding
│   │   ├── services/
│   │   │   └── api.js           # Centralized API service with authorization headers
│   │   ├── App.jsx              # Routing and protected navigation guards
│   │   └── index.css            # Tailwind theme colors & styling
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🧪 Testing and Verification

To execute the automated end-to-end integration test suite:

```bash
cd backend
python test_system.py
```

**Verification Results:**
* `[Test 1] User Verification:` 6 Donors, 6 Receivers, 1 Admin accounts verified.
* `[Test 2] Password Security & Token Test:` PBKDF2 hashing & HMAC tokens verified.
* `[Test 3] Food Donations Inventory:` 12 multi-category listings verified.
* `[Test 4] AI Multi-Factor Matching Engine:` 4-factor scoring & explainable AI verified.
* `[Test 5] Donation Request & Lifecycle Progress:` Full Available ➔ Requested ➔ Accepted ➔ Completed workflow verified.
* `[Test 6] Food Safety Expired Food Restriction:` Expired food request lockout verified.
* `[Test 7] In-App Notification Center Audit:` Live in-app notifications verified.
* **Status:** `ALL 7 SYSTEM VALIDATION TEST SUITES PASSED (100% SUCCESS)`.

---

## 🎓 Exhibition Presentation Talking Points

1. **Innovation:** Moves beyond passive food bulletin boards by introducing an active AI matching algorithm that matches food based on proximity (km), capacity ratios, and perishable urgency.
2. **Impact:** Quantifies carbon emissions prevented and liters of water conserved in alignment with UN Sustainable Development Goals 2, 12, and 13.
3. **Safety First:** Built-in protocol preventing spoiled or expired items from being allocated, with mandatory safety verification checklists.
4. **Zero Marginal Cost:** Designed entirely with open-source technologies (FastAPI, React, SQLite, Tailwind) requiring zero paid cloud APIs.
