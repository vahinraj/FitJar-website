# FitJar website

This is the standalone FitJar marketing and legal website. It uses static HTML, CSS, and JavaScript. The homepage opens with a scroll-driven brand reveal using the supplied FitJar mark and branding screen, followed by an interactive 3D body preview. Three.js loads from jsDelivr at runtime.

## Preview locally

From this folder, run `node scripts/preview.mjs` and open `http://127.0.0.1:4173`. Run `node scripts/check-site.mjs` to check JavaScript syntax, internal links, and page metadata.

## Update the existing GitHub and Vercel site

The live website is connected to the separate repository [vahinraj/FitJar-website](https://github.com/vahinraj/FitJar-website) and the Vercel project `fit-jar-website` in the `fit-jar` team. This folder is inside the Expo app workspace, so copy its **contents** into the website repository root. Do not push the parent Expo app as the website.

1. Clone or open the website repository and check that its remote is `https://github.com/vahinraj/FitJar-website.git`.
2. Copy every file and folder from this `fitjar_website` directory into the root of that checkout. Include `index.html`, `styles.css`, `editorial.css`, `site.js`, `hero-athlete.webp`, `brand-mark.png`, `brand-screen.png`, and all support and legal routes. Do not copy `node_modules` or any `.env` file.
3. From the website checkout, run `node scripts/check-site.mjs`. Preview it with `node scripts/preview.mjs`. Review the homepage at desktop and mobile widths, including the scroll reveal, navigation, and 3D body preview.
4. Run `git status` and `git diff`. Then run `git add .`, `git commit -m "Add FitJar brand scroll reveal"`, and `git push origin main`. Confirm `main` is still the production branch under **Vercel → fit-jar-website → Settings → Environments → Production → Branch Tracking**.
5. Open **Vercel → fit-jar-website → Deployments**. Wait for the deployment associated with your commit to become **Ready** and confirm it is **Production**. The existing production domain updates automatically; do not create a new Vercel project.
6. Open the production URL and review the homepage, slice transition, mobile layout, and support, privacy, terms, health disclaimer, account deletion, and model attribution routes. If the previous design appears, refresh without cache and confirm the latest Ready deployment is assigned to production.

## Launch notes

The legal pages are labeled pre-launch drafts while app behavior and legal requirements are finalized. Review `LEGAL_REVIEW.md` before launch. The site does not collect form data or set analytics cookies. Email links open the visitor's mail app. The site does not claim the Android app is already published or sell subscriptions on the web.
