# FitJar website

This is the standalone FitJar marketing and legal website. The homepage opens with two sequential scroll-driven cuts through the supplied FitJar branding screen, revealing the athlete hero. The page also includes an interactive 3D body preview. Three.js loads from jsDelivr at runtime.

## Preview locally

From this directory, run `node scripts/preview.mjs` and open `http://127.0.0.1:4173` in a browser. Run `node scripts/check-site.mjs` to check JavaScript syntax, internal links, and page metadata. Review both image cuts and the page layout at desktop and phone widths.

## Publish updates to the existing site

The website lives in the separate GitHub repository [vahinraj/FitJar-website](https://github.com/vahinraj/FitJar-website), connected to Vercel project `fit-jar-website` in the `fit-jar` team. This directory is inside the Expo app workspace. Copy its **contents** into the website repository root; the parent Expo app is a different project.

1. In Vercel, open **fit-jar-website → Settings → Git** and confirm the connected repository is `vahinraj/FitJar-website`. Under **Settings → Environments → Production → Branch Tracking**, confirm the production branch is `main`. Under **Settings → General**, confirm the Root Directory points to the repository root.
2. Open PowerShell. If you have not cloned the website repository, run:
   ```powershell
   cd C:\Users\sirim
   git clone https://github.com/vahinraj/FitJar-website.git
   ```
   If `C:\Users\sirim\FitJar-website` already exists, run `git -C C:\Users\sirim\FitJar-website pull origin main` instead.
3. Copy the updated website files into that checkout:
   ```powershell
   robocopy "C:\Users\sirim\myApp\fitjar_website" "C:\Users\sirim\FitJar-website" /E
   ```
   Include the new `brand-mark.png`, `brand-screen.png`, `editorial.css`, `site.js`, and all pages. Do not copy the parent Expo app or any `.env` file.
4. Review and publish the checkout:
   ```powershell
   cd C:\Users\sirim\FitJar-website
   node scripts/check-site.mjs
   git status
   git add -A
   git commit -m "Refine FitJar image-slice reveal"
   git push origin main
   ```
   Git may open a browser sign-in flow. Sign in with the GitHub account that can write to `vahinraj/FitJar-website`.
5. Open **Vercel → fit-jar-website → Deployments**. Find the deployment for that commit. Wait until it is **Ready** and confirm the environment is **Production**. A push to the production branch updates the existing production domain automatically.
6. Open the production URL. Scroll through both image cuts in both directions, check that every hero button is visible on a short laptop screen, inspect the three plan cards, and check phone widths. Visit the support, privacy, terms, health disclaimer, account deletion, and model attribution pages too.
7. If no deployment starts, check the repository connection under **Settings → Git**. Vercel also provides **Deployments → Create Deployment** to deploy the latest `main` commit from the existing project. If an old page appears, refresh without cache and confirm the latest Ready deployment is assigned to Production.

## Launch notes

The legal pages are labeled pre-launch drafts while app behavior and legal requirements are finalized. Review `LEGAL_REVIEW.md` before launch. The site does not collect form data or set analytics cookies. Email links open the visitor's mail app. The site does not claim the Android app is already published or sell subscriptions on the web.
