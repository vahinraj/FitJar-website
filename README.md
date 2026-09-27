# FitJar website

Static, responsive FitJar marketing and legal website. No npm install, API keys,
database, or server are required. The site has an animated landing page and direct
routes for `/privacy/`, `/terms/`, `/health-disclaimer/`, `/support/`,
`/delete-account/`, and `/model-attribution/`. The landing page includes a
compressed, simplified CC BY-SA 4.0 body model preview with Male and Female
presentation controls. It loads Three.js from jsDelivr at runtime.

## Preview locally

From this folder, run `node scripts/preview.mjs` and open
`http://127.0.0.1:4173`. Run `node scripts/check-site.mjs` to
check the JavaScript syntax, internal links, and main page metadata.

## Put it in the new GitHub repository

This folder was created in the FitJar app workspace because the execution
environment could not clone or push to `vahinraj/FitJar-website`. Copy **the
contents of this folder** into the root of that separate repository. Do not copy
the parent Expo app, `.env.local`, or `node_modules`.

In a normal terminal with GitHub access:

1. `git clone https://github.com/vahinraj/FitJar-website.git`
2. Copy this folder's files and folders into the cloned repository root.
3. In the cloned repository, run `node scripts/check-site.mjs`.
4. `git add . && git commit -m "Build FitJar website and legal pages" && git push origin main`

If the remote default branch has another name, push that branch instead of
`main`. Review the diff before committing.

## Deploy on Vercel

1. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
2. Import `vahinraj/FitJar-website` from GitHub. Grant Vercel access to that
   repository if asked.
3. Set **Framework Preset** to **Other**. Set **Root Directory** to the
   repository root. Leave the build command empty and set **Output Directory**
   to `.` if Vercel asks. The site is plain static HTML, CSS, and JavaScript.
4. Deploy. Open the Vercel URL and test `/`, `/privacy/`, `/terms/`,
   `/health-disclaimer/`, `/support/`, and `/delete-account/` directly.
5. In Vercel **Project → Settings → Domains**, add a domain you own if desired.
   Configure the DNS records Vercel shows. Keep the Vercel URL until the domain
   resolves over HTTPS.
6. After the final public URL is known, add the exact policy, terms, and deletion
   URLs to the app, RevenueCat paywall, and Google Play listing. Test every link
   in an Android build. The app currently has no public legal links wired in.

## Important before app launch

The legal pages are clearly labeled **pre-launch drafts**, because app behavior
and legal requirements are still being finalized. Do not treat website deployment
as legal clearance. The operator should obtain India-specific legal review,
resolve the release gaps in `LEGAL_REVIEW.md`, confirm deletion and retention
behavior, and then remove the draft notices with a reviewed effective date.

The site does not collect form data or set analytics cookies. Email links open the
visitor's mail app. It does not sell subscriptions on the web or claim that the
Android app is already published.
