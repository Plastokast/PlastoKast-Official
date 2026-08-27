/**
 * email-service.js
 * PlastoKast Autonomous Email Dispatcher
 * Sends lead data asynchronously to /api/send-email (Resend Engine)
 */

function dispatchInquiryEmail(inquiryData) {
  if (!inquiryData) return;

  try {
    let adminLeadEmail = "ankitdobariya34@gmail.com";
    if (typeof getSiteSettings === "function") {
      const s = getSiteSettings();
      if (s && s.adminLeadEmail) adminLeadEmail = s.adminLeadEmail;
    }

    const payload = {
      inquiryId: inquiryData.id || "PK-" + Math.floor(1000 + Math.random() * 9000),
      name: inquiryData.name || "Valued Buyer",
      email: inquiryData.email || "",
      phone: inquiryData.phone || "",
      country: inquiryData.country || "India",
      adminEmail: adminLeadEmail,
      notes: inquiryData.message || inquiryData.notes || "",
      products: inquiryData.products || [],
      productName: inquiryData.productName || inquiryData.subject || "Product Inquiry",
      quantity: inquiryData.quantity || inquiryData.qty || "Standard Bulk",
      timestamp: inquiryData.timestamp || new Date().toISOString()
    };

    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log("[Resend Engine] Dispatched successfully:", resData);
      })
      .catch((err) => {
        console.warn("[Resend Engine] Background dispatch non-blocking notice:", err);
      });
  } catch (err) {
    console.warn("[Resend Engine] Dispatch caught:", err);
  }
}

if (typeof window !== "undefined") {
  window.dispatchInquiryEmail = dispatchInquiryEmail;
}
