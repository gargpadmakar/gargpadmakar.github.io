# SMTP contact backend

GitHub Pages is static, so mail is sent by this serverless function (e.g. deployed to Vercel/Netlify).

## Configuration
Default / fallback config is set to Mailtrap sandbox for safe testing:
- **Host:** `sandbox.smtp.mailtrap.io`
- **Port:** `2525`
- **User:** `be36294cfdac6f`
- **Pass:** `f6678a44e67d4d`
- **Mail To:** `pgdev1811@gmail.com`

For production, override these variables in your deployment dashboard (e.g. Vercel / Netlify):
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, `ALLOWED_ORIGIN`

## Testing locally
```bash
cd smtp-backend
npm install
node test-mailtrap.js
```
