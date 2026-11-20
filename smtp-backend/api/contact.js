// Vercel / Netlify-style serverless function: POST /api/contact
// Needs: npm i nodemailer
// Configured with Gmail SMTP & pgdev1811@gmail.com

const nodemailer = require("nodemailer");

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { name = "", email = "", message = "", website = "" } = req.body || {};

  // Honeypot: bots fill the hidden "website" field
  if (website) return res.status(200).json({ ok: true });

  if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.trim().length < 5) {
    return res.status(400).json({ ok: false, error: "Invalid input" });
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
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

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${user}>`,
      to: mailTo,
      replyTo: `"${name.replace(/["\r\n]/g, "")}" <${email}>`,
      subject: `New message from ${name.replace(/[\r\n]/g, " ")} (${email})`,
      text: `You received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<h3>New message from portfolio contact form</h3><p><b>Name:</b> ${esc(name)}<br><b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p><p><b>Message:</b></p><p style="white-space: pre-wrap; background: #f4f4f4; padding: 12px; border-radius: 4px; color: #111;">${esc(message)}</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending mail:", err);
    return res.status(500).json({ ok: false, error: "Could not send email" });
  }
};
