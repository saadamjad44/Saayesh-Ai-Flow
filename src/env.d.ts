/**
 * Build-time environment variables.
 *
 * Only `PUBLIC_`-prefixed variables reach the browser, and this site is a
 * static build: their values are inlined into the generated HTML/JS at build
 * time, so a `PUBLIC_` variable is public. Never put a secret in one.
 */
interface ImportMetaEnv {
  /**
   * Web3Forms access key for the contact form (see src/components/forms/ContactForm.astro).
   *
   * Public by design: a Web3Forms access key only authorises delivery to the
   * one inbox it was issued for and grants no account access. It lives in an
   * environment variable so it can be rotated without a code change, not
   * because it is a secret.
   */
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
