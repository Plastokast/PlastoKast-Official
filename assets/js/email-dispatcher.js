/**
 * email-dispatcher.js
 * PlastoKast Universal 2-Way Email Dispatcher powered by FormSubmit.co
 * 100% Free Lifetime, Zero Limits, Dual Email Automation:
 * 1. Admin Lead Alert with 1-click customer reply (delivered to active admin email)
 * 2. Customer Auto-Confirmation with reference ID and official helpline numbers
 */

(function() {
  const DEFAULT_ADMIN_EMAIL = "ankitdobariya34@gmail.com";

  window.dispatchInquiryEmail = async function(inquiryData) {
    if (!inquiryData) return;

    // Get dynamically configured admin recipient email from site settings
    let adminEmail = DEFAULT_ADMIN_EMAIL;
    try {
      if (typeof getSiteSettings === "function") {
        const settings = getSiteSettings();
        if (settings && settings.adminLeadEmail) {
          adminEmail = settings.adminLeadEmail.trim();
        }
      }
    } catch(e) {}

    const refId = inquiryData.id || ("REQ-" + Math.floor(1000 + Math.random() * 9000));
    const custName = (inquiryData.name || "Valued Buyer").trim();
    const custEmail = (inquiryData.email || "").trim();
    const custPhone = (inquiryData.phone || "N/A").trim();
    const facility = (inquiryData.facility || "Self / Facility").trim();
    const country = (inquiryData.country || "India").trim();
    const subject = (inquiryData.subject || "Product Quote & Inquiry").trim();
    const message = (inquiryData.message || "Standard inquiry details.").trim();

    // Professional Auto-Response message sent automatically to the customer
    const autoResponseMessage = `Dear ${custName},

Thank you for contacting PlastoKast Medical Industries. 
We have successfully received your official product inquiry and quote request.

==================================================
📋 INQUIRY SUMMARY
• Reference ID      : #${refId}
• Facility / Org    : ${facility}
• Country / Region  : ${country}
• Inquiry Subject   : ${subject}
==================================================

⏱️ WHAT HAPPENS NEXT?
An authorized commercial sales representative has been assigned to your request and will reach out with institutional pricing, technical data sheets, and dispatch timelines within 24 business hours.

📞 DIRECT SALES & ENQUIRY HELPLINE:
• +91 99094 12068 (Call / WhatsApp)
• +91 89053 32576 (Call / WhatsApp)

PlastoKast Medical Industries
Plot No. 8, Survey No. 42, Rajkot, Gujarat, India
Website: https://plastokast.com | Email: info@plastokast.com

(This is an automated confirmation of your request.)`;

    const payload = {
      name: custName,
      email: custEmail || "no-email-provided@plastokast.com",
      _replyto: custEmail || adminEmail,
      phone_number: custPhone,
      hospital_or_facility: facility,
      country_or_region: country,
      inquiry_reference_id: "#" + refId,
      inquiry_subject: subject,
      requested_products_and_details: message,
      _subject: `🚨 New RFQ: ${custName} - ${facility} (#${refId})`,
      _template: "table",
      _captcha: "false",
      _autoresponse: autoResponseMessage
    };

    const targetUrl = `https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`;

    console.log(`[PlastoKast Email Dispatcher] Sending 2-way lead #${refId} to ${adminEmail}...`);

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("[PlastoKast Email Dispatcher] FormSubmit Response:", result);
      return result;
    } catch(err) {
      console.warn("[PlastoKast Email Dispatcher] Background dispatch notice:", err);
      return null;
    }
  };

})();
