/**
 * admin-contact.js
 * PlastoKast Admin Contact & Phone Numbers Management Controller
 */

function initAdminContactSettings() {
  const form = document.getElementById("adminContactSettingsForm");
  const phone1Input = document.getElementById("settingPhone1");
  const phone2Input = document.getElementById("settingPhone2");
  const whatsappInput = document.getElementById("settingWhatsapp");
  const emailInput = document.getElementById("settingEmail");
  const adminLeadEmailInput = document.getElementById("settingAdminLeadEmail");
  const addressInput = document.getElementById("settingAddress");
  const shortAddressInput = document.getElementById("settingShortAddress");
  const hoursInput = document.getElementById("settingHours");

  // Preview elements
  const previewPhone1 = document.getElementById("previewPhone1");
  const previewPhone2 = document.getElementById("previewPhone2");
  const previewWhatsapp = document.getElementById("previewWhatsapp");
  const previewEmail = document.getElementById("previewEmail");
  const previewAddress = document.getElementById("previewAddress");

  function loadSettingsIntoForm() {
    const settings = getSiteSettings();
    if (phone1Input) phone1Input.value = settings.phone1 || "";
    if (phone2Input) phone2Input.value = settings.phone2 || "";
    if (whatsappInput) whatsappInput.value = settings.whatsapp || "";
    if (emailInput) emailInput.value = settings.email || "";
    if (adminLeadEmailInput) adminLeadEmailInput.value = settings.adminLeadEmail || "ankitdobariya34@gmail.com";
    if (addressInput) addressInput.value = settings.address || "";
    if (shortAddressInput) shortAddressInput.value = settings.shortAddress || "";
    if (hoursInput) hoursInput.value = settings.workingHours || "";

    updateLivePreview();
  }

  function updateLivePreview() {
    const p1 = phone1Input ? phone1Input.value : "+91 99094 12068";
    const p2 = phone2Input ? phone2Input.value : "+91 89053 32576";
    const wa = whatsappInput ? whatsappInput.value : "+91 89053 32576";
    const em = emailInput ? emailInput.value : "plastokast.sales@gmail.com";
    const ad = addressInput ? addressInput.value : "Ground Floor, Common Plot, Om Shree Sadguru Nityanand Co-op Housing Society, Laxmikant Asharam Road, Katargram, Surat – 395004, Gujarat, India";

    if (previewPhone1) previewPhone1.textContent = p1;
    if (previewPhone2) previewPhone2.textContent = p2;
    if (previewWhatsapp) previewWhatsapp.textContent = wa;
    if (previewEmail) previewEmail.textContent = em;
    if (previewAddress) previewAddress.textContent = ad;
  }

  window.refreshContactSettings = loadSettingsIntoForm;

  window.saveAdminContactSettings = function() {
    const updated = {
      phone1: phone1Input ? phone1Input.value.trim() : "",
      phone2: phone2Input ? phone2Input.value.trim() : "",
      whatsapp: whatsappInput ? whatsappInput.value.trim() : "",
      email: emailInput ? emailInput.value.trim() : "",
      adminLeadEmail: adminLeadEmailInput ? adminLeadEmailInput.value.trim() : "ankitdobariya34@gmail.com",
      address: addressInput ? addressInput.value.trim() : "",
      shortAddress: shortAddressInput ? shortAddressInput.value.trim() : "",
      workingHours: hoursInput ? hoursInput.value.trim() : ""
    };

    saveSiteSettings(updated);

    // Show visual toast notification
    showContactSaveToast("Contact details and Admin Lead Notification Email saved successfully!");
  };

  window.resetAdminContactDefaults = function() {
    if (confirm("Reset all phone numbers, email and addresses to official factory defaults?")) {
      resetSiteSettingsToDefault();
      loadSettingsIntoForm();
      showContactSaveToast("Reset to factory official contact numbers.");
    }
  };

  function showContactSaveToast(msg) {
    let toast = document.getElementById("contactSaveToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "contactSaveToast";
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #059669;
        color: #ffffff;
        padding: 14px 24px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.92rem;
        box-shadow: 0 10px 30px rgba(5, 150, 105, 0.35);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa fa-check-circle" style="font-size: 1.2rem;"></i> ${msg}`;
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";

    setTimeout(() => {
      toast.style.transform = "translateY(100px)";
      toast.style.opacity = "0";
    }, 3500);
  }

  // Bind live input listeners for real-time preview
  [phone1Input, phone2Input, whatsappInput, emailInput, adminLeadEmailInput, addressInput, shortAddressInput, hoursInput].forEach(inp => {
    if (inp) {
      inp.addEventListener("input", updateLivePreview);
    }
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.saveAdminContactSettings();
    });
  }

  loadSettingsIntoForm();
}

// Auto init on load
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdminContactSettings);
  } else {
    initAdminContactSettings();
  }
}
