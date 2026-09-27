# FitJar legal and product release audit

Date: 27 September 2026. This is an engineering and content review, not legal
advice or a certification of compliance. It compares the current FitJar source
and release checklist against the public draft pages and current platform rules.

## Confirmed from the app source

- Brand: FitJar. Individual operator recorded in `PRIVACY_DATA_FLOW.md` and
  `RELEASE_CHECKLIST.md`: Sirimalla Vahin Raj. Public support contact:
  `fitjar.support@gmail.com`. Intended first market: India.
- Supabase stores signed-in account, profile, meal, workout, progress, and private
  meal-image records. AsyncStorage keeps offline app data; SecureStore keeps auth
  material. The AI meal action sends selected content to OpenAI after a disclosure.
- Current product policy permits ages 16+, while AI meal analysis checks adult age
  in both app and Edge Function. Backend account-creation age enforcement and
  verified consent for minors are not completed.
- The app has an in-app account deletion control and `delete-account` Edge
  Function. The function removes private meal images and deletes the auth user.
  Production backup deletion, cascade coverage and recovery boundaries need
  end-to-end verification.
- RevenueCat is integrated in source, with intended Free, Plus and Pro tiers.
  Google Play products, live prices, server-verified entitlements, purchase and
  restoration testing remain release work. The website therefore states no
  fixed price and has no purchase button.

## Launch blockers to resolve

1. **16–17-year-old users:** India's DPDP Act defines a child as under 18 and
   provides for verifiable parent/guardian consent subject to commencement and
   exceptions. The 2025 Rules phase relevant provisions in over time. Obtain
   counsel's dated review of the law as in force at launch. Either implement
   compliant verified consent and an age-appropriate nutrition plan, or raise
   and enforce the minimum age to 18 across onboarding, auth, APIs and existing
   accounts. Do not rely on the current client-side minimum age alone.
2. **Retention:** Set and technically verify periods for meal photos, failed
   cleanup, logs, backups, provider processing, deletion request records, and
   legally required financial records. Replace the open-ended draft language on
   the Privacy Policy with specific periods or clear criteria.
   Define a rights and grievance response workflow, including verification,
   escalation, and any deadlines that apply when the relevant law commences.
3. **Deletion:** Rehearse in-app and web request deletion with test accounts.
   Verify private Storage, database cascades, offline cache, backups, provider
   effects and the confirmation message. Define the web request identity-check
   and response process. Put the exact `/delete-account/` HTTPS URL in Play Console.
4. **Subscriptions:** Complete Google Play subscription configuration, price and
   tax setup, in-app benefits and renewal disclosure, cancellation link, restore
   purchases, entitlement verification and test transactions. Only then publish
   exact pricing and availability claims. Account deletion must not be presented
   as subscription cancellation.
5. **Store disclosures:** Complete Google Play Data safety, Target Audience,
   Health apps declaration and applicable permissions against the production
   build. Put the exact public Privacy Policy URL in the store listing and app.
6. **Providers:** Confirm Supabase, OpenAI, RevenueCat, Vercel and Google Fonts
   terms, processor arrangements, data locations, retention and eligibility for the target ages.
   Review cross-border transfers for India and any later markets.
7. **Clinical review:** Adult calorie formula and weight-loss targets in the
   current code have not been validated for teens. Review health claims and
   in-app disclaimers; keep Body Intelligence and AI outputs framed as estimates.
8. **Legal content:** Have qualified Indian counsel review and approve the
   Privacy Policy, Terms, Health Disclaimer, consumer remedies, tax and operator
   identification. Record version and effective date. If future worldwide
   distribution is planned, conduct a region-by-region policy review before it.
9. **Website/app links:** After Vercel assigns a stable HTTPS URL, wire terms,
   privacy, health disclaimer, support, deletion, and subscription management
   links into the app and RevenueCat paywall; test from a release build.
10. **3D model publication:** The website now distributes a compressed derivative
    of the attributed muscle anatomy model plus the Blender face and soft-tissue
    overlays. Keep the attribution page with the deployment. Verify the exact
    MPFB version and donor asset-pack provenance before a public commercial launch.

## Primary sources checked

- [India Digital Personal Data Protection Act, 2023](https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023.pdf)
- [DPDP Rules, 2025 notification](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)
- [DPDP Act commencement notification](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf)
- [Google Play account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Google Play subscription policy](https://support.google.com/googleplay/android-developer/answer/9900533)
- [Google Play health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291)
- [Google Play user data policy](https://support.google.com/googleplay/android-developer/answer/10144311)
- [Vercel Git deployment instructions](https://vercel.com/docs/git)
