# SMTP contact backend

GitHub Pages is static, so mail is sent by this small serverless function (Vercel/Netlify).

1. Deploy the `smtp-backend/` folder as a project (root directory = `smtp-backend`).
2. Set env vars in the host dashboard (never commit them):
   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, `ALLOWED_ORIGIN=https://gargpadmakar.github.io`
   (Gmail: use an App Password, host `smtp.gmail.com`, port `465`.)
3. Put the deployed URL (`https://<project>.vercel.app/api/contact`) in `SMTP_ENDPOINT` in `blog/index.html`.
