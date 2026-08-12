# NZ Sings Bollywood – 90s with 90 — Product Requirements Document

## Original Problem Statement
Build a premium, high-end, mobile-first event website for **NZ Sings Bollywood – 90s with 90** (nzsingsbollywood.com): a world-first multi-ethnic Bollywood choir concert with 90 performers, live symphony orchestra, contemporary band and professional choir, celebrating 75 years of India–New Zealand friendship. Event: 27 February 2027, 7:00 PM, Victory Convention Centre, 98 Beaumont Street, Auckland 1010. Cinematic dark/gold premium design, strong BUY TICKETS conversion (TryBooking URL TBD), config-driven content, partner/supporter visibility, SEO + accessibility, sponsor/media/government worthy.

## User Personas
- Ticket buyers (Bollywood music fans, Indian diaspora, wider NZ audiences)
- Sponsors & partners (corporates evaluating brand association)
- Media & government/cultural stakeholders (75-years diplomatic angle)
- Organising team (needs easy content/ticket-URL updates via config)

## Architecture
- Frontend-only React 19 SPA (CRA + craco), Tailwind CSS, Framer Motion 11, Lenis smooth scroll, shadcn/ui accordion. Backend FastAPI + MongoDB retained but unused by the site (contact form is mailto-only per user choice).
- Central config: `/app/frontend/src/config/` — `site.js` (TICKET_URL, CONTACT_EMAIL, event details), `navigation.js`, `social.js`, `partners.js` (organisers/partners/supporters/charity), `team.js`, `faq.js`, `news.js`, `index.js` barrel.
- Components: Header, Hero (+CountdownTimer, Marquee), InitiativeBy, TheShow, NinetyWithNinety, SeventyFiveYears, TicketsCTA (x2), PartnersSupporters, TeamBehindEvent, NewsStories, FAQ, Contact, Footer, shared Reveal/TicketButton/ChapterHeading.
- Brand assets in `/app/frontend/public/assets/` (brand-title.png, brand-title-header.png, og-image.jpg, favicon.png) derived from uploaded title art.
- SEO: title/meta/keywords/OG/Twitter/JSON-LD MusicEvent in `public/index.html`.

## Implemented (12 Aug 2026)
- Full single-page premium site: kinetic hero (masked line-by-line reveal, blur-in brand title, parallax giant "90", twinkling particles, live countdown to 27 Feb 2027 7:00 PM NZDT), 7 highlight cards, editorial marquee strips (dark + gold), white "An initiative by" band, The Show split editorial, 90s-with-90 stats bento + Lavine Da Costa credit + Ashish Ramakrishnan quote, 75 Years chapter with parallax "75" + India–Aotearoa connection motif, Partners & Supporters grouped by category on white cards, gold Tickets conversion blocks (x2), Team cards with gold monogram placeholders, News & Stories editorial placeholders, FAQ accordion, mailto contact form (all fields + enquiry type), full footer.
- Numbered manifesto chapters 01–08, Lenis momentum scroll with anchor offset, reduced-motion support, data-testids throughout.
- Contact form: mailto-only per user decision (opens email app pre-filled to nzsingsbollywood@gmail.com).
- Verified: desktop + mobile screenshots of all sections, countdown ticking, mobile hamburger menu, no console errors.

## Core Requirements (static)
- Exact event name/date/time/venue; TryBooking placeholder via single `TICKET_URL` constant; BUY TICKETS always strongest CTA; social links as "#" placeholders until supplied; no invented prices/sponsor URLs/bios.

## Backlog (prioritized)
- P0: Swap `TICKET_URL` in `src/config/site.js` when TryBooking link arrives; upload partner/organiser logos + team photos (drop into config `logo`/`photo` fields); set real Instagram/Facebook URLs in `social.js`.
- P1: Landscape/portrait event posters for hero/social sections (user to upload); real News & Stories content.
- P2 (from requirements doc, not yet requested): media centre, VIP packages, email/SMS notifications, merchandise/donations, analytics dashboard, charity/Sistema Aotearoa dedicated section.

## Next Tasks
1. Integrate TryBooking URL (one-line config change).
2. Place uploaded logos/photos into config.
3. Replace News placeholders with real stories.
4. Optional: move contact form to managed email (Resend) if direct delivery is later wanted.
