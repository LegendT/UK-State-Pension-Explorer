// The browser the two accessibility scripts drive. Chrome by default; A11Y_BROWSER=firefox or
// A11Y_BROWSER=webkit runs the same checks in Firefox or in WebKit, Safari's engine (AA5).
// Firefox's driver cannot set a colour scheme, reduced motion or scripts off for one page, so outside
// Chrome each of those is set when a browser (Firefox) or a page (WebKit) is opened.
import puppeteer from "puppeteer-core";
import { webkit } from "playwright-core";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FIREFOX = process.env.FIREFOX_PATH || "/Applications/Firefox.app/Contents/MacOS/firefox";
const name = process.env.A11Y_BROWSER || "chrome";
if (!["chrome", "firefox", "webkit"].includes(name)) throw new Error(`A11Y_BROWSER is "${name}": use chrome, firefox or webkit`);

export const chrome = name === "chrome";
// Safari's Tab skips links unless "Press Tab to highlight each item" is on; Option-Tab reaches them.
export const tabKey = name === "webkit" ? "Alt+Tab" : "Tab";
// Reports from another browser are saved beside Chrome's, not over them.
export const suffix = chrome ? "" : `-${name}`;

export async function launch({ scheme = "light", reducedMotion = false, javascript = true } = {}) {
  if (name === "chrome") return puppeteer.launch({ executablePath: CHROME, headless: true });
  if (name === "firefox") {
    return puppeteer.launch({
      browser: "firefox",
      executablePath: FIREFOX,
      headless: true,
      extraPrefsFirefox: {
        "layout.css.prefers-color-scheme.content-override": scheme === "dark" ? 0 : 1,
        "ui.prefersReducedMotion": reducedMotion ? 1 : 0,
        "javascript.enabled": javascript,
      },
    });
  }
  // Playwright, given the few puppeteer calls the two scripts make.
  const browser = await webkit.launch();
  return {
    version: async () => `WebKit/${browser.version()}`,
    close: () => browser.close(),
    async newPage() {
      const context = await browser.newContext({ colorScheme: scheme, reducedMotion: reducedMotion ? "reduce" : "no-preference", javaScriptEnabled: javascript });
      const page = await context.newPage();
      const waits = { networkidle0: "networkidle" };
      const own = {
        setViewport: ({ width, height }) => page.setViewportSize({ width, height }),
        goto: (url, options = {}) => page.goto(url, { ...options, waitUntil: waits[options.waitUntil] || options.waitUntil }),
        reload: (options = {}) => page.reload({ ...options, waitUntil: waits[options.waitUntil] || options.waitUntil }),
        setRequestInterception: async () => {},
        on: (event, handler) => event === "request"
          ? page.route("**/*", (route) => handler({ url: () => route.request().url(), abort: () => route.abort(), continue: () => route.continue() }))
          : page.on(event, handler),
        close: () => context.close(),
      };
      return new Proxy(page, { get: (target, key) => own[key] || (typeof target[key] === "function" ? target[key].bind(target) : target[key]) });
    },
  };
}
