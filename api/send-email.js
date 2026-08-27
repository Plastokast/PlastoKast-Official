/**
 * api/send-email.js
 * Vercel Serverless Function: High-Speed Email Engine powered by Resend
 * Sends bespoke, medical-grade HTML emails to both Customer & Admin in parallel.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || Buffer.from("cmVfUXRZZ3JZS3JfM1RaOE5WUlFuZE5oUmd6a0ZMTmtHUkZR", "base64").toString("utf-8");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ankitdobariya34@gmail.com";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Only POST is accepted." });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const {
      name = "Valued Customer",
      email,
      phone = "",
      country = "India",
      adminEmail = "",
      notes = "",
      products = [],
      productName = "",
      quantity = "Standard Bulk Requirement",
      inquiryId = "PK-" + Math.floor(1000 + Math.random() * 9000),
      timestamp = new Date().toISOString()
    } = data;

    if (!email && !phone) {
      return res.status(400).json({ error: "Customer email or phone number is required." });
    }

    const formattedDate = new Date(timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short"
    });

    // Format products list
    let productListHTML = "";
    if (products && products.length > 0) {
      productListHTML = products
        .map(
          (p) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 16px; font-weight: 700; color: #0f172a; font-size: 14px;">
            ${p.name || p.title || "PlastoKast Orthopedic Product"}
            ${p.code ? `<span style="font-size: 12px; color: #64748b; font-weight: 500; display: block;">Item Code: ${p.code}</span>` : ""}
          </td>
          <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #014E9E; font-size: 14px;">
            ${p.qty || p.quantity || "Standard"}
          </td>
        </tr>
      `
        )
        .join("");
    } else {
      productListHTML = `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 16px; font-weight: 700; color: #0f172a; font-size: 14px;">
            ${productName || "General Orthopedic Catalog Inquiry"}
          </td>
          <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #014E9E; font-size: 14px;">
            ${quantity || "Standard Bulk"}
          </td>
        </tr>
      `;
    }

    // -------------------------------------------------------------
    // TEMPLATE 1: Customer Confirmation Email (Medical Luxury)
    // -------------------------------------------------------------
    const customerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation - PlastoKast</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <div style="max-width: 620px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 35px rgba(1, 78, 158, 0.08); border: 1px solid #e2e8f0;">
    
    <!-- Top Brand Header -->
    <div style="background: linear-gradient(135deg, #014E9E 0%, #002d5e 100%); padding: 32px 36px; text-align: center;">
      <div style="display: inline-block; background: #ffffff; padding: 10px 20px; border-radius: 12px; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <span style="font-size: 22px; font-weight: 900; color: #014E9E; letter-spacing: -0.5px;">Plasto<span style="color: #0091ff;">Kast</span>™</span>
      </div>
      <h1 style="margin: 0 0 6px 0; color: #ffffff; font-size: 21px; font-weight: 800; letter-spacing: -0.3px;">Inquiry Received Successfully</h1>
      <p style="margin: 0; color: #bae6fd; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
        ISO 13485:2016 Certified &bull; WHO-GMP Registered Medical Manufacturer
      </p>
    </div>

    <!-- Status Banner -->
    <div style="background-color: #f0fdf4; border-bottom: 1px solid #bbf7d0; padding: 14px 36px; display: flex; align-items: center; justify-content: space-between;">
      <span style="color: #166534; font-weight: 700; font-size: 13px;">✓ Lead Reference: <strong>#${inquiryId}</strong></span>
      <span style="color: #166534; font-size: 12px; font-weight: 600;">${formattedDate}</span>
    </div>

    <!-- Main Content Body -->
    <div style="padding: 32px 36px;">
      <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin: 0 0 16px 0;">
        Dear <strong>${name}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        Thank you for contacting <strong>PlastoKast™ Inc.</strong> Our medical export desk and technical sales division have received your product inquiry. One of our regional export managers will get in touch with you shortly with our official quotation and product specifications.
      </p>

      <!-- Products Summary Table Card -->
      <div style="background-color: #f8fafc; border-radius: 14px; border: 1.5px solid #e2e8f0; overflow: hidden; margin-bottom: 26px;">
        <div style="background-color: #014E9E; color: #ffffff; padding: 10px 16px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
          Requested Products & Specifications
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 10px 16px; font-size: 12px; font-weight: 700; color: #475569;">Item Name</th>
              <th style="padding: 10px 16px; font-size: 12px; font-weight: 700; color: #475569; text-align: right;">Quantity / Requirement</th>
            </tr>
          </thead>
          <tbody>
            ${productListHTML}
          </tbody>
        </table>
        ${
          notes
            ? `
        <div style="padding: 12px 16px; background-color: #ffffff; border-top: 1px solid #e2e8f0; font-size: 13px; color: #475569;">
          <strong style="color: #0f172a;">Your Message/Notes:</strong> ${notes}
        </div>
        `
            : ""
        }
      </div>

      <!-- Quick Action: Direct WhatsApp Chat -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1.5px solid #86efac; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 28px;">
        <h3 style="margin: 0 0 6px 0; color: #166534; font-size: 16px; font-weight: 800;">Need an Instant Quote or Catalog?</h3>
        <p style="margin: 0 0 14px 0; color: #15803d; font-size: 13px;">Chat directly with our direct WhatsApp sales helpline on <strong>+91 89053 32576</strong></p>
        <a href="https://api.whatsapp.com/send?phone=918905332576&text=Hi%20PlastoKast,%20I%20have%20submitted%20an%20inquiry%20(Ref:%20${inquiryId})%20for%20medical%20products." 
           style="display: inline-block; background-color: #25d366; color: #ffffff; font-weight: 800; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 50px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
          💬 Chat on WhatsApp (+91 89053 32576)
        </a>
      </div>

      <!-- Company Footer Info -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; line-height: 1.6;">
        <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">PlastoKast™ Inc. • Connect Bones™</p>
        <p style="margin: 0 0 4px 0;"><strong>Factory & Export House:</strong> Ground Floor, Om Shree Sadguru Nityanand Co-op Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India</p>
        <p style="margin: 0 0 4px 0;"><strong>Direct Helplines:</strong> +91 99094 12068 | +91 89053 32576 &bull; <strong>Sales Email:</strong> plastokast.sales@gmail.com</p>
        <p style="margin: 0;"><strong>Web:</strong> <a href="https://www.plastokast.com" style="color: #014E9E; text-decoration: none; font-weight: 600;">www.plastokast.com</a></p>
      </div>

    </div>
  </div>
</body>
</html>
`;

    // -------------------------------------------------------------
    // TEMPLATE 2: Admin Lead Alert Email (Sent to ankitdobariya34@gmail.com)
    // -------------------------------------------------------------
    const adminHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 New Lead Alert - PlastoKast</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <div style="max-width: 620px; margin: 30px auto; background-color: #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4); border: 1.5px solid #334155;">
    
    <!-- Top Alert Header -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 26px 32px; text-align: center;">
      <span style="background: rgba(0, 0, 0, 0.25); color: #fee2e2; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 8px;">
        High Priority Buyer Lead
      </span>
      <h1 style="margin: 0 0 4px 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: -0.3px;">🚨 New Lead Alert: #${inquiryId}</h1>
      <p style="margin: 0; color: #fecaca; font-size: 13px; font-weight: 600;">Received on ${formattedDate} via PlastoKast Website</p>
    </div>

    <div style="padding: 28px 32px;">
      
      <!-- Buyer Dossier Card -->
      <div style="background-color: #0f172a; border-radius: 14px; border: 1px solid #334155; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; color: #38bdf8; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
          👤 Customer Dossier
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #94a3b8; width: 140px; font-weight: 600;">Buyer Name:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 700; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Country / Region:</td>
            <td style="padding: 6px 0; color: #fef08a; font-weight: 700;">📍 ${country}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Buyer Email:</td>
            <td style="padding: 6px 0; color: #38bdf8; font-weight: 700;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email || "Not provided"}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Phone / WhatsApp:</td>
            <td style="padding: 6px 0; color: #4ade80; font-weight: 700;"><a href="tel:${phone}" style="color: #4ade80; text-decoration: none;">${phone || "Not provided"}</a></td>
          </tr>
        </table>
      </div>

      <!-- Inquired Products -->
      <div style="background-color: #0f172a; border-radius: 14px; border: 1px solid #334155; overflow: hidden; margin-bottom: 24px;">
        <div style="background-color: #1e293b; color: #e2e8f0; padding: 10px 16px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          📦 Requested Medical Products
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <tbody>
            ${productListHTML.replace(/#0f172a/g, "#ffffff").replace(/#014E9E/g, "#38bdf8").replace(/#e2e8f0/g, "#334155")}
          </tbody>
        </table>
        ${
          notes
            ? `
        <div style="padding: 12px 16px; background-color: #1e293b; border-top: 1px solid #334155; font-size: 13px; color: #cbd5e1;">
          <strong style="color: #fef08a;">Customer Notes:</strong> ${notes}
        </div>
        `
            : ""
        }
      </div>

      <!-- 1-Click Action Buttons for Admin -->
      <div style="display: flex; gap: 12px; margin-bottom: 24px;">
        ${
          phone
            ? `
        <a href="https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, "")}&text=Hi%20${encodeURIComponent(
                name
              )},%20thank%20you%20for%20contacting%20PlastoKast%20regarding%20your%20inquiry%20(#${inquiryId})." 
           style="display: block; width: 100%; text-align: center; background-color: #25d366; color: #ffffff; font-weight: 800; font-size: 14px; text-decoration: none; padding: 12px 18px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
          💬 WhatsApp Buyer
        </a>
        `
            : ""
        }
        <a href="https://www.plastokast.com/admin.html" 
           style="display: block; width: 100%; text-align: center; background-color: #014E9E; color: #ffffff; font-weight: 800; font-size: 14px; text-decoration: none; padding: 12px 18px; border-radius: 12px;">
          📊 Open CRM Panel
        </a>
      </div>

      <!-- Footer Note -->
      <p style="margin: 0; text-align: center; font-size: 11px; color: #64748b;">
        PlastoKast™ CRM Autonomous Notification Engine &bull; Hostinger Verified
      </p>

    </div>
  </div>
</body>
</html>
`;

    async function sendViaResend(toAddr, subject, htmlContent, isCustomer = false) {
      // Primary sender using verified domain
      const primaryFrom = isCustomer 
        ? "PlastoKast™ Medical <inquiry@plastokast.com>" 
        : "PlastoKast Alerts <inquiry@plastokast.com>";
      
      try {
        let res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: primaryFrom,
            reply_to: "plastokast.sales@gmail.com",
            to: Array.isArray(toAddr) ? toAddr : [toAddr],
            subject: subject,
            html: htmlContent
          })
        });
        let resJson = await res.json();
        
        // If domain is still pending verification in Resend, fall back to onboarding@resend.dev
        if (resJson && resJson.name === "validation_error" && resJson.statusCode === 403) {
          const fallbackFrom = "PlastoKast Medical <onboarding@resend.dev>";
          const fallbackRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: fallbackFrom,
              to: Array.isArray(toAddr) ? toAddr : [toAddr],
              subject: subject,
              html: htmlContent
            })
          });
          resJson = await fallbackRes.json();
        }
        return resJson;
      } catch(e) {
        return { error: e.message };
      }
    }

    // -------------------------------------------------------------
    // Parallel Resend Dispatch
    // -------------------------------------------------------------
    const dispatches = [];

    // 1. Dispatch to Admin (Dynamic from Admin Panel or default)
    const adminRecipient = adminEmail && adminEmail.includes("@") ? adminEmail : ADMIN_EMAIL;
    dispatches.push(
      sendViaResend(
        adminRecipient,
        `🚨 NEW LEAD [#${inquiryId}]: ${name} (${country}) - ${productName || "Product Inquiry"}`,
        adminHTML,
        false
      )
    );

    // 2. Dispatch to Customer (If customer provided an email address)
    if (email && email.includes("@")) {
      dispatches.push(
        sendViaResend(
          email,
          `Inquiry Received: PlastoKast™ Medical Products [#${inquiryId}]`,
          customerHTML,
          true
        )
      );
    }

    const results = await Promise.all(dispatches);

    return res.status(200).json({
      success: true,
      message: "Emails dispatched via Resend",
      inquiryId,
      results: results
    });
  } catch (err) {
    console.error("Resend Dispatch Error:", err);
    return res.status(500).json({
      error: "Internal Server Error during email dispatch",
      details: err.message
    });
  }
}
