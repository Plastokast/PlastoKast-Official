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

    // Ensure all products are unpacked and listed row-by-row
    let finalProducts = Array.isArray(products) && products.length > 0 ? [...products] : [];

    // Fallback: If products array is empty or only 1 item with "+ more", parse from notes or message
    const rawCheck = `${notes} ${data.message || ""} ${productName}`;
    if (finalProducts.length <= 1 && rawCheck.includes("PRODUCTS REQUESTED")) {
      const rawText = data.message || notes || "";
      const lines = rawText.split("\n");
      const parsedItems = [];
      for (const line of lines) {
        // Match numbered list: "1. PK Cast Graphics (Fiberglass Bandage) [PK-CG-002] (Casting Tapes)"
        const m = line.match(/^\s*\d+\.\s*(.*?)(?:\s*\[(.*?)\])?(?:\s*\((.*?)\))?$/);
        if (m && m[1]) {
          parsedItems.push({
            name: m[1].trim(),
            code: m[2] ? m[2].trim() : "",
            qty: quantity || "Standard Bulk"
          });
        }
      }
      if (parsedItems.length > 0) {
        finalProducts = parsedItems;
      }
    }

    // Format products list
    let productListHTML = "";
    if (finalProducts && finalProducts.length > 0) {
      productListHTML = finalProducts
        .map(
          (p, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 18px; font-weight: 700; color: #0f172a; font-size: 14px;">
            ${p.name || p.title || "PlastoKast Orthopedic Product"}
            ${p.code ? `<span style="font-size: 12px; color: #64748b; font-weight: 600; display: block; margin-top: 2px;">Item Code: <strong style="color: #014E9E;">${p.code}</strong></span>` : ""}
          </td>
          <td style="padding: 12px 18px; text-align: right; font-weight: 800; color: #014E9E; font-size: 14px;">
            ${p.qty || p.quantity || quantity || "Standard Bulk"}
          </td>
        </tr>
      `
        )
        .join("");
    } else {
      productListHTML = `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 18px; font-weight: 700; color: #0f172a; font-size: 14px;">
            ${productName || "General Orthopedic Catalog Inquiry"}
          </td>
          <td style="padding: 12px 18px; text-align: right; font-weight: 800; color: #014E9E; font-size: 14px;">
            ${quantity || "Standard Bulk"}
          </td>
        </tr>
      `;
    }

    // Clean notes (strip any legacy fullMessage artifacts)
    let cleanNotes = notes || "";
    if (cleanNotes.includes("PRODUCTS REQUESTED")) {
      const match = cleanNotes.match(/Customer Notes:\s*(.*)$/i);
      cleanNotes = match && match[1] && match[1].trim() !== "None" ? match[1].trim() : "";
    }

    // -------------------------------------------------------------
    // TEMPLATE 1: Customer Confirmation Email (Extended Luxury Corporate Design)
    // -------------------------------------------------------------
    const customerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation - PlastoKast</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 640px; margin: 30px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 16px 45px rgba(1, 78, 158, 0.09); border: 1px solid #e2e8f0;">
    
    <!-- Top Brand Header with HD Logo -->
    <div style="background: linear-gradient(135deg, #014E9E 0%, #002752 100%); padding: 36px 32px 32px 32px; text-align: center; border-bottom: 3px solid #0091ff;">
      
      <!-- HD Logo White Capsule Container -->
      <div style="display: inline-block; background: #ffffff; padding: 14px 28px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.18); text-align: center;">
        <img src="https://www.plastokast.com/assets/images/logo.png" 
             alt="PlastoKast" 
             width="180" 
             style="display: block; width: 180px; max-width: 100%; height: auto; margin: 0 auto; border: 0;" />
      </div>

      <h1 style="margin: 0 0 6px 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.3px;">Inquiry Received Successfully</h1>
      <p style="margin: 0 0 12px 0; color: #bae6fd; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;">
        Connect Bones™ &bull; Precision Orthopedic Immobilization Systems
      </p>

      <!-- Trust Badges Pill -->
      <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.25); padding: 5px 16px; border-radius: 50px;">
        <span style="color: #fef08a; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
          ★ ISO 13485:2016 Certified &bull; WHO-GMP Registered &bull; CDSCO Compliant
        </span>
      </div>
    </div>

    <!-- Status Ribbon -->
    <div style="background-color: #f0fdf4; border-bottom: 1px solid #bbf7d0; padding: 12px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
      <span style="color: #166534; font-weight: 800; font-size: 13px;">
        ✓ Lead Reference: <strong>#${inquiryId}</strong>
      </span>
      <span style="color: #15803d; font-size: 12px; font-weight: 600;">
        📅 ${formattedDate}
      </span>
    </div>

    <!-- Main Content Body -->
    <div style="padding: 32px 32px 24px 32px;">
      
      <!-- Greeting Section -->
      <p style="font-size: 17px; line-height: 1.5; color: #0f172a; margin: 0 0 14px 0; font-weight: 700;">
        Dear ${name},
      </p>
      <p style="font-size: 14px; line-height: 1.7; color: #475569; margin: 0 0 24px 0;">
        Thank you for contacting <strong>PlastoKast™ Inc.</strong> Our medical export desk and technical sales division have received your product inquiry. One of our regional export managers is reviewing your specifications and will connect with you shortly with our official commercial quotation and product catalog.
      </p>

      <!-- Products Summary Card -->
      <div style="background-color: #f8fafc; border-radius: 16px; border: 1.5px solid #e2e8f0; overflow: hidden; margin-bottom: 28px; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
        <div style="background: linear-gradient(135deg, #014E9E 0%, #0284c7 100%); color: #ffffff; padding: 12px 18px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
          📦 Requested Products & Specifications
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 10px 18px; font-size: 12px; font-weight: 700; color: #475569;">Item Description</th>
              <th style="padding: 10px 18px; font-size: 12px; font-weight: 700; color: #475569; text-align: right;">Quantity / Units</th>
            </tr>
          </thead>
          <tbody>
            ${productListHTML}
          </tbody>
        </table>
        ${
          cleanNotes
            ? `
        <div style="padding: 14px 18px; background-color: #ffffff; border-top: 1px solid #e2e8f0; font-size: 13px; color: #334155; line-height: 1.6;">
          <strong style="color: #014E9E; display: block; margin-bottom: 2px;">Your Special Notes / Requirement:</strong>
          <span style="color: #475569;">"${cleanNotes}"</span>
        </div>
        `
            : ""
        }
      </div>

      <!-- Priority WhatsApp Assistance Callout -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1.5px solid #86efac; border-radius: 18px; padding: 22px 24px; text-align: center; margin-bottom: 32px; box-shadow: 0 6px 18px rgba(34, 197, 94, 0.12);">
        <h3 style="margin: 0 0 6px 0; color: #166534; font-size: 17px; font-weight: 800;">Need an Instant Quote or Urgent Export Sample?</h3>
        <p style="margin: 0 0 16px 0; color: #15803d; font-size: 13.5px; line-height: 1.5;">
          Connect directly with our 24/7 International Sales Desk on WhatsApp:
        </p>
        <a href="https://api.whatsapp.com/send?phone=918905332576&text=Hi%20PlastoKast,%20I%20have%20submitted%20an%20inquiry%20(Ref:%20${inquiryId})%20for%20medical%20products." 
           style="display: inline-block; background-color: #25d366; color: #ffffff; font-weight: 800; font-size: 14px; text-decoration: none; padding: 13px 30px; border-radius: 50px; box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4); text-transform: uppercase; letter-spacing: 0.4px;">
          💬 Chat on WhatsApp (+91 89053 32576)
        </a>
      </div>

      <!-- Classy "Why Healthcare Providers Choose PlastoKast" Section -->
      <div style="border-top: 1.5px solid #e2e8f0; padding-top: 28px; margin-bottom: 30px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: 800; color: #014E9E; text-transform: uppercase; letter-spacing: 1px; background: #e0f2fe; padding: 4px 12px; border-radius: 50px;">
            The PlastoKast™ Advantage
          </span>
          <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 8px 0 0 0;">
            Why Global Surgeons & Hospitals Trust Us
          </h2>
        </div>

        <!-- 4 Pillars Grid / Rows -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
          <tr>
            <td style="background: #f8fafc; padding: 14px 16px; border-radius: 14px; border: 1px solid #e2e8f0; vertical-align: top;">
              <div style="font-weight: 800; color: #014E9E; font-size: 13.5px; margin-bottom: 3px;">
                🛡️ Certified Medical Manufacturing
              </div>
              <div style="font-size: 12.5px; color: #64748b; line-height: 1.5;">
                Fully certified under ISO 13485:2016, WHO-GMP, and CDSCO registered for clinical excellence.
              </div>
            </td>
          </tr>
          <tr>
            <td style="background: #f8fafc; padding: 14px 16px; border-radius: 14px; border: 1px solid #e2e8f0; vertical-align: top;">
              <div style="font-weight: 800; color: #014E9E; font-size: 13.5px; margin-bottom: 3px;">
                🔬 High-Grade Orthopedic Polymers
              </div>
              <div style="font-size: 12.5px; color: #64748b; line-height: 1.5;">
                Engineered with high weight-to-strength ratio, water-resistant fiberglass & polyester casting tapes.
              </div>
            </td>
          </tr>
          <tr>
            <td style="background: #f8fafc; padding: 14px 16px; border-radius: 14px; border: 1px solid #e2e8f0; vertical-align: top;">
              <div style="font-weight: 800; color: #014E9E; font-size: 13.5px; margin-bottom: 3px;">
                🌍 Worldwide Hospital & Export Reach
              </div>
              <div style="font-size: 12.5px; color: #64748b; line-height: 1.5;">
                Supplying orthopedic trauma centers, government tenders, and distributors across 40+ nations.
              </div>
            </td>
          </tr>
          <tr>
            <td style="background: #f8fafc; padding: 14px 16px; border-radius: 14px; border: 1px solid #e2e8f0; vertical-align: top;">
              <div style="font-weight: 800; color: #014E9E; font-size: 13.5px; margin-bottom: 3px;">
                📦 Custom OEM & Institutional Supply
              </div>
              <div style="font-size: 12.5px; color: #64748b; line-height: 1.5;">
                Flexible private labeling, custom dimensions, bulk container shipping, and direct factory pricing.
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Action: Catalog & Online Showcase Button -->
      <div style="background-color: #f1f5f9; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 28px;">
        <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #334155;">
          Want to explore our complete range of Orthopedic Casting & Splinting products?
        </p>
        <a href="https://www.plastokast.com/products.html" 
           style="display: inline-block; background-color: #014E9E; color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; padding: 10px 24px; border-radius: 10px; box-shadow: 0 4px 12px rgba(1, 78, 158, 0.25);">
          📄 View Full Product Catalog Online &rarr;
        </a>
      </div>

      <!-- Executive Footer -->
      <div style="border-top: 1.5px solid #e2e8f0; padding-top: 22px; font-size: 12px; color: #64748b; line-height: 1.6;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; padding-bottom: 12px;">
              <div style="font-size: 14px; font-weight: 800; color: #014E9E; margin-bottom: 2px;">PlastoKast™ Inc.</div>
              <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Connect Bones™</div>
              <div><strong>Plant & Export House:</strong> Ground Floor, Om Shree Sadguru Nityanand Co-op Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India</div>
              <div style="margin-top: 4px;"><strong>Direct Helplines:</strong> +91 99094 12068 &bull; +91 89053 32576</div>
              <div><strong>Sales Email:</strong> <a href="mailto:plastokast.sales@gmail.com" style="color: #014E9E; text-decoration: none; font-weight: 600;">plastokast.sales@gmail.com</a></div>
              <div><strong>Official Website:</strong> <a href="https://www.plastokast.com" style="color: #014E9E; text-decoration: none; font-weight: 700;">www.plastokast.com</a></div>
            </td>
          </tr>
        </table>
        
        <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 10px; text-align: center; font-size: 11px; color: #94a3b8;">
          &copy; 2026 PlastoKast™ Inc. All rights reserved. &bull; This is an automated commercial inquiry receipt.
        </div>
      </div>

    </div>
  </div>
</body>
</html>
`;

    // -------------------------------------------------------------
    // TEMPLATE 2: Admin Lead Alert Email (Emerald Green Luxury Executive Design)
    // -------------------------------------------------------------
    const adminHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 New Lead Alert - PlastoKast</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 640px; margin: 30px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 16px 45px rgba(5, 150, 105, 0.12); border: 1px solid #e2e8f0;">
    
    <!-- Top Executive Header with Emerald Green Gradient -->
    <div style="background: linear-gradient(135deg, #059669 0%, #064e3b 100%); padding: 36px 32px 30px 32px; text-align: center; border-bottom: 3px solid #10b981;">
      
      <!-- HD Logo White Capsule Container -->
      <div style="display: inline-block; background: #ffffff; padding: 14px 28px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.18); text-align: center;">
        <img src="https://www.plastokast.com/assets/images/logo.png" 
             alt="PlastoKast" 
             width="180" 
             style="display: block; width: 180px; max-width: 100%; height: auto; margin: 0 auto; border: 0;" />
      </div>

      <h1 style="margin: 0 0 6px 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.3px;">🚨 New Lead Alert Received</h1>
      <p style="margin: 0 0 12px 0; color: #a7f3d0; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;">
        PlastoKast™ Admin Real-Time Commercial Intelligence Engine
      </p>

      <!-- Priority Alert Tag -->
      <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 0, 0, 0.22); border: 1px solid rgba(255, 255, 255, 0.25); padding: 5px 16px; border-radius: 50px;">
        <span style="color: #fef08a; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
          ★ High-Priority Buyer Lead &bull; Direct Website Inquiry
        </span>
      </div>
    </div>

    <!-- Status Ribbon -->
    <div style="background-color: #ecfdf5; border-bottom: 1px solid #a7f3d0; padding: 12px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
      <span style="color: #065f46; font-weight: 800; font-size: 13px;">
        ✓ Lead Reference: <strong>#${inquiryId}</strong>
      </span>
      <span style="color: #047857; font-size: 12px; font-weight: 600;">
        📅 Received: ${formattedDate}
      </span>
    </div>

    <!-- Main Content Body -->
    <div style="padding: 30px 32px;">
      
      <!-- Buyer Dossier Card -->
      <div style="background-color: #f8fafc; border-radius: 16px; border: 1.5px solid #e2e8f0; padding: 22px; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
        <h3 style="margin: 0 0 14px 0; color: #047857; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 8px;">
          👤 Verified Buyer Dossier
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 7px 0; color: #64748b; width: 140px; font-weight: 600;">Buyer Name:</td>
            <td style="padding: 7px 0; color: #0f172a; font-weight: 800; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Country / Region:</td>
            <td style="padding: 7px 0; color: #047857; font-weight: 700;">📍 ${country}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Buyer Email:</td>
            <td style="padding: 7px 0; font-weight: 700;">
              ${email ? `<a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
            <td style="padding: 7px 0; font-weight: 700;">
              ${phone ? `<a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}
            </td>
          </tr>
        </table>
      </div>

      <!-- Inquired Products Card -->
      <div style="background-color: #f8fafc; border-radius: 16px; border: 1.5px solid #e2e8f0; overflow: hidden; margin-bottom: 26px; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
        <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: #ffffff; padding: 12px 18px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
          📦 Requested Medical Products & Quantities
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 10px 18px; font-size: 12px; font-weight: 700; color: #475569;">Item Description</th>
              <th style="padding: 10px 18px; font-size: 12px; font-weight: 700; color: #475569; text-align: right;">Quantity / Units</th>
            </tr>
          </thead>
          <tbody>
            ${productListHTML}
          </tbody>
        </table>
        ${
          cleanNotes
            ? `
        <div style="padding: 14px 18px; background-color: #ffffff; border-top: 1px solid #e2e8f0; font-size: 13px; color: #334155; line-height: 1.6;">
          <strong style="color: #059669; display: block; margin-bottom: 2px;">Customer Message / Special Requirements:</strong>
          <span style="color: #475569;">"${cleanNotes}"</span>
        </div>
        `
            : ""
        }
      </div>

      <!-- 1-Click Executive Action Center -->
      <div style="background-color: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 18px; padding: 20px; text-align: center; margin-bottom: 26px;">
        <h4 style="margin: 0 0 12px 0; color: #065f46; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          ⚡ Quick Lead Actions
        </h4>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          ${
            phone
              ? `
          <a href="https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, "")}&text=Hi%20${encodeURIComponent(
                  name
                )},%20thank%20you%20for%20contacting%20PlastoKast%20regarding%20your%20inquiry%20(#${inquiryId})." 
             style="display: inline-block; background-color: #25d366; color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; padding: 11px 22px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);">
            💬 WhatsApp Buyer
          </a>
          `
              : ""
          }
          ${
            email
              ? `
          <a href="mailto:${email}?subject=Official%20Quote:%20PlastoKast%20Orthopedic%20Products%20[#${inquiryId}]" 
             style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; padding: 11px 22px; border-radius: 10px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35);">
            ✉️ Email Buyer
          </a>
          `
              : ""
          }
          <a href="https://www.plastokast.com/admin.html" 
             style="display: inline-block; background-color: #014E9E; color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; padding: 11px 22px; border-radius: 10px; box-shadow: 0 4px 12px rgba(1, 78, 158, 0.3);">
            📊 Open CRM Panel
          </a>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
`;

    async function sendViaResend(toAddr, subject, htmlContent, isCustomer = false) {
      // Primary sender using verified domain
      const primaryFrom = isCustomer 
        ? "PlastoKast <inquiry@plastokast.com>" 
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
        
        // If domain fallback needed
        if (resJson && resJson.name === "validation_error" && resJson.statusCode === 403) {
          const fallbackFrom = "PlastoKast <onboarding@resend.dev>";
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
