/**
 * Central site settings for Saayesh AI Flow.
 * Brand, canonical domain, and third-party IDs live here and nowhere else.
 */

/**
 * Canonical bare domain (no protocol, no trailing slash), e.g. "example.com".
 * Currently the Netlify production host; swap it here once the custom domain
 * is purchased. A `.invalid` value marks an unset placeholder — `.invalid` is
 * a reserved TLD, so placeholder URLs can never resolve.
 */
export const SITE_DOMAIN = "peppy-seahorse-9d05e3.netlify.app";

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
  ga4MeasurementId: "",
  searchConsoleVerification: "",
} as const;
