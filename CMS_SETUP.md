# CMS setup and local testing

The CMS uses Supabase project `lyclaplowwxocbuuigyu`. Its browser publishable key is not a secret; RLS authorises only administrator UID `b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab`.

1. Merge these files into matching project paths.
2. In `frontend`, optionally copy `.env.example` to `.env`.
3. Run `npm install` and `npm start`.
4. Open `http://localhost:3000/admin` and use the existing administrator login. No signup flow is present.
5. Upload images (JPEG/PNG/WebP/GIF, maximum 5 MB), paste the copied URL into the relevant field, then validate and publish.

The public site reads the published `site` document and falls back to bundled config/assets on any Supabase failure. `textOverrides` maps exact visible text to replacement text. `imageOverrides` maps an original path (for example `/assets/brand-title.png`) to an uploaded public URL.

For deployment, configure an SPA rewrite so `/admin` and every other non-file route serves `/index.html` (for example Netlify: `/* /index.html 200`; Vercel: rewrite `/(.*)` to `/index.html`). Never place a service-role or secret key in frontend variables.
