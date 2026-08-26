/**
 * email-dispatcher.js
 * PlastoKast Premium 2-Way Email Dispatcher
 * Delivers instant (<1s) executive HTML emails to both Admin & Customer.
 */

(function() {
  const DEFAULT_ADMIN_EMAIL = "ankitdobariya34@gmail.com";
  const SENDER_NAME = "PlastoKast Medical";

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
    const message = escapeHtml(inq.message || "Standard inquiry details.").replace(/\n/g, "<br>");
    
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
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%); padding: 26px 30px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="color: #38bdf8; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 3px;">Official Commercial RFQ</div>
                    <div style="color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">PlastoKast Medical</div>
                  </td>
                  <td align="right">
                    <div style="display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-family: monospace; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 8px;">
                      #${refId}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 30px 30px 20px 30px; color: #334155; font-size: 14.5px; line-height: 1.6;">
              <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 10px;">
                Dear ${custName},
              </div>
              <p style="margin: 0 0 18px 0; color: #475569; font-size: 14px;">
                Thank you for reaching out to <strong>PlastoKast Medical</strong>. We have logged your request into our sales management system.
              </p>

              <!-- Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 18px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.5px;">📋 Inquiry Details</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13.5px; color: #475569;">
                      <tr>
                        <td width="38%" style="padding: 4px 0; color: #64748b; font-weight: 600;">Reference ID:</td>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 700; font-family: monospace;">#${refId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Hospital / Facility:</td>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${facility}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Country / Region:</td>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${country}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Date Submitted:</td>
                        <td style="padding: 4px 0; color: #0f172a;">${dateFormatted}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Inquiry Subject:</td>
                        <td style="padding: 4px 0; color: #0284c7; font-weight: 700;">${subject}</td>
                      </tr>
                    </table>

                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
                      <div style="font-size: 11.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Requested Items & Specifications:</div>
                      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #1e293b; line-height: 1.5;">
                        ${message}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 18px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <div style="color: #1e40af; font-size: 13.5px; font-weight: 800; margin-bottom: 4px;">
                      ⏱️ What Happens Next?
                    </div>
                    <div style="color: #1e3a8a; font-size: 13px; line-height: 1.5;">
                      An authorized PlastoKast representative will review your request and reach out with institutional quotation, technical data sheets, and dispatch timelines within <strong>24 business hours</strong>.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Helpline Contact Section -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 16px;">
                <div style="font-size: 12.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
                  📞 For Immediate Inquiries & Urgent Orders:
                </div>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 5px 0; font-size: 13.5px;">
                      <strong style="color: #0f172a;">${phone1}</strong>
                      &nbsp;|&nbsp;
                      <a href="https://wa.me/${phone1Clean}" style="color: #059669; font-weight: 700; text-decoration: none;">💬 WhatsApp</a>
                      &nbsp;•&nbsp;
                      <a href="tel:+${phone1Clean}" style="color: #2563eb; font-weight: 700; text-decoration: none;">📞 Call</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-size: 13.5px;">
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
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 30px; text-align: center; color: #94a3b8; font-size: 11.5px; line-height: 1.5;">
              <strong style="color: #475569; font-size: 12px;">PlastoKast Medical Industries</strong><br>
              Plot No. 8, Survey No. 42, Rajkot, Gujarat, India<br>
              Website: <a href="https://plastokast.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">www.plastokast.com</a> &nbsp;|&nbsp; Email: <a href="mailto:info@plastokast.com" style="color: #2563eb; text-decoration: none;">info@plastokast.com</a>
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
  <title>New Lead Alert #${refId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.35);">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 24px 30px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="color: #f5f3ff; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">PlastoKast Sales Desk</div>
                    <div style="color: #ffffff; font-size: 21px; font-weight: 800; margin-top: 2px;">🚨 New Lead Inquiry Received</div>
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
            <td style="padding: 26px 30px; color: #334155;">
              
              <!-- Customer Profile Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Lead Contact Profile</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13.5px; color: #334155;">
                      <tr>
                        <td width="35%" style="padding: 5px 0; color: #64748b; font-weight: 600;">Full Name:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-weight: 800; font-size: 15px;">${custName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Hospital / Facility:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-weight: 700;">${facility}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Email Address:</td>
                        <td style="padding: 5px 0;"><a href="mailto:${custEmail}" style="color: #2563eb; font-weight: 700; text-decoration: none;">${custEmail}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-weight: 700;">${custPhone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Country / Region:</td>
                        <td style="padding: 5px 0; color: #0f172a;">${country}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Submitted:</td>
                        <td style="padding: 5px 0; color: #64748b; font-size: 12.5px;">${dateFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Requested Items Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Subject & Specifications</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-weight: 800; font-size: 14.5px; color: #1e293b; margin-bottom: 8px;">${subject}</div>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 13px; color: #334155; line-height: 1.5; white-space: pre-wrap;">
                      ${message}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Links -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  ${custPhoneClean ? `
                  <td style="padding-right: 8px;">
                    <a href="https://wa.me/${custPhoneClean}" style="display: block; text-align: center; background-color: #059669; color: #ffffff; padding: 11px 16px; border-radius: 10px; font-weight: 700; font-size: 13.5px; text-decoration: none;">
                      💬 WhatsApp
                    </a>
                  </td>
                  <td style="padding-right: 8px;">
                    <a href="tel:+${custPhoneClean}" style="display: block; text-align: center; background-color: #2563eb; color: #ffffff; padding: 11px 16px; border-radius: 10px; font-weight: 700; font-size: 13.5px; text-decoration: none;">
                      📞 Call Lead
                    </a>
                  </td>
                  ` : ''}
                  <td>
                    <a href="https://plastokast.com/admin.html" style="display: block; text-align: center; background-color: #0f172a; color: #ffffff; padding: 11px 16px; border-radius: 10px; font-weight: 700; font-size: 13.5px; text-decoration: none;">
                      🖥️ Open CRM
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 30px; text-align: center; color: #94a3b8; font-size: 11px;">
              PlastoKast Medical Admin Dispatcher • Real-time Cloud Sync
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
   * Main Global Dispatcher
   * Sends both Admin and Customer emails
   */
  window.dispatchInquiryEmail = async function(inquiryData) {
    if (!inquiryData) return;

    let settings = {};
    if (typeof getSiteSettings === "function") {
      settings = getSiteSettings();
    }

    const adminEmail = settings.adminLeadEmail || DEFAULT_ADMIN_EMAIL;
    const customerEmail = (inquiryData.email || "").trim();
    const refId = inquiryData.id || ("REQ-" + Math.floor(1000 + Math.random() * 9000));
    const custName = inquiryData.name || "Buyer";
    const facility = inquiryData.facility || "Facility";

    const adminSubject = `🚨 New RFQ: ${custName} - ${facility} (#${refId})`;
    const adminHtml = buildAdminEmailHtml(inquiryData, settings);

    const customerSubject = `Official RFQ Confirmation: Your Inquiry #${refId} — PlastoKast Medical`;
    const customerHtml = buildCustomerEmailHtml(inquiryData, settings);

    console.log("[PlastoKast Email] Dispatching 2-way emails for #" + refId);

    // Function to send via /api/send-email (Serverless Resend API)
    async function sendViaApi(to, subject, html) {
      try {
        const resp = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, subject, html })
        });
        const resJson = await resp.json();
        return { ok: resp.ok, data: resJson };
      } catch(err) {
        return { ok: false, error: err };
      }
    }

    // 1. Send Admin Email
    const adminSend = await sendViaApi(adminEmail, adminSubject, adminHtml);
    if (!adminSend.ok) {
      console.warn("[PlastoKast Email] /api/send-email admin dispatch fallback:", adminSend);
      // Fallback via FormSubmit if /api is not deployed
      try {
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: custName,
            email: customerEmail,
            _replyto: customerEmail || adminEmail,
            phone_number: inquiryData.phone || "N/A",
            hospital_or_facility: facility,
            inquiry_reference_id: "#" + refId,
            requested_products_and_details: inquiryData.message || "N/A",
            _subject: adminSubject,
            _template: "table",
            _captcha: "false"
          })
        });
      } catch(e) {}
    } else {
      console.log("[PlastoKast Email] Admin lead alert delivered successfully:", adminSend.data);
    }

    // 2. Send Customer Email
    if (customerEmail && customerEmail.includes("@")) {
      const custSend = await sendViaApi(customerEmail, customerSubject, customerHtml);
      if (custSend.ok) {
        console.log("[PlastoKast Email] Customer confirmation delivered to " + customerEmail + ":", custSend.data);
      } else {
        console.warn("[PlastoKast Email] Customer email dispatch warning:", custSend);
      }
    }
  };

})();
