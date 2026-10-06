// Site configuration. Nothing here invents a launch decision: the production domain,
// correction route, owner and crawler policy come from the environment, and a
// production build stops when one is missing. The analytics token is typed in below, because it
// is public. See docs/launch-dependencies.md.

import { readFileSync } from "node:fs";

const a11y = JSON.parse(readFileSync(new URL("./a11y.json", import.meta.url), "utf8"));

const env = process.env.SITE_ENV || "development";
if (!["development", "preview", "production"].includes(env)) {
  throw new Error(`SITE_ENV must be development, preview or production, not "${env}"`);
}

const production = env === "production";
// On Netlify a preview takes the address of its own deploy, even when SITE_URL is set for every
// context, so a preview never names the published site as its canonical. Production needs SITE_URL.
const url = (production ? process.env.SITE_URL || "" : process.env.DEPLOY_PRIME_URL || process.env.SITE_URL || "http://localhost:8080").replace(/\/$/, "");

// Decision 68: only Netlify's production context may build the published site. Deploy previews
// and branch deploys stay previews, behind the sign-in, whatever SITE_ENV says elsewhere.
if (production && process.env.NETLIFY && process.env.CONTEXT !== "production") {
  throw new Error(`Build stopped. SITE_ENV is production in the Netlify context "${process.env.CONTEXT}". Only the production context may publish.`);
}

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
  // Cloudflare Web Analytics, production only: decision 74. Not a secret: it is printed in every page.
  // ponytail: typed here, as on UK Public Finances, so nobody has to remember a Netlify variable.
  analyticsToken: production ? "325728f9446f4b2881adb0f5fb398f12" : "",
  nav: [
    { href: "/", label: "Overview" },
    { href: "/state-pension/", label: "The State Pension" },
    { href: "/triple-lock/", label: "The triple lock" },
    { href: "/living-on-a-pension/", label: "Living on a pension" },
    { href: "/reform-options/", label: "Reform options" },
    { href: "/history/", label: "History" },
    { href: "/tools/", label: "Tools" },
    { href: "/sources-and-method/", label: "Sources and method" },
  ],
  // The pages of the reform options section, in reading order. Shown on each of them.
  reformPages: [
    { href: "/reform-options/", label: "The yearly increase: options" },
    { href: "/reform-options/compare/", label: "Compare the rules" },
    { href: "/reform-options/costs/", label: "What it costs, and who receives what" },
    { href: "/reform-options/social-care/", label: "Pensions and social care" },
    { href: "/reform-options/entitlement/", label: "Means-testing, and the arguments" },
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

// A real calendar date, so 2026-02-30 is refused. Today is the owner's date, in the UK, not the build server's.
const isDate = (text) => /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(Date.parse(`${text}T00:00:00Z`)) && new Date(`${text}T00:00:00Z`).toISOString().slice(0, 10) === text;
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

if (production) {
  const missing = [];
  if (!/^https:\/\/[a-z0-9.-]+$/.test(url)) missing.push("SITE_URL (https, a host name only, no path)");
  // Decision 67. A mistyped domain would pass every other check and become the canonical of every page.
  else if (url !== "https://ukstatepensionexplorer.org") missing.push(`SITE_URL (it is ${url}, but the registered domain is https://ukstatepensionexplorer.org: change this line if the domain changes)`);
  if (!process.env.SITE_TITLE) missing.push("SITE_TITLE (the working title is not used without a decision)");
  if (!["Person", "Organization"].includes(process.env.OWNER_TYPE)) missing.push("OWNER_TYPE (Person or Organization, the schema.org spelling)");
  if (!/^(https:\/\/|mailto:)\S+$/.test(config.correctionUrl)) missing.push("CORRECTION_URL (an https or mailto address)");
  if (!config.ownerName) missing.push("OWNER_NAME");
  if (!config.reviewerName || !config.reviewDate) missing.push("REVIEWER_NAME and REVIEW_DATE");
  else if (!isDate(config.reviewDate) || config.reviewDate > today) missing.push(`REVIEW_DATE (a real date as 2026-10-05, not after today, ${today} in the UK)`);
  if (!config.accessibilityAssessmentDate) missing.push("A11Y_ASSESSMENT_DATE");
  // The statement prints assessed_on from a11y.json, not this variable. They must agree, or the
  // build could pass on a date while the statement still shows the tests of an earlier day.
  else if (config.accessibilityAssessmentDate !== a11y.assessed_on) {
    missing.push(`A11Y_ASSESSMENT_DATE (it is ${config.accessibilityAssessmentDate}, but src/_data/a11y.json has assessed_on ${a11y.assessed_on}: update the statement, then use its date)`);
  }
  if (!["allow", "refuse-training"].includes(config.aiCrawlerPolicy)) {
    missing.push("AI_CRAWLER_POLICY (allow or refuse-training)");
  }
  if (missing.length) {
    throw new Error(`Production build stopped. Launch decisions not set: ${missing.join("; ")}`);
  }
}

export default config;
