/**
 * site-settings.js
 * PlastoKast Centralized Site Settings & Dynamic Contact / Phone Controller
 * Allows changing phone numbers, WhatsApp, email, and address centrally from the Admin Panel.
 */

const DEFAULT_SITE_SETTINGS = {
  phone1: "+91 99094 12068",
  phone2: "+91 89053 32576",
  whatsapp: "+91 99094 12068",
  email: "plastokast.sales@gmail.com",
  address: "Ground Floor, Common Plot, Om Shree Sadguru Nityanand Co-op Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India",
  shortAddress: "PlastoKast House, Surat, Gujarat, India – 395004",
  workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM",
  companyName: "PlastoKast™ Inc.",
  tagline: "Connect Bones™"
};

const SETTINGS_STORAGE_KEY = "plastokast_site_settings";

function cleanPhoneForLink(phoneStr) {
  if (!phoneStr) return "";
  // Keep leading +, remove all spaces, dashes, parentheses
  const hasPlus = phoneStr.trim().startsWith("+");
  const digits = phoneStr.replace(/\D/g, "");
  return hasPlus ? "+" + digits : digits;
}

function getSiteSettings() {
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn("Failed to parse saved site settings, using defaults", e);
    }
  }
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
  return DEFAULT_SITE_SETTINGS;
}

function saveSiteSettings(newSettings) {
  if (!newSettings || typeof newSettings !== "object") return;
  const current = getSiteSettings();
  const merged = { ...current, ...newSettings };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("plastokast_settings_updated", { detail: merged }));
  applyDynamicSiteSettings();
  return merged;
}

function resetSiteSettingsToDefault() {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
  window.dispatchEvent(new CustomEvent("plastokast_settings_updated", { detail: DEFAULT_SITE_SETTINGS }));
  applyDynamicSiteSettings();
  return DEFAULT_SITE_SETTINGS;
}

function applyDynamicSiteSettings() {
  const settings = getSiteSettings();
  const phone1Clean = cleanPhoneForLink(settings.phone1);
  const phone2Clean = cleanPhoneForLink(settings.phone2);
  const whatsappClean = cleanPhoneForLink(settings.whatsapp);

  // 1. Explicit data-setting targets
  document.querySelectorAll("[data-setting='phone1']").forEach(el => {
    if (el.tagName === "A") {
      el.href = "tel:" + phone1Clean;
    }
    el.textContent = settings.phone1;
  });

  document.querySelectorAll("[data-setting='phone2']").forEach(el => {
    if (el.tagName === "A") {
      el.href = "tel:" + phone2Clean;
    }
    el.textContent = settings.phone2;
  });

  document.querySelectorAll("[data-setting='whatsapp']").forEach(el => {
    if (el.tagName === "A") {
      el.href = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=Hi%20PlastoKast,%20I%20am%20interested%20in%20your%20products.`;
    }
    el.textContent = settings.whatsapp;
  });

  document.querySelectorAll("[data-setting='email']").forEach(el => {
    if (el.tagName === "A") {
      el.href = "mailto:" + settings.email;
    }
    el.textContent = settings.email;
  });

  document.querySelectorAll("[data-setting='address']").forEach(el => {
    el.textContent = settings.address;
  });

  document.querySelectorAll("[data-setting='shortAddress']").forEach(el => {
    el.textContent = settings.shortAddress;
  });

  document.querySelectorAll("[data-setting='workingHours']").forEach(el => {
    el.textContent = settings.workingHours;
  });

  // 2. Floating WhatsApp widget
  document.querySelectorAll(".whatsapp-widget, a[href*='api.whatsapp.com']").forEach(el => {
    const currentHref = el.getAttribute("href") || "";
    // Update phone number in whatsapp URL while keeping original text parameter if present
    const urlMatch = currentHref.match(/text=([^&]*)/);
    const textParam = urlMatch ? urlMatch[1] : "Hi%20PlastoKast,%20I%20am%20interested%20in%20your%20products.";
    el.href = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=${textParam}`;
  });

  // 3. Mobile Drawer Phone & WhatsApp buttons
  const drawerPhone = document.querySelector(".drawer-phone-btn");
  if (drawerPhone) {
    drawerPhone.href = "tel:" + phone1Clean;
    drawerPhone.innerHTML = `<i class="fa fa-phone"></i> ${settings.phone1}`;
  }

  const drawerWhatsapp = document.querySelector(".drawer-whatsapp-btn");
  if (drawerWhatsapp) {
    drawerWhatsapp.href = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=Hi%20PlastoKast,%20I%20am%20interested%20in%20your%20products.`;
  }

  // 4. Update Footer Contact spans
  document.querySelectorAll(".footer-contact-item a[href^='tel:']").forEach((el, index) => {
    if (index === 0) {
      el.href = "tel:" + phone1Clean;
      el.textContent = settings.phone1;
    } else {
      el.href = "tel:" + phone2Clean;
      el.textContent = settings.phone2;
    }
  });

  document.querySelectorAll(".footer-contact-item a[href^='mailto:']").forEach(el => {
    el.href = "mailto:" + settings.email;
    el.textContent = settings.email;
  });

  // 5. Product Details page inquiry card
  const prodInquiryPhone = document.getElementById("productDetailPhoneContainer");
  if (prodInquiryPhone) {
    prodInquiryPhone.innerHTML = `Inquiry Phone: <a href="tel:${phone1Clean}">${settings.phone1}</a> / <a href="tel:${phone2Clean}">${settings.phone2}</a>`;
  }

  const prodWhatsappBtn = document.querySelector(".btn-whatsapp-inquiry");
  if (prodWhatsappBtn) {
    prodWhatsappBtn.href = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=Hi%20PlastoKast,%20I%20am%20interested%20in%20product%20inquiry.`;
  }
}

// Auto-run on DOM load
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyDynamicSiteSettings);
  } else {
    applyDynamicSiteSettings();
  }
  window.addEventListener("plastokast_settings_updated", applyDynamicSiteSettings);
  window.addEventListener("storage", (e) => {
    if (e.key === SETTINGS_STORAGE_KEY) applyDynamicSiteSettings();
  });
}
