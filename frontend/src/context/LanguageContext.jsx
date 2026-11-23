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
    hero_title_1: "Don't Waste Food. ",
    hero_title_2: "Share Hope.",
    hero_subtitle: "An intelligent platform connecting restaurants, college canteens, and caterers with orphanages and community shelters. Powered by algorithmic multi-factor matching to eliminate food wastage before it spoils.",
    btn_donate: 'Donate Surplus Food',
    btn_find_food: 'Find Food (Receivers)',
    btn_explore_ai: 'Explore AI Matching',
    tag_zero_api: 'Zero external paid APIs',
    tag_matching: 'Dynamic 4-Factor Matching',
    tag_fssai: 'FSSAI Hygiene Compliant',

    // Live Stats
    live_impact_stats: 'LIVE REAL-TIME IMPACT STATISTICS',
    stat_donations: 'Donations Listed',
    stat_meals: 'Meals Redistributed',
    stat_donors: 'Active Food Donors',
    stat_shelters: 'Shelters & NGOs',

    // Available Food Page
    available_title: 'Available Surplus Food Listings',
    available_subtitle: 'Real-time inventory of edible surplus food from college canteens, restaurants, and catering halls ready for collection.',
    fssai_title: 'FSSAI & Public Health Safety Protocol',
    fssai_desc: 'Food listings are evaluated based on donor self-reporting. All participating donors and receiving organizations are required to follow statutory food safety standards.',
    search_placeholder: 'Search by food dish, ingredients, donor or pickup landmark...',
    search_btn: 'Search',
    all_categories: 'All Categories',
    all_dietary: 'All Dietary Types',
    all_localities: 'All Localities',
    all_deadlines: 'All Deadlines',
    no_food_found: 'No surplus food listings matching your criteria.',

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
    status_requested: 'Requested',
    status_accepted: 'Accepted',
    status_ready: 'Ready for Pickup',
    status_collected: 'Collected',
    status_completed: 'Distributed',

    // Verification
    org_id_label: 'Organization ID / NGO Registration ID',
    org_id_placeholder: 'e.g. NGO-KA-2024-8921 or DARPAN-ID',
    org_id_help: 'Mandatory statutory identification required to verify genuine relief shelters.',
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
    hero_title_1: 'भोजन बर्बाद न करें। ',
    hero_title_2: 'उम्मीद बांटें।',
    hero_subtitle: 'रेस्तरां, कॉलेज कैंटीन और कैटरर्स को अनाथालयों और सामुदायिक आश्रयों से जोड़ने वाला आधुनिक मंच। भोजन खराब होने से पहले जरूरतमंदों तक पहुंचाने के लिए एल्गोरिथम मल्टी-फैक्टर मैचिंग द्वारा संचालित।',
    btn_donate: 'अतिरिक्त भोजन दान करें',
    btn_find_food: 'भोजन प्राप्त करें (आश्रय)',
    btn_explore_ai: 'एआई मैचिंग देखें',
    tag_zero_api: 'शून्य बाहरी सशुल्क एपीआई',
    tag_matching: 'डायनामिक 4-कारक मिलान',
    tag_fssai: 'FSSAI स्वच्छता अनुरूप',

    // Live Stats
    live_impact_stats: 'लाइव वास्तविक समय प्रभाव आंकड़े',
    stat_donations: 'सूचीबद्ध दान',
    stat_meals: 'वितरित भोजन',
    stat_donors: 'सक्रिय भोजन दाता',
    stat_shelters: 'आश्रय और गैर-सरकारी संगठन',

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
    status_requested: 'अनुरोधित',
    status_accepted: 'स्वीकृत',
    status_ready: 'पिकअप हेतु तैयार',
    status_collected: 'संग्रहित (कलेक्टेड)',
    status_completed: 'वितरित',

    // Verification
    org_id_label: 'संगठन आईडी / एनजीओ पंजीकरण संख्या',
    org_id_placeholder: 'उदा. NGO-KA-2024-8921 अथवा दर्पण आईडी',
    org_id_help: 'वास्तविक राहत आश्रयों को सत्यापित करने के लिए अनिवार्य वैधानिक पहचान।',
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
    hero_title_1: 'ಆಹಾರವನ್ನು ವ್ಯರ್ಥ ಮಾಡಬೇಡಿ. ',
    hero_title_2: 'ಭರವಸೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
    hero_subtitle: 'ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು, ಕಾಲೇಜು ಕ್ಯಾಂಟೀನ್‌ಗಳು ಮತ್ತು ಕ್ಯಾಟರರ್‌ಗಳನ್ನು ಅನಾಥಾಶ್ರಮಗಳು ಮತ್ತು ಸಮುದಾಯ ಆಶ್ರಯಗಳಿಗೆ ಸಂಪರ್ಕಿಸುವ ಬುದ್ಧಿವಂತ ತಂತ್ರಜ್ಞಾನ ವೇದಿಕೆ. ಆಹಾರ ಹಾಳಾಗುವ ಮುನ್ನವೇ ವಿತರಿಸಲು ಎಐ ಅಲ್ಗಾರಿದಮ್‌ಗಳಿಂದ ಚಾಲಿತವಾಗಿದೆ.',
    btn_donate: 'ಹೆಚ್ಚುವರಿ ಆಹಾರ ದಾನ ಮಾಡಿ',
    btn_find_food: 'ಆಹಾರ ಹುಡುಕಿ (ಆಶ್ರಯಗಳು)',
    btn_explore_ai: 'ಎಐ ಮ್ಯಾಚಿಂಗ್ ಅನ್ವೇಷಿಸಿ',
    tag_zero_api: 'ಶೂನ್ಯ ಬಾಹ್ಯ ಪಾವತಿಸಿದ ಎಪಿಐಗಳು',
    tag_matching: 'ಡೈನಾಮಿಕ್ 4-ಅಂಶ ಹೊಂದಾಣಿಕೆ',
    tag_fssai: 'FSSAI ನೈರ್ಮಲ್ಯ ಮಾನದಂಡಗಳು',

    // Live Stats
    live_impact_stats: 'ಲೈವ್ ನೈಜ ಸಮಯದ ಪ್ರಭಾವ ಅಂಕಿಅಂಶಗಳು',
    stat_donations: 'ದಾಖಲಾದ ದಾನಗಳು',
    stat_meals: 'ವಿತರಿಸಿದ ಊಟಗಳು',
    stat_donors: 'ಸಕ್ರಿಯ ಆಹಾರ ದಾನಿಗಳು',
    stat_shelters: 'ಆಶ್ರಯಗಳು ಮತ್ತು ಎನ್‌ಜಿಒಗಳು',

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
    status_requested: 'ವಿನಂತಿಸಲಾಗಿದೆ',
    status_accepted: 'ಅಂಗೀಕರಿಸಲಾಗಿದೆ',
    status_ready: 'ಪಿಕಪ್‌ಗೆ ಸಿದ್ಧವಾಗಿದೆ',
    status_collected: 'ಸಂಗ್ರಹಿಸಲಾಗಿದೆ (ಕಲೆಕ್ಟೆಡ್)',
    status_completed: 'ವಿತರಿಸಲಾಗಿದೆ',

    // Verification
    org_id_label: 'ಸಂಸ್ಥೆಯ ಐಡಿ / ಎನ್‌ಜಿಒ ನೋಂದಣಿ ಸಂಖ್ಯೆ',
    org_id_placeholder: 'ಉದಾ: NGO-KA-2024-8921 ಅಥವಾ ದರ್ಪಣ್ ಐಡಿ',
    org_id_help: 'ನೈಜ ಆಶ್ರಮಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಶಾಸನಬದ್ಧ ಸಂಸ್ಥೆಯ ಗುರುತಿನ ಚೀಟಿ ಕಡ್ಡಾಯವಾಗಿದೆ.',
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
