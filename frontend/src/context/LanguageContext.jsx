import React, { createContext, useContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    available_food: 'Available Food',
    ai_matching: 'AI Matching',
    impact_tracker: 'Impact Tracker',
    waste_hotspots: 'Waste Hotspots',
    dashboard: 'Dashboard',
    dashboard_panel: 'Dashboard Panel',
    demo_accounts: 'Demo Accounts',
    sign_in: 'Sign In',
    register: 'Register',
    sign_out: 'Sign Out',
    food_donor: 'Food Donor',
    receiver: 'Receiver',
    admin: 'Admin',
    delete_account: 'Delete Account',

    // Hero Section
    ai_badge: 'AI-POWERED FOOD REDISTRIBUTION',
    hero_title_1: "Don't Waste Food. ",
    hero_title_2: "Share Hope.",
    hero_subtitle: "An intelligent platform connecting restaurants, college canteens, and caterers with orphanages and community shelters. Powered by algorithmic multi-factor matching to eliminate food wastage before it spoils.",
    btn_donate: 'Donate Surplus Food',
    btn_find_food: 'Find Food (Receivers)',
    btn_explore_ai: 'Explore AI Matching',
    tag_zero_api: 'Zero external paid APIs',
    tag_matching: 'Dynamic 4-Factor Matching',
    tag_fssai: 'FSSAI Hygiene Compliant',
    tag_routing: 'Algorithmic Proximity Routing',
    tag_mission: 'Zero Food Waste Mission',

    // Live Stats & Metrics Section
    verified_metrics: 'LIVE VERIFIED METRICS',
    community_impact_title: 'Measurable Community Impact',
    community_impact_desc: 'Real-time surplus redistribution statistics calculated directly from our local database.',
    card_total_donations: 'Total Food Donations',
    card_total_donations_sub: 'Surplus batches listed',
    card_food_distributed: 'Food Distributed (kg)',
    card_food_distributed_sub: 'Meals safely delivered',
    card_active_donors: 'Active Donors',
    card_active_donors_sub: 'Canteens, hotels & kitchens',
    card_receivers: 'Receiving Organizations',
    card_receivers_sub: 'Shelters & welfare homes',

    // Process Section
    process_badge: 'SIMPLE 3-STEP PROCESS',
    process_title: 'How FoodBridge AI Works',
    process_subtitle: 'A seamless bridge from commercial surplus kitchens directly into compassionate community nutrition.',
    step1_title: 'List Surplus Food',
    step1_desc: 'Canteens, hotels, and restaurants list edible surplus food with quantity, dietary type, and consumption deadline.',
    step2_title: 'Algorithmic AI Matching',
    step2_desc: 'Our 4-factor recommendation engine evaluates distance, capacity, urgency, and dietary compatibility in real-time.',
    step3_title: 'Fast Pickup & Safe Delivery',
    step3_desc: 'Receiver shelter coordinates pickup or volunteer van transit to distribute wholesome meals before expiry.',

    // CTA Banner
    cta_ready_title: 'Ready to Make Zero Food Waste a Reality?',
    cta_ready_desc: 'Join registered college canteens, catering companies, and verified NGO shelters on FoodBridge AI today.',

    // Available Food Page
    available_title: 'Available Surplus Food Listings',
    available_subtitle: 'Real-time catalog of edible surplus food from college canteens, restaurants, and catering halls ready for immediate collection.',
    fssai_title: 'FSSAI & Public Health Safety Protocol',
    fssai_desc: 'Food listings are evaluated based on donor self-reporting. All participating donors and receiving organizations are required to follow statutory food safety standards.',
    search_placeholder: 'Search by food dish, ingredients, donor or pickup landmark...',
    search_btn: 'Search',
    all_categories: 'All Categories',
    all_dietary: 'All Dietary Types',
    all_localities: 'All Localities',
    all_deadlines: 'All Deadlines',
    no_food_found: 'No surplus food listings matching your criteria.',
    active_batches: 'Active Batches',

    // Request & Details
    request_surplus: 'Request Surplus Food Allocation',
    quantity: 'Quantity',
    remaining: 'Remaining',
    prep_time: 'Preparation Time',
    consumption_deadline: 'Consumption Deadline',
    pickup_location: 'Pickup Location',
    operating_hours: 'Operating Hours',
    travel_time_eta: 'Estimated Travel Time',
    directions_btn: 'Get Directions on Google Maps',
    fssai_badge: 'FSSAI Verified Kitchen',
    status_available: 'Available',
    status_requested: 'Unavailable (Requested)',
    status_accepted: 'Accepted',
    status_ready: 'Ready for Pickup',
    status_collected: 'Collected',
    status_completed: 'Distributed',
    status_unavailable: 'Unavailable',

    // Verification
    org_id_label: 'Organization ID / NGO Registration ID',
    org_id_placeholder: 'e.g. NGO-KA-2024-8921 or DARPAN-ID',
    org_id_help: 'Mandatory statutory identification required to verify genuine relief shelters.',

    // Footer
    footer_desc: 'FoodBridge AI is an intelligent surplus food redistribution platform connecting commercial kitchens with orphanages and community shelters.',
    footer_rights: 'All rights reserved. FSSAI statutory hygiene compliant.',
  },

  hi: {
    // Navigation
    home: 'होम',
    available_food: 'उपलब्ध भोजन',
    ai_matching: 'एआई मैचिंग',
    impact_tracker: 'प्रभाव ट्रैकर',
    waste_hotspots: 'अपशिष्ट हॉटस्पॉट',
    dashboard: 'डैशबोर्ड',
    dashboard_panel: 'डैशबोर्ड पैनल',
    demo_accounts: 'डेमो खाते',
    sign_in: 'साइन इन',
    register: 'पंजीकरण करें',
    sign_out: 'लॉगआउट',
    food_donor: 'भोजन दाता',
    receiver: 'आश्रय / प्राप्तकर्ता',
    admin: 'प्रशासक',
    delete_account: 'खाता हटाएं',

    // Hero Section
    ai_badge: 'एआई-संचालित खाद्य पुनर्वितरण',
    hero_title_1: 'भोजन बर्बाद न करें। ',
    hero_title_2: 'उम्मीद बांटें।',
    hero_subtitle: 'रेस्तरां, कॉलेज कैंटीन और कैटरर्स को अनाथालयों और सामुदायिक आश्रयों से जोड़ने वाला आधुनिक मंच। भोजन खराब होने से पहले जरूरतमंदों तक पहुंचाने के लिए एल्गोरिथम मल्टी-फैक्टर मैचिंग द्वारा संचालित।',
    btn_donate: 'अतिरिक्त भोजन दान करें',
    btn_find_food: 'भोजन प्राप्त करें (आश्रय)',
    btn_explore_ai: 'एआई मैचिंग देखें',
    tag_zero_api: 'शून्य बाहरी सशुल्क एपीआई',
    tag_matching: 'डायनामिक 4-कारक मिलान',
    tag_fssai: 'FSSAI स्वच्छता अनुरूप',
    tag_routing: 'अल्गोरिद्मिक निकटता रूटिंग',
    tag_mission: 'शून्य खाद्य अपव्यय मिशन',

    // Live Stats & Metrics Section
    verified_metrics: 'लाइव सत्यापित आंकड़े',
    community_impact_title: 'मापने योग्य सामुदायिक प्रभाव',
    community_impact_desc: 'हमारे स्थानीय डेटाबेस से सीधे गणना किए गए वास्तविक समय के अधिशेष पुनर्वितरण आंकड़े।',
    card_total_donations: 'कुल खाद्य दान',
    card_total_donations_sub: 'सूचीबद्ध अतिरिक्त बैच',
    card_food_distributed: 'वितरित भोजन (किग्रा)',
    card_food_distributed_sub: 'सुरक्षित रूप से पहुंचाया गया भोजन',
    card_active_donors: 'सक्रिय खाद्य दाता',
    card_active_donors_sub: 'कैंटीन, होटल और रसोई',
    card_receivers: 'प्राप्तकर्ता संगठन',
    card_receivers_sub: 'आश्रय और कल्याण गृह',

    // Process Section
    process_badge: 'सरल 3-चरणीय प्रक्रिया',
    process_title: 'FoodBridge AI कैसे काम करता है',
    process_subtitle: 'वाणिज्यिक अतिरिक्त रसोइयों से सीधे जरूरतमंद समुदायों तक भोजन पहुंचाने वाला सशक्त मंच।',
    step1_title: 'अधिशेष भोजन सूचीबद्ध करें',
    step1_desc: 'कैंटीन और रेस्तरां तैयारी समय, मात्रा और सुरक्षा दिशानिर्देशों के साथ बचा हुआ भोजन सूचीबद्ध करते हैं।',
    step2_title: 'अल्गोरिद्मिक एआई मैचिंग',
    step2_desc: 'हमारा 4-फैक्टर एल्गोरिदम दूरी, क्षमता, तात्कालिकता और आहार अनुकूलता के आधार पर निकटतम आश्रयों को जोड़ता है।',
    step3_title: 'तेज पिकअप और सुरक्षित वितरण',
    step3_desc: 'आश्रय के स्वयंसेवक भोजन एकत्र करते हैं और समाप्ति से पहले जरूरतमंदों में सुरक्षित रूप से वितरित करते हैं।',

    // CTA Banner
    cta_ready_title: 'क्या आप शून्य खाद्य अपव्यय को साकार करने के लिए तैयार हैं?',
    cta_ready_desc: 'आज ही FoodBridge AI पर पंजीकृत कैंटीन, कैटरर्स और सत्यापित एनजीओ आश्रयों से जुड़ें।',

    // Available Food Page
    available_title: 'उपलब्ध अधिशेष भोजन सूची',
    available_subtitle: 'कॉलेज कैंटीन, रेस्तरां और बैंक्वेट हॉल से संग्रह के लिए तैयार ताजा भोजन का वास्तविक समय विवरण।',
    fssai_title: 'FSSAI एवं सार्वजनिक स्वास्थ्य सुरक्षा प्रोटोकॉल',
    fssai_desc: 'सभी भाग लेने वाले दाताओं और प्राप्तकर्ता संगठनों को वैधानिक खाद्य सुरक्षा मानकों का पालन करना अनिवार्य है।',
    search_placeholder: 'भोजन, सामग्री, दाता या लैंडमार्क द्वारा खोजें...',
    search_btn: 'खोजें',
    all_categories: 'सभी श्रेणियां',
    all_dietary: 'सभी आहार प्रकार',
    all_localities: 'सभी इलाके',
    all_deadlines: 'सभी समय सीमा',
    no_food_found: 'आपके मानदंडों से मेल खाने वाली कोई भोजन सूची नहीं मिली।',
    active_batches: 'सक्रिय बैच',

    // Request & Details
    request_surplus: 'अधिशेष भोजन आवंटन का अनुरोध करें',
    quantity: 'मात्रा',
    remaining: 'शेष उपलब्ध',
    prep_time: 'तैयारी का समय',
    consumption_deadline: 'उपभोग की अंतिम तिथि',
    pickup_location: 'पिकअप स्थान',
    operating_hours: 'कार्य समय (खुलने और बंद होने का समय)',
    travel_time_eta: 'अनुमानित यात्रा समय (पहुंचने का समय)',
    directions_btn: 'गूगल मैप्स पर दिशा-निर्देश प्राप्त करें',
    fssai_badge: 'FSSAI सत्यापित रसोई',
    status_available: 'उपलब्ध',
    status_requested: 'अनुपलब्ध (अनुरोधित)',
    status_accepted: 'स्वीकृत',
    status_ready: 'पिकअप हेतु तैयार',
    status_collected: 'संग्रहित (कलेक्टेड)',
    status_completed: 'वितरित',
    status_unavailable: 'अनुपलब्ध',

    // Verification
    org_id_label: 'संगठन आईडी / एनजीओ पंजीकरण संख्या',
    org_id_placeholder: 'उदा. NGO-KA-2024-8921 अथवा दर्पण आईडी',
    org_id_help: 'वास्तविक राहत आश्रयों को सत्यापित करने के लिए अनिवार्य वैधानिक पहचान।',

    // Footer
    footer_desc: 'FoodBridge AI एक बुद्धिमान खाद्य पुनर्वितरण मंच है जो जरूरतमंद समुदायों तक भोजन पहुंचाता है।',
    footer_rights: 'सर्वाधिकार सुरक्षित। FSSAI वैधानिक खाद्य स्वच्छता अनुरूप।',
  },

  kn: {
    // Navigation
    home: 'ಮುಖಪುಟ',
    available_food: 'ಲಭ್ಯವಿರುವ ಆಹಾರ',
    ai_matching: 'ಎಐ ಹೊಂದಾಣಿಕೆ',
    impact_tracker: 'ಪ್ರಭಾವ ಟ್ರ್ಯಾಕರ್',
    waste_hotspots: 'ತ್ಯಾಜ್ಯ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    dashboard_panel: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಫಲಕ',
    demo_accounts: 'ಡೆಮೊ ಖಾತೆಗಳು',
    sign_in: 'ಸೈನ್ ಇನ್',
    register: 'ನೋಂದಣಿ',
    sign_out: 'ಲಾಗ್ ಔಟ್',
    food_donor: 'ಆಹಾರ ದಾನಿ',
    receiver: 'ಸ್ವೀಕರಿಸುವವರು / ಆಶ್ರಮ',
    admin: 'ನಿರ್ವಾಹಕರು',
    delete_account: 'ಖಾತೆಯನ್ನು ಅಳಿಸಿ',

    // Hero Section
    ai_badge: 'ಎಐ-ಚಾಲಿತ ಆಹಾರ ಮರುವಿತರಣೆ',
    hero_title_1: 'ಆಹಾರವನ್ನು ವ್ಯರ್ಥ ಮಾಡಬೇಡಿ. ',
    hero_title_2: 'ಭರವಸೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
    hero_subtitle: 'ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು, ಕಾಲೇಜು ಕ್ಯಾಂಟೀನ್‌ಗಳು ಮತ್ತು ಕ್ಯಾಟರರ್‌ಗಳನ್ನು ಅನಾಥಾಶ್ರಮಗಳು ಮತ್ತು ಸಮುದಾಯ ಆಶ್ರಯಗಳಿಗೆ ಸಂಪರ್ಕಿಸುವ ಬುದ್ಧಿವಂತ ತಂತ್ರಜ್ಞಾನ ವೇದಿಕೆ. ಆಹಾರ ಹಾಳಾಗುವ ಮುನ್ನವೇ ವಿತರಿಸಲು ಎಐ ಅಲ್ಗಾರಿದಮ್‌ಗಳಿಂದ ಚಾಲಿತವಾಗಿದೆ.',
    btn_donate: 'ಹೆಚ್ಚುವರಿ ಆಹಾರ ದಾನ ಮಾಡಿ',
    btn_find_food: 'ಆಹಾರ ಹುಡುಕಿ (ಆಶ್ರಯಗಳು)',
    btn_explore_ai: 'ಎಐ ಮ್ಯಾಚಿಂಗ್ ಅನ್ವೇಷಿಸಿ',
    tag_zero_api: 'ಶೂನ್ಯ ಬಾಹ್ಯ ಪಾವತಿಸಿದ ಎಪಿಐಗಳು',
    tag_matching: 'ಡೈನಾಮಿಕ್ 4-ಅಂಶ ಹೊಂದಾಣಿಕೆ',
    tag_fssai: 'FSSAI ನೈರ್ಮಲ್ಯ ಮಾನದಂಡ ಅನುಸರಣೆ',
    tag_routing: 'ಅಲ್ಗಾರಿದಮಿಕ್ ಸಮೀಪದ ಮಾರ್ಗ ನಕ್ಷೆ',
    tag_mission: 'ಶೂನ್ಯ ಆಹಾರ ವ್ಯರ್ಥ ಧ್ಯೇಯ',

    // Live Stats & Metrics Section
    verified_metrics: 'ಲೈವ್ ಪರಿಶೀಲಿಸಿದ ಅಂಕಿಅಂಶಗಳು',
    community_impact_title: 'ಅಳೆಯಬಹುದಾದ ಸಮುದಾಯ ಪ್ರಭಾವ',
    community_impact_desc: 'ನಮ್ಮ ಸ್ಥಳೀಯ ಡೇಟಾಬೇಸ್‌ನಿಂದ ನೇರವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾದ ನೈಜ-ಸಮಯದ ಅಂಕಿಅಂಶಗಳು.',
    card_total_donations: 'ಒಟ್ಟು ಆಹಾರ ದಾನಗಳು',
    card_total_donations_sub: 'ದಾಖಲಾದ ಹೆಚ್ಚುವರಿ ಬ್ಯಾಚ್‌ಗಳು',
    card_food_distributed: 'ವಿತರಿಸಲಾದ ಆಹಾರ (ಕೆಜಿ)',
    card_food_distributed_sub: 'ಸುರಕ್ಷಿತವಾಗಿ ತಲುಪಿಸಿದ ಊಟಗಳು',
    card_active_donors: 'ಸಕ್ರಿಯ ದಾನಿಗಳು',
    card_active_donors_sub: 'ಕ್ಯಾಂಟೀನ್‌ಗಳು, ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ಅಡುಗೆಮನೆಗಳು',
    card_receivers: 'ಸ್ವೀಕರಿಸುವ ಸಂಸ್ಥೆಗಳು',
    card_receivers_sub: 'ಆಶ್ರಮಗಳು ಮತ್ತು ಕಲ್ಯಾಣ ಕೇಂದ್ರಗಳು',

    // Process Section
    process_badge: 'ಸುಲಭದ 3-ಹಂತದ ಪ್ರಕ್ರಿಯೆ',
    process_title: 'ಫುಡ್‌ಬ್ರಿಡ್ಜ್ ಎಐ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    process_subtitle: 'ವಾಣಿಜ್ಯ ಅಡುಗೆಮನೆಗಳಿಂದ ನೇರವಾಗಿ ಅಗತ್ಯವಿರುವ ಸಮುದಾಯಗಳಿಗೆ ಆಹಾರ ತಲುಪಿಸುವ ಸರಳ ವೇದಿಕೆ.',
    step1_title: 'ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ಪಟ್ಟಿ ಮಾಡಿ',
    step1_desc: 'ಕ್ಯಾಂಟೀನ್‌ಗಳು ಮತ್ತು ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು ಆಹಾರದ ಪ್ರಮಾಣ, ಆಹಾರದ ಪ್ರಕಾರ ಮತ್ತು ಬಳಕೆಯ ಗಡುವನ್ನು ದಾಖಲಿಸುತ್ತವೆ.',
    step2_title: 'ಬುದ್ಧಿವಂತ ಎಐ ಹೊಂದಾಣಿಕೆ',
    step2_desc: 'ಸ್ಥಳ, ಸಾಮರ್ಥ್ಯ, ತುರ್ತು ಮತ್ತು ಆಹಾರದ ಹೊಂದಾಣಿಕೆಯ ಆಧಾರದ ಮೇಲೆ ಹತ್ತಿರದ ಆಶ್ರಮಗಳನ್ನು ತಕ್ಷಣ ಜೋಡಿಸುತ್ತದೆ.',
    step3_title: 'ತ್ವರಿತ ಪಿಕಪ್ ಮತ್ತು ಸುರಕ್ಷಿತ ವಿತರಣೆ',
    step3_desc: 'ಸ್ವಯಂಸೇವಕರು ಆಹಾರವನ್ನು ಸಂಗ್ರಹಿಸಿ ನಿಗದಿತ ಗಡುವಿನೊಳಗೆ ಸಮುದಾಯಕ್ಕೆ ಸುರಕ್ಷಿತವಾಗಿ ತಲುಪಿಸುತ್ತಾರೆ.',

    // CTA Banner
    cta_ready_title: 'ಶೂನ್ಯ ಆಹಾರ ವ್ಯರ್ಥವನ್ನು ನನಸಾಗಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?',
    cta_ready_desc: 'ಇಂದೇ ನೋಂದಾಯಿತ ಕ್ಯಾಂಟೀನ್‌ಗಳು, ಕ್ಯಾಟರರ್‌ಗಳು ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ಎನ್‌ಜಿಒಗಳ ಜಾಲಕ್ಕೆ ಸೇರಿ.',

    // Available Food Page
    available_title: 'ಲಭ್ಯವಿರುವ ಹೆಚ್ಚುವರಿ ಆಹಾರ ಪಟ್ಟಿ',
    available_subtitle: 'ಕಾಲೇಜು ಕ್ಯಾಂಟೀನ್‌ಗಳು, ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು ಮತ್ತು ಅಡುಗೆ ಕೇಂದ್ರಗಳಿಂದ ಸಂಗ್ರಹಿಸಲು ಸಿದ್ಧವಾಗಿರುವ ಆಹಾರದ ನೈಜ ಸಮಯದ ದಾಸ್ತಾನು.',
    fssai_title: 'FSSAI ಮತ್ತು ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಸುರಕ್ಷತಾ ನಿಯಮಗಳು',
    fssai_desc: 'ಎಲ್ಲಾ ಭಾಗವಹಿಸುವ ದಾನಿಗಳು ಮತ್ತು ಸ್ವೀಕರಿಸುವ ಸಂಸ್ಥೆಗಳು ಶಾಸನಬದ್ಧ ಆಹಾರ ಸುರಕ್ಷತಾ ಮಾನದಂಡಗಳನ್ನು ಪಾಲಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ.',
    search_placeholder: 'ಆಹಾರ, ಪದಾರ್ಥಗಳು, ದಾನಿ ಅಥವಾ ಸ್ಥಳದ ಮೂಲಕ ಹುಡುಕಿ...',
    search_btn: 'ಹುಡುಕಿ',
    all_categories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    all_dietary: 'ಎಲ್ಲಾ ಆಹಾರ ಪ್ರಕಾರಗಳು',
    all_localities: 'ಎಲ್ಲಾ ಸ್ಥಳಗಳು',
    all_deadlines: 'ಎಲ್ಲಾ ಗಡುವುಗಳು',
    no_food_found: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಸೂಕ್ತವಾದ ಆಹಾರ ಪಟ್ಟಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    active_batches: 'ಸಕ್ರಿಯ ಬ್ಯಾಚ್‌ಗಳು',

    // Request & Details
    request_surplus: 'ಹೆಚ್ಚುವರಿ ಆಹಾರ ಹಂಚಿಕೆಗೆ ವಿನಂತಿಸಿ',
    quantity: 'ಪ್ರಮಾಣ',
    remaining: 'ಉಳಿದಿರುವ ಲಭ್ಯತೆ',
    prep_time: 'ತಯಾರಿಸಿದ ಸಮಯ',
    consumption_deadline: 'ಬಳಕೆಯ ಅಂತಿಮ ಸಮಯ',
    pickup_location: 'ಪಿಕಪ್ ಸ್ಥಳ',
    operating_hours: 'ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಯ (ತೆರೆಯುವ & ಮುಚ್ಚುವ ಸಮಯ)',
    travel_time_eta: 'ತಲುಪುವ ಅಂದಾಜು ಸಮಯ (ಇಟಿಎ)',
    directions_btn: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ಮಾರ್ಗ ಪಡೆಯಿರಿ',
    fssai_badge: 'FSSAI ದೃಢೀಕೃತ ಅಡುಗೆಮನೆ',
    status_available: 'ಲಭ್ಯವಿದೆ',
    status_requested: 'ಲಭ್ಯವಿಲ್ಲ (ವಿನಂತಿಸಲಾಗಿದೆ)',
    status_accepted: 'ಅಂಗೀಕರಿಸಲಾಗಿದೆ',
    status_ready: 'ಪಿಕಪ್‌ಗೆ ಸಿದ್ಧವಾಗಿದೆ',
    status_collected: 'ಸಂಗ್ರಹಿಸಲಾಗಿದೆ (ಕಲೆಕ್ಟೆಡ್)',
    status_completed: 'ವಿತರಿಸಲಾಗಿದೆ',
    status_unavailable: 'ಲಭ್ಯವಿಲ್ಲ',

    // Verification
    org_id_label: 'ಸಂಸ್ಥೆಯ ಐಡಿ / ಎನ್‌ಜಿಒ ನೋಂದಣಿ ಸಂಖ್ಯೆ',
    org_id_placeholder: 'ಉದಾ: NGO-KA-2024-8921 ಅಥವಾ ದರ್ಪಣ್ ಐಡಿ',
    org_id_help: 'ನೈಜ ಆಶ್ರಮಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಶಾಸನಬದ್ಧ ಸಂಸ್ಥೆಯ ಗುರುತಿನ ಚೀಟಿ ಕಡ್ಡಾಯವಾಗಿದೆ.',

    // Footer
    footer_desc: 'ಫುಡ್‌ಬ್ರಿಡ್ಜ್ ಎಐ ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ಅನಾಥಾಶ್ರಮಗಳು ಮತ್ತು ಸಮುದಾಯ ಆಶ್ರಯಗಳಿಗೆ ತಲುಪಿಸುವ ಬುದ್ಧಿವಂತ ವೇದಿಕೆಯಾಗಿದೆ.',
    footer_rights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. FSSAI ಶಾಸನಬದ್ಧ ಆಹಾರ ನೈರ್ಮಲ್ಯಕ್ಕೆ ಅನುಗುಣವಾಗಿದೆ.',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('foodbridge_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('foodbridge_lang', language);
  }, [language]);

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
