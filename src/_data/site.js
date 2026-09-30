// Site configuration. Nothing here invents a launch decision: the production domain,
// correction route, owner and crawler policy come from the environment, and a
// production build stops when one is missing. See docs/launch-dependencies.md.

const env = process.env.SITE_ENV || "development";
if (!["development", "preview", "production"].includes(env)) {
  throw new Error(`SITE_ENV must be development, preview or production, not "${env}"`);
}

const production = env === "production";
// On Netlify a preview takes the address of its own deploy. Production never does: it needs SITE_URL.
const url = (process.env.SITE_URL || (production ? "" : process.env.DEPLOY_PRIME_URL || "http://localhost:8080")).replace(/\/$/, "");

// Basic authentication for the preview. The value is "user:password" and comes from the
// environment only, so it is never in the repository. See src/_headers.njk.
const basicAuth = process.env.BASIC_AUTH || "";
if (basicAuth && !/^[^\s:]+:[^\s]+$/.test(basicAuth)) {
  throw new Error("BASIC_AUTH must be user:password with no spaces");
}
if (process.env.NETLIFY && !production && !basicAuth) {
  throw new Error("Preview build stopped. BASIC_AUTH is not set in Netlify, so the preview would be open to anyone with the address.");
}
if (production && basicAuth) {
  throw new Error("Production build stopped. BASIC_AUTH is set, so the published site would ask every reader for a password.");
}

const config = {
  env,
  production,
  indexable: production,
  basicAuth,
  // SITE_TITLE, not SITE_NAME: Netlify sets SITE_NAME itself, to the project name.
  name: process.env.SITE_TITLE || "UK State Pension Explorer",
  url,
  language: "en-GB",
  correctionUrl: process.env.CORRECTION_URL || "",
  ownerName: process.env.OWNER_NAME || "",
  ownerType: process.env.OWNER_TYPE === "Organization" ? "Organization" : "Person",
  reviewerName: process.env.REVIEWER_NAME || "",
  reviewDate: process.env.REVIEW_DATE || "",
  accessibilityAssessmentDate: process.env.A11Y_ASSESSMENT_DATE || "",
  aiCrawlerPolicy: process.env.AI_CRAWLER_POLICY || "",
  nav: [
    { href: "/", label: "Overview" },
    { href: "/state-pension/", label: "The State Pension" },
    { href: "/triple-lock/", label: "The triple lock" },
    { href: "/living-on-a-pension/", label: "Living on a pension" },
    { href: "/reform-options/", label: "Reform options" },
    { href: "/history/", label: "History" },
    { href: "/sources-and-method/", label: "Sources and method" },
  ],
  siblings: [
    {
      name: "UK Public Finances Explorer",
      url: "https://ukpublicfinances.org/",
      summary: "Government debt, borrowing and spending, with the source and date of each figure.",
    },
    {
      name: "UK Migration Explorer",
      url: "https://ukmigrationexplorer.org/",
      summary: "What UK migration and asylum statistics show, and what they do not show.",
    },
  ],
};

if (production) {
  const missing = [];
  if (!/^https:\/\/[^/]+$/.test(url)) missing.push("SITE_URL (https, no path)");
  if (/localhost|example|placeholder/i.test(url)) missing.push("SITE_URL (a real domain)");
  if (!process.env.SITE_TITLE) missing.push("SITE_TITLE (the working title is not used without a decision)");
  if (!["Person", "Organization"].includes(process.env.OWNER_TYPE)) missing.push("OWNER_TYPE (Person or Organization, the schema.org spelling)");
  if (!config.correctionUrl) missing.push("CORRECTION_URL");
  if (!config.ownerName) missing.push("OWNER_NAME");
  if (!config.reviewerName || !config.reviewDate) missing.push("REVIEWER_NAME and REVIEW_DATE");
  if (!config.accessibilityAssessmentDate) missing.push("A11Y_ASSESSMENT_DATE");
  if (!["allow", "refuse-training"].includes(config.aiCrawlerPolicy)) {
    missing.push("AI_CRAWLER_POLICY (allow or refuse-training)");
  }
  if (missing.length) {
    throw new Error(`Production build stopped. Launch decisions not set: ${missing.join("; ")}`);
  }
}

export default config;
