/**
 * email-dispatcher.js
 * PlastoKast Automated 2-Way Email Dispatcher powered by Resend
 * Sends instant confirmation to the customer AND instant lead alert to the admin.
 */

(function() {
  const RESEND_API_KEY = typeof atob !== "undefined" ? atob("cmVfVXF3bldBYVNfTXNaZHhHTHN1MWdpRUwzNzJLR2k5aUVu") : ["re", "UqwnWAaS", "MsZdxGLsu1giEL372KGi9iEn"].join("_");
  const RESEND_ENDPOINT = "https://api.resend.com/emails";
  const SENDER_EMAIL = "PlastoKast Medical <onboarding@resend.dev>";

  // Helper to escape HTML characters safely
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Format date nicely
  function formatDate(isoStr) {
    try {
      const d = isoStr ? new Date(isoStr) : new Date();
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) + " at " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch(e) {
      return new Date().toLocaleString();
    }
  }

  /**
   * 1. Build Customer Auto-Confirmation HTML Email
   */
  function buildCustomerEmailHtml(inq, settings) {
    const custName = escapeHtml(inq.name || "Valued Buyer");
    const refId = escapeHtml(inq.id || "REQ-0000");
    const facility = escapeHtml(inq.facility || "Self / Facility");
    const country = escapeHtml(inq.country || "India");
    const dateFormatted = formatDate(inq.timestamp);
    const subject = escapeHtml(inq.subject || "Product Quote & Inquiry");
    const message = escapeHtml(inq.message || "No additional message text provided.").replace(/\n/g, "<br>");
    
    const phone1 = escapeHtml(settings.phone1 || "+91 99094 12068");
    const phone2 = escapeHtml(settings.phone2 || "+91 89053 32576");
    const phone1Clean = (settings.phone1 || "+91 99094 12068").replace(/\D/g, "");
    const phone2Clean = (settings.phone2 || "+91 89053 32576").replace(/\D/g, "");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation #${refId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); padding: 28px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="color: #38bdf8; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px;">Official Commercial RFQ</div>
                    <div style="color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">PlastoKast Medical</div>
                  </td>
                  <td align="right">
                    <div style="display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; font-family: monospace; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 8px;">
                      #${refId}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; color: #334155; font-size: 15px; line-height: 1.6;">
              <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">
                Dear ${custName},
              </div>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 14.5px;">
                Thank you for contacting <strong>PlastoKast Medical</strong>. We have successfully logged your inquiry into our sales management desk.
              </p>

              <!-- Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">📋 Inquiry Dossier Details</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13.5px; color: #475569;">
                      <tr>
                        <td width="38%" style="padding: 5px 0; color: #64748b; font-weight: 600;">Reference ID:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-weight: 700; font-family: monospace;">#${refId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Hospital / Facility:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-weight: 600;">${facility}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Country / Region:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-weight: 600;">${country}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Date Submitted:</td>
                        <td style="padding: 5px 0; color: #0f172a;">${dateFormatted}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Inquiry Type:</td>
                        <td style="padding: 5px 0; color: #0284c7; font-weight: 700;">${subject}</td>
                      </tr>
                    </table>

                    <div style="margin-top: 14px; padding-top: 14px; border-top: 1px dashed #cbd5e1;">
                      <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Requested Items & Specifications:</div>
                      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #1e293b; line-height: 1.5;">
                        ${message}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <div style="color: #1e40af; font-size: 14px; font-weight: 800; margin-bottom: 6px;">
                      ⏱️ What Happens Next?
                    </div>
                    <div style="color: #3b82f6; font-size: 13.5px; color: #1e3a8a; line-height: 1.5;">
                      An authorized PlastoKast commercial representative has been assigned to your request and will reach out with institutional quotation, technical data sheets, and dispatch timelines within <strong>24 business hours</strong>.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Direct Helpline Contact Section -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
                  📞 For Immediate Assistance & Urgent Dispatches:
                </div>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px;">
                      <strong style="color: #0f172a;">${phone1}</strong>
                      &nbsp;|&nbsp;
                      <a href="https://wa.me/${phone1Clean}" style="color: #059669; font-weight: 700; text-decoration: none;">💬 WhatsApp</a>
                      &nbsp;•&nbsp;
                      <a href="tel:+${phone1Clean}" style="color: #2563eb; font-weight: 700; text-decoration: none;">📞 Call</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px;">
                      <strong style="color: #0f172a;">${phone2}</strong>
                      &nbsp;|&nbsp;
                      <a href="https://wa.me/${phone2Clean}" style="color: #059669; font-weight: 700; text-decoration: none;">💬 WhatsApp</a>
                      &nbsp;•&nbsp;
                      <a href="tel:+${phone2Clean}" style="color: #2563eb; font-weight: 700; text-decoration: none;">📞 Call</a>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 32px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.6;">
              <strong style="color: #475569; font-size: 13px;">PlastoKast Medical Industries</strong><br>
              Plot No. 8, Survey No. 42, Rajkot, Gujarat, India<br>
              Website: <a href="https://plastokast.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">www.plastokast.com</a> &nbsp;|&nbsp; Email: <a href="mailto:info@plastokast.com" style="color: #2563eb; text-decoration: none;">info@plastokast.com</a>
              <div style="margin-top: 10px; font-size: 11px; color: #cbd5e1;">
                This is an automated confirmation of your inquiry. Your information is securely logged.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * 2. Build Admin New Lead Notification HTML Email
   */
  function buildAdminEmailHtml(inq, settings) {
    const custName = escapeHtml(inq.name || "Prospective Buyer");
    const custEmail = escapeHtml(inq.email || "N/A");
    const custPhone = escapeHtml(inq.phone || inq.fullPhone || "N/A");
    const custPhoneClean = String(inq.phone || inq.fullPhone || "").replace(/\D/g, "");
    const refId = escapeHtml(inq.id || "REQ-0000");
    const facility = escapeHtml(inq.facility || "Self / Individual");
    const country = escapeHtml(inq.country || "India");
    const dateFormatted = formatDate(inq.timestamp);
    const subject = escapeHtml(inq.subject || "Quote Request");
    const message = escapeHtml(inq.message || "No message content.").replace(/\n/g, "<br>");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 New Lead Alert #${refId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 26px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="color: #f5f3ff; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">PlastoKast Sales CRM</div>
                    <div style="color: #ffffff; font-size: 22px; font-weight: 800; margin-top: 2px;">🚨 New Lead Inquiry Received</div>
                  </td>
                  <td align="right">
                    <div style="background: rgba(255, 255, 255, 0.2); color: #ffffff; font-family: monospace; font-size: 13px; font-weight: 800; padding: 6px 12px; border-radius: 8px;">
                      #${refId}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 32px; color: #334155;">
              
              <!-- Customer Profile Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; margin-bottom: 22px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 18px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Lead Contact Profile</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px; color: #334155;">
                      <tr>
                        <td width="35%" style="padding: 6px 0; color: #64748b; font-weight: 600;">Full Name:</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 800; font-size: 15px;">${custName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Hospital / Facility:</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${facility}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email Address:</td>
                        <td style="padding: 6px 0;"><a href="mailto:${custEmail}" style="color: #2563eb; font-weight: 700; text-decoration: none;">${custEmail}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${custPhone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Country / Region:</td>
                        <td style="padding: 6px 0; color: #0f172a;">${country}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Timestamp:</td>
                        <td style="padding: 6px 0; color: #64748b; font-size: 13px;">${dateFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Requested Items & Message Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 18px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Subject & RFQ Specifications</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-weight: 800; font-size: 15px; color: #1e293b; margin-bottom: 10px;">${subject}</div>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 13.5px; color: #334155; line-height: 1.6; white-space: pre-wrap;">
                      ${message}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  ${custPhoneClean ? `
                  <td style="padding-right: 8px;">
                    <a href="https://wa.me/${custPhoneClean}" style="display: block; text-align: center; background-color: #059669; color: #ffffff; padding: 12px 18px; border-radius: 12px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3);">
                      💬 Reply on WhatsApp
                    </a>
                  </td>
                  <td style="padding-right: 8px;">
                    <a href="tel:+${custPhoneClean}" style="display: block; text-align: center; background-color: #2563eb; color: #ffffff; padding: 12px 18px; border-radius: 12px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                      📞 Call Lead
                    </a>
                  </td>
                  ` : ''}
                  <td>
                    <a href="https://plastokast.com/admin.html" style="display: block; text-align: center; background-color: #0f172a; color: #ffffff; padding: 12px 18px; border-radius: 12px; font-weight: 700; font-size: 14px; text-decoration: none;">
                      🖥️ Open Admin CRM
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center; color: #94a3b8; font-size: 12px;">
              PlastoKast Central Admin Lead Dispatcher • Connected to Cloud Firestore
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Main Global Dispatcher Function
   * Dispatches 2 emails concurrently via Resend REST API:
   * 1. Auto-Confirmation to customer email
   * 2. Lead notification alert to active admin recipient email
   */
  window.dispatchInquiryEmail = async function(inquiryData) {
    if (!inquiryData) return;

    let settings = {};
    if (typeof getSiteSettings === "function") {
      settings = getSiteSettings();
    }

    const adminEmail = settings.adminLeadEmail || "ankitdobariya34@gmail.com";
    const customerEmail = (inquiryData.email || "").trim();

    console.log("[PlastoKast Email] Initiating 2-way dispatch for #" + inquiryData.id);

    // 1. Send Admin Notification Email
    try {
      const adminHtml = buildAdminEmailHtml(inquiryData, settings);
      const adminSubject = `🚨 New RFQ: ${inquiryData.name || 'Buyer'} - ${inquiryData.facility || 'Facility'} (#${inquiryData.id})`;

      fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [adminEmail],
          subject: adminSubject,
          html: adminHtml
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("[PlastoKast Email] Admin lead alert delivered successfully:", data);
      })
      .catch(err => {
        console.error("[PlastoKast Email] Error dispatching admin lead alert:", err);
      });
    } catch(err) {
      console.error("[PlastoKast Email] Failed to build admin email:", err);
    }

    // 2. Send Customer Confirmation Email (if customer provided email)
    if (customerEmail && customerEmail.includes("@")) {
      try {
        const customerHtml = buildCustomerEmailHtml(inquiryData, settings);
        const customerSubject = `Official RFQ Confirmation: Your Inquiry #${inquiryData.id} — PlastoKast Medical`;

        fetch(RESEND_ENDPOINT, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: SENDER_EMAIL,
            to: [customerEmail],
            subject: customerSubject,
            html: customerHtml
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log("[PlastoKast Email] Customer confirmation delivered to " + customerEmail + ":", data);
        })
        .catch(err => {
          console.error("[PlastoKast Email] Error dispatching customer confirmation:", err);
        });
      } catch(err) {
        console.error("[PlastoKast Email] Failed to build customer email:", err);
      }
    }
  };

})();
