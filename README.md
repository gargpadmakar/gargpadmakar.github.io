# gargpadmakar.github.io

Source code for [gargpadmakar.github.io](https://gargpadmakar.github.io), the personal portfolio, engineering showcase, and technical blog of Padmakar Garg.

The site is built as a lightweight, high-performance static website hosted on GitHub Pages, backed by a serverless contact form handler deployed on Vercel.

---

## Architecture & Structure

```
gargpadmakar.github.io/
├── index.html              # Main portfolio (profile, experience, skills, projects)
├── blog/
│   └── index.html          # Technical articles, architecture breakdowns, and contact form
├── smtp-backend/
│   ├── api/
│   │   └── contact.js      # Serverless function for contact form (Nodemailer / Gmail SMTP)
│   ├── package.json
│   └── README.md
├── css/                    # Core styles, layout rules, and component themes
├── js/                     # Client-side scripts, gallery init, and interactive handlers
├── img/                    # Static assets, project screenshots, and profile imagery
└── sitemap.xml             # Search engine indexing configuration
```

---

## Technical Highlights

- **Static Frontend:** Pure HTML5, CSS3, and JavaScript with zero heavy framework overhead, ensuring fast first-contentful-paint (FCP) and low runtime memory usage.
- **Responsive Layout:** Adaptive design supporting desktop, tablet, and mobile displays with accessible navigation and smooth section routing.
- **Serverless Contact Form:**
  - Endpoint hosted at `/api/contact` on Vercel.
  - Nodemailer transport wired to Gmail SMTP with custom HTML notification formatting.
  - Built-in honeypot bot prevention and automated fallback to FormSubmit to guarantee zero message drop.

---

## Local Development

To run and preview the site locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gargpadmakar/gargpadmakar.github.io.git
   cd gargpadmakar.github.io
   ```

2. **Serve the static site:**
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   Or using Node (`serve` / `http-server`):
   ```bash
   npx serve .
   ```
   Open `http://localhost:8000` in your browser.

3. **Running the SMTP Backend locally:**
   ```bash
   cd smtp-backend
   npm install
   ```

---

## Deployment

- **Frontend:** Automatically built and served via GitHub Pages on pushes to the `main` branch.
- **Backend Function:** Automatically deployed to Vercel from the `smtp-backend` root directory on pushes to `main`.

---

## About the Author

**Padmakar Garg**  
Senior Android Developer specializing in Kotlin, Jetpack Compose, Android System Design, Kotlin Multiplatform (KMP), and Mobile Security (RASP, MTProto, WebRTC).

- **Website:** [gargpadmakar.github.io](https://gargpadmakar.github.io)
- **LinkedIn:** [linkedin.com/in/padmakar-garg](https://linkedin.com/in/padmakar-garg)
- **GitHub:** [github.com/gargpadmakar](https://github.com/gargpadmakar)
- **Articles:** [medium.com/@worldpadmakar007](https://medium.com/@worldpadmakar007) | [dev.to/gargpadmakar](https://dev.to/gargpadmakar)
