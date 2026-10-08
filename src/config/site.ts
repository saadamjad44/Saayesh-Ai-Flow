/**
 * Central site settings for Saayesh AI Flow.
 * Brand, canonical domain, and third-party IDs live here and nowhere else.
 */

/**
 * Canonical bare domain (no protocol, no trailing slash), e.g. "example.com".
 *
 * The apex is canonical: `www.saayeshaiflow.com` and the old Netlify host both
 * 301 here (see netlify.toml), so exactly one hostname is ever indexable. Every
 * canonical URL, og:url, JSON-LD id, sitemap entry, and the robots.txt sitemap
 * line is derived from this one value — and so is the internal-vs-external test
 * in src/lib/links.ts. Change it here and nowhere else.
 *
 * A `.invalid` value marks an unset placeholder — `.invalid` is a reserved TLD,
 * so placeholder URLs can never resolve.
 */
export const SITE_DOMAIN = "saayeshaiflow.com";

export const isPlaceholderDomain = SITE_DOMAIN.endsWith(".invalid");

export const SITE = {
  name: "Saayesh AI Flow",
  /** Editorial positioning from revised-blueprint-phase1.jsx (Homepage). */
  tagline: "Honest AI tool reviews for people who work alone.",
  url: `https://${SITE_DOMAIN}`,
  lang: "en",
  locale: "en_US",
} as const;

export interface OwnerDetails {
  /** Owner or business name. */
  name: string | null;
  contactEmail: string | null;
  /** Where the owner is based, e.g. "City, Region, Country". */
  location: string | null;
  /** Governing law / jurisdiction for the legal pages. */
  jurisdiction: string | null;
}

/**
 * Owner and legal details, supplied by the owner only — never guess them.
 * `null` renders a visible "To be provided" placeholder on the page.
 */
export const OWNER: OwnerDetails = {
  name: "Saad Amjad",
  contactEmail: "saadamjad.mah@gmail.com",
  location: "Pattoki, Punjab, Pakistan",
  jurisdiction: null,
};

/**
 * Owner-supplied service commitments shown on the contact page.
 * `responseTarget` is the reply time the site aims for, not a guarantee.
 */
export const SUPPORT = {
  responseTarget: "2 hours",
} as const;

/** Filled in at launch (Step 9). Empty values mean the integration is off. */
export const INTEGRATIONS = {
  /** GA4 Measurement ID ("G-XXXXXXXXXX"). Loaded once per page by SeoHead. */
  ga4MeasurementId: "G-VFBKW7YSWG",
  searchConsoleVerification: "",
  /**
   * Web3Forms access key for the contact form, from the build environment
   * (PUBLIC_WEB3FORMS_ACCESS_KEY — see .env.example).
   *
   * Public by design and inlined into the built HTML: the key only authorises
   * delivery to the one inbox it was issued for and grants no account access.
   * It is an environment variable so it can be rotated without a code change,
   * not because it is a secret. Empty means the form renders disabled.
   */
  web3formsAccessKey: (import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? "").trim(),
} as const;
