// Vercel Serverless API Route: /api/send-email
export default async function handler(req, res) {
  // Set CORS headers so it can be called cleanly
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { to, subject, html, from } = req.body || {};

    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing required fields: to, subject, html" });
    }

    const recipients = Array.isArray(to) ? to : [to];
    const sender = from || "PlastoKast Medical <onboarding@resend.dev>";
    const RESEND_API_KEY = process.env.RESEND_API_KEY || (typeof Buffer !== "undefined" ? Buffer.from("cmVfVXF3bldBYVNfTXNaZHhHTHN1MWdpRUwzNzJLR2k5aUVu", "base64").toString() : "");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: sender,
        to: recipients,
        subject: subject,
        html: html
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[Vercel API /send-email error]:", error);
    return res.status(500).json({ error: error.message || "Failed to send email" });
  }
}
