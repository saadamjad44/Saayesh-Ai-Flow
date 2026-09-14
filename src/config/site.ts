/**
 * Central site settings for Saayesh Automate Stack.
 * Brand, canonical domain, and third-party IDs live here and nowhere else.
 */

/**
 * Placeholder until the domain is purchased. Replace with the bare domain
 * (no protocol, no trailing slash), e.g. "example.com".
 * `.invalid` is a reserved TLD, so placeholder URLs can never resolve.
 */
export const SITE_DOMAIN = "site-domain.invalid";

export const isPlaceholderDomain = SITE_DOMAIN.endsWith(".invalid");

export const SITE = {
  name: "Saayesh Automate Stack",
  /** Editorial positioning from revised-blueprint-phase1.jsx (Homepage). */
  tagline: "Honest AI tool reviews for people who work alone.",
  url: `https://${SITE_DOMAIN}`,
  lang: "en",
  locale: "en_US",
} as const;

/** Filled in at launch (Step 9). Empty values mean the integration is off. */
export const INTEGRATIONS = {
  ga4MeasurementId: "",
  searchConsoleVerification: "",
} as const;
