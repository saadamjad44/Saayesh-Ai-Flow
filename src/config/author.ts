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
} as const;
