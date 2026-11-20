// Vercel / Netlify-style serverless function: POST /api/contact
// Needs: npm i nodemailer
// Configured with Gmail SMTP & pgdev1811@gmail.com

const nodemailer = require("nodemailer");

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { name = "", email = "", message = "", website = "" } = req.body || {};

  // Honeypot: bots fill the hidden "website" field
  if (website) return res.status(200).json({ ok: true });

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedMessage.length < 5) {
    return res.status(400).json({ ok: false, error: "Invalid input" });
  }
  if (trimmedName.length > 100 || trimmedEmail.length > 200 || trimmedMessage.length > 5000) {
    return res.status(400).json({ ok: false, error: "Input too long" });
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || "pgdev1811@gmail.com";
  const pass = process.env.SMTP_PASS || "xhwteongdfldcnlz";
  const mailTo = process.env.MAIL_TO || "pgdev1811@gmail.com";

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465,
    auth: { user: user, pass: pass },
  });

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }) + " IST";

  const initial = (trimmedName.charAt(0) || "U").toUpperCase();
  const safeName = esc(trimmedName);
  const safeEmail = esc(trimmedEmail);
  const safeMessage = esc(trimmedMessage).replace(/\n/g, "<br>");
  const replySubject = encodeURIComponent(`Re: Your message to Padmakar Garg`);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message from ${safeName}</title>
</head>
<body style="margin:0;padding:0;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#1e293b;">
  <!-- Email Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b0f19;padding:40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 20px 45px rgba(0,0,0,0.35);border:1px solid #1e293b;">
          
          <!-- Top Gradient Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%);padding:6px 0;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:32px 36px 28px;border-bottom:1px solid #1e293b;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.35);border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;color:#a5b4fc;text-transform:uppercase;margin-bottom:12px;">
                      ⚡ New Portfolio Message
                    </div>
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#f8fafc;letter-spacing:-0.4px;line-height:1.3;">
                      Padmakar Garg <span style="font-size:15px;color:#94a3b8;font-weight:400;">/ Contact Inquiry</span>
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:36px;background-color:#ffffff;">
              
              <!-- Sender Info Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;border-radius:14px;padding:20px 22px;border:1px solid #e2e8f0;margin-bottom:28px;">
                <tr>
                  <td width="52" valign="middle">
                    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;font-size:20px;font-weight:700;line-height:48px;text-align:center;box-shadow:0 4px 10px rgba(99,102,241,0.3);">
                      ${initial}
                    </div>
                  </td>
                  <td style="padding-left:16px;" valign="middle">
                    <div style="font-size:17px;font-weight:700;color:#0f172a;line-height:1.3;">
                      ${safeName}
                    </div>
                    <div style="font-size:14px;color:#64748b;margin-top:3px;">
                      <a href="mailto:${safeEmail}" style="color:#6366f1;text-decoration:none;font-weight:500;">${safeEmail}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Section Title: Message -->
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#64748b;margin-bottom:12px;">
                User Message
              </div>

              <!-- Message Quote Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-left:4px solid #6366f1;border-radius:6px;box-shadow:inset 0 0 0 1px #e2e8f0;margin-bottom:32px;">
                <tr>
                  <td style="padding:22px 24px;font-size:15px;line-height:1.75;color:#1e293b;word-break:break-word;">
                    ${safeMessage}
                  </td>
                </tr>
              </table>

              <!-- Action Button: Reply -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=${replySubject}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 34px;border-radius:10px;box-shadow:0 8px 18px rgba(99,102,241,0.35);letter-spacing:0.2px;">
                      ✉️ Reply to ${safeName}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Meta Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:34px;border-top:1px dashed #e2e8f0;padding-top:20px;">
                <tr>
                  <td style="font-size:12px;color:#94a3b8;line-height:1.6;">
                    <strong>Source:</strong> gargpadmakar.github.io<br>
                    <strong>Timestamp:</strong> ${formattedDate}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0f172a;padding:24px 36px;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
                Padmakar Garg • Senior Android Developer & Tech Lead
              </p>
              <p style="margin:0;font-size:12px;color:#64748b;">
                <a href="https://gargpadmakar.github.io" style="color:#a5b4fc;text-decoration:none;">Portfolio</a> &nbsp;•&nbsp; 
                <a href="https://linkedin.com/in/padmakar-garg" style="color:#a5b4fc;text-decoration:none;">LinkedIn</a> &nbsp;•&nbsp; 
                <a href="https://github.com/gargpadmakar" style="color:#a5b4fc;text-decoration:none;">GitHub</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    await transporter.sendMail({
      from: `"Padmakar Portfolio" <${user}>`,
      to: mailTo,
      replyTo: `"${trimmedName.replace(/["\r\n]/g, "")}" <${trimmedEmail}>`,
      subject: `⚡ New Message from ${trimmedName} — Portfolio Contact`,
      text: `New Portfolio Inquiry\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\nDate: ${formattedDate}\n\nMessage:\n${trimmedMessage}\n\n---\nDelivered to ${mailTo} via gargpadmakar.github.io`,
      html: htmlContent,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending mail:", err);
    return res.status(500).json({ ok: false, error: "Could not send email" });
  }
};
