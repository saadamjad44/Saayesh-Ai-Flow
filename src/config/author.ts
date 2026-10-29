/**
 * The site's one author.
 *
 * Saayesh AI Flow is written by a single person, so the byline on every entry
 * page, the author page at `path`, and the `author` Person in the Article
 * structured data all read from here — the visible byline and the schema can
 * therefore never name different people.
 *
 * Nothing in this file may be invented. `name` and `location` come from OWNER
 * in src/config/site.ts, and `bio` is the owner-supplied background already
 * published on the About page (src/pages/about.astro renders these same
 * paragraphs). No qualifications, employers, dates, awards, or testing claims
 * belong here unless the owner has stated them on the site already.
 */
import { getPage } from "./pages";

export const AUTHOR = {
  /** Must match OWNER.name in src/config/site.ts. */
  name: "Saad Amjad",
  /** The author page. Registered in the page registry as `author-saad-amjad`. */
  path: getPage("author-saad-amjad").path,
  /** One factual line, used as the author page's meta description lead. */
  role: "Runs Saayesh AI Flow and writes the guides published on it.",
  /**
   * Owner-supplied background, verbatim from the About page. Rendered as one
   * paragraph per entry, on both the About page and the author page.
   */
  bio: [
    "Saad Amjad is a Full Stack Web Developer specializing in React.js, Node.js, and AI tools integration. He has hands-on experience building web applications, including e-commerce platforms, task management systems, and AI-powered developer tools.",
    "His work combines modern web development with practical AI integration, including REST APIs, authentication, prompt engineering, and AI-powered workflows. He also has experience with SEO basics, responsive web design, and modern development tools such as Git, GitHub, Postman, and VS Code.",
  ],
  /**
   * The author's own profiles elsewhere, supplied by the owner.
   *
   * These are the site's one identity claim about a real person outside it, so
   * two rules apply. Every URL must be owner-supplied — never found, guessed,
   * or inferred from a username that merely looks right — and every URL must be
   * rendered as a visible link on the author page, not only inside structured
   * data. A `sameAs` nobody can see is an assertion; a `sameAs` beside the
   * visible link it matches is a verifiable one, and the second is what an
   * answer engine can actually act on.
   *
   * Checked on 2026-10-29: the GitHub profile and the portfolio both resolve
   * and name Saad Amjad, and the YouTube channel resolves as "Build Ai with
   * Saad". X returned HTTP 402 and LinkedIn blocks automated requests, so
   * neither could be confirmed from here — they are published on the owner's
   * word, which is the only authority this file ever had for them.
   *
   * Order is the order they render. If a profile is ever deleted or renamed,
   * remove it here: a dead `sameAs` is worse than a missing one.
   */
  profiles: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/saad-amjad-5922b63a9/" },
    { label: "GitHub", url: "https://github.com/saadamjad44" },
    { label: "X", url: "https://x.com/saadamjad44" },
    { label: "YouTube", url: "https://www.youtube.com/channel/UCb19y0oQLudeI48ldpr_WIA" },
    { label: "Portfolio", url: "https://saad-portfolio-deployment.vercel.app/" },
  ],
  /**
   * Subjects the Person node claims knowledge of, for entity understanding.
   *
   * Every term here appears verbatim in `bio` above, which is owner-supplied
   * and already published on both the About page and the author page. Nothing
   * may be added to this list that the visible bio does not already say — it is
   * a restatement of published text in a machine-readable field, not a place to
   * widen the claim. No seniority, years of experience, employer, or
   * certification belongs here.
   */
  knowsAbout: [
    "React.js",
    "Node.js",
    "AI tools integration",
    "REST APIs",
    "Prompt engineering",
    "AI-powered workflows",
    "Responsive web design",
    "SEO",
  ],
} as const;
