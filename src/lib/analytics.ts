/**
 * The one way this site sends an event to analytics.
 *
 * GA4 is already installed once, by SeoHead, from INTEGRATIONS.ga4MeasurementId
 * — this module adds no second installation, no second script, and no vendor of
 * its own. It only calls the `gtag` that page already defined, and does nothing
 * at all when there isn't one (analytics switched off, a blocker, or a script
 * that has not loaded yet). That is why every call site can be a plain
 * `trackEvent(...)` with no guard around it.
 *
 * What may be sent: the fact that an intentional interaction happened. That is
 * the whole contract. No calculator inputs, no figures, no financial
 * assumptions, no personal data, no PDF contents, and nothing typed into any
 * field on the site may ever be passed in `params` — the free tools state in
 * writing that the visitor's figures never leave the browser, and that promise
 * is kept here as well as in the calculators themselves.
 *
 * Consent is whatever the GA4 installation is already configured with. This
 * module deliberately has no consent logic of its own: a second, divergent
 * consent rule is worse than none.
 */

/** Every event the site sends, named once so a typo cannot invent a new one. */
export type AnalyticsEventName =
  /** The slide viewer was expanded into the full-screen presentation mode. */
  | "presentation_open"
  /** The original presentation PDF was downloaded. */
  | "presentation_download"
  /** A homepage call to action for the email savings calculator was clicked. */
  | "email_calculator_cta_click";

declare global {
  interface Window {
    /** Defined by the GA4 snippet in SeoHead; absent when analytics is off. */
    gtag?: (command: "event", name: string, params?: Record<string, string>) => void;
  }
}

/**
 * Sends one GA4 event, or silently does nothing.
 *
 * `params` is restricted to strings on purpose: it is for naming *where* an
 * interaction happened (`{ location: "homepage" }`), not for reporting values a
 * visitor entered.
 */
export function trackEvent(name: AnalyticsEventName, params?: Record<string, string>): void {
  window.gtag?.("event", name, params);
}
