import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ---- Translations ----
const resources = {
  en: {
    translation: {
      // Common
      login: "Login",
      logout: "Logout",

      // Categories
      all: "All",
      new: "NEW",
      search: "Search",
      orders: "Orders",
      returns: "Returns",
      cart: "Cart",
      my_profile: "My Profile",
      my_orders: "My Orders",
      wishlist: "My Wishlist",
      notifications: "Notifications",
      become_seller: "Become a Seller",
      accessories: "Accessories",
      beauty: "Beauty",
      essentials: "Essentials",
      fabric: "Fabric",
      men: "Men",
      wellness: "Wellness",
      women: "Women",
      sustainable_choices: "Sustainable Choices",
      gift_boxes: "Gift Boxes",

      // Profile Section
      hello: "Hello",
      personal_information: "Personal Information",
      personal_info_subtext: "Manage your personal details",
      edit_profile: "Edit Profile",
      save: "Save",
      cancel: "Cancel",
      first_name: "First Name",
      last_name: "Last Name",
      your_gender: "Your Gender",
      male: "Male",
      female: "Female",
      email_address: "Email Address",
      mobile_number: "Mobile Number",
      account_summary: "Account Summary",
      full_name: "Full Name",
      email: "Email",
      mobile: "Mobile",
      member_since: "Member Since",
      deactivate_account: "Deactivate Account",
      delete_account: "Delete Account",
    },
  },

  hi: {
    translation: {
      // Common
      login: "लॉगिन",
      logout: "लॉगआउट",

      // Categories
      all: "सब",
      new: "नया",
      search: "खोजें",
      orders: "ऑर्डर",
      returns: "वापसी",
      cart: "कार्ट",
      my_profile: "मेरा प्रोफ़ाइल",
      my_orders: "मेरे ऑर्डर",
      wishlist: "मेरी विशलिस्ट",
      notifications: "सूचनाएं",
      become_seller: "विक्रेता बनें",
      accessories: "एसेसरीज़",
      beauty: "सौंदर्य",
      essentials: "आवश्यक वस्तुएँ",
      fabric: "कपड़ा",
      men: "पुरुष",
      wellness: "स्वास्थ्य",
      women: "महिला",
      sustainable_choices: "सतत विकल्प",
      gift_boxes: "उपहार बॉक्स",

      // Profile Section
      hello: "नमस्ते",
      personal_information: "व्यक्तिगत जानकारी",
      personal_info_subtext: "अपनी व्यक्तिगत जानकारी प्रबंधित करें",
      edit_profile: "प्रोफ़ाइल संपादित करें",
      save: "सहेजें",
      cancel: "रद्द करें",
      first_name: "पहला नाम",
      last_name: "अंतिम नाम",
      your_gender: "आपका लिंग",
      male: "पुरुष",
      female: "महिला",
      email_address: "ईमेल पता",
      mobile_number: "मोबाइल नंबर",
      account_summary: "खाता सारांश",
      full_name: "पूरा नाम",
      email: "ईमेल",
      mobile: "मोबाइल",
      member_since: "सदस्यता तिथि",
      deactivate_account: "खाता निष्क्रिय करें",
      delete_account: "खाता हटाएं",
    },
  },
};

// ---- Initialize i18n ----
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// Optional: Update language dynamically from localStorage
const savedLang = localStorage.getItem("language");
if (savedLang && savedLang !== i18n.language) {
  i18n.changeLanguage(savedLang);
}

export default i18n;
