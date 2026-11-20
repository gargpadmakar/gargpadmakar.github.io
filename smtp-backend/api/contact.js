// Vercel / Netlify-style serverless function: POST /api/contact
// Needs: npm i nodemailer
// Env vars (set in the host's dashboard, NEVER in the repo):
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=465
//   SMTP_USER=worldpadmakar007@gmail.com
//   SMTP_PASS=<Gmail App Password>
//   MAIL_TO=worldpadmakar007@gmail.com
//   ALLOWED_ORIGIN=https://gargpadmakar.github.io

const nodemailer = require("nodemailer");

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "https://gargpadmakar.github.io");
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

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.MAIL_TO) {
    console.error("Missing SMTP env vars (SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO)");
    return res.status(500).json({ ok: false, error: "Server not configured" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Blog Contact" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: `"${name.replace(/["\r\n]/g, "")}" <${email}>`,
      subject: `New message from ${name.replace(/[\r\n]/g, " ")}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Could not send email" });
  }
};
