/**
 * The eight-slide Saayesh AI Flow introduction, as data.
 *
 * The source of truth is the approved PDF in public/downloads/. The slide
 * images beside this file are renders of that PDF's pages — same artwork, same
 * order, nothing redrawn — produced once at 1920x1080 (the deck's own 960x540pt
 * page box at 2x) and committed, so the site ships flat images and no PDF
 * rendering library ever reaches the browser. astro:assets takes it from there:
 * responsive webp at several widths, with intrinsic dimensions stamped on every
 * <img> so the 16:9 box is reserved before a byte of image arrives.
 *
 * Regenerating the images (only ever needed if the owner replaces the PDF):
 *   1. Replace public/downloads/saayesh-ai-flow-presentation.pdf.
 *   2. Render every page to PNG at 2x — any PDF rasteriser will do; the deck
 *      is flat vector artwork, so there is nothing to tune.
 *   3. Overwrite slide-01..slide-NN.png here and update SLIDES below.
 * The renderer is deliberately not a project dependency: it runs once, by hand,
 * and the committed output is what the site serves.
 *
 * `title` on each slide is the headline printed on that slide, transcribed from
 * the PDF itself; it is shown as a visible caption under the image, which is
 * what makes the deck's content readable without opening the PDF — and readable
 * by a crawler, which cannot read the images at all. `alt` describes what the
 * slide *looks like* and deliberately does not repeat the caption: a screen
 * reader already announces the caption.
 */
import type { ImageMetadata } from "astro";

import slide01 from "@/assets/presentation/slide-01.png";
import slide02 from "@/assets/presentation/slide-02.png";
import slide03 from "@/assets/presentation/slide-03.png";
import slide04 from "@/assets/presentation/slide-04.png";
import slide05 from "@/assets/presentation/slide-05.png";
import slide06 from "@/assets/presentation/slide-06.png";
import slide07 from "@/assets/presentation/slide-07.png";
import slide08 from "@/assets/presentation/slide-08.png";

export interface PresentationSlide {
  /** The headline printed on the slide, shown as its visible caption. */
  title: string;
  /** What the slide looks like. Never a transcription of the whole slide. */
  alt: string;
  image: ImageMetadata;
}

/**
 * The original PDF, served from public/ at this exact URL. It is the
 * downloadable source and the accessible alternative to the images, so it must
 * keep working: a rename here without a matching rename in public/downloads/
 * would 404 both the download button and the "view full presentation" link.
 */
export const PRESENTATION_PDF_PATH = "/downloads/saayesh-ai-flow-presentation.pdf";

/** Filename offered to the browser by the download button. */
export const PRESENTATION_PDF_FILENAME = "saayesh-ai-flow-presentation.pdf";

export const SLIDES: readonly PresentationSlide[] = [
  {
    title: "Find the right AI. Skip the guesswork.",
    alt: "Title slide, with the headline beside a stack of topic cards for AI writing, automation, comparing tools and better prompts.",
    image: slide01,
  },
  {
    title: "AI is everywhere. Clarity is harder.",
    alt: "Three cards stating the problem the site exists for: too many tools, too much hype, and not enough time to research them.",
    image: slide02,
  },
  {
    title: "A simpler way to make AI useful",
    alt: "A four-step path numbered 01 to 04: find a task, compare the options, learn from examples, then apply a workflow.",
    image: slide03,
  },
  {
    title: "Explore six practical AI categories",
    alt: "The six site categories as a numbered grid, from Getting Started through to AI by Industry, each with a one-line description.",
    image: slide04,
  },
  {
    title: "Not just AI news. Actionable guidance.",
    alt: "The four kinds of content on the site — guides, comparisons, workflows and prompts — beside a panel on real-world use cases.",
    image: slide05,
  },
  {
    title: "Know what your AI stack will cost",
    alt: "A mock-up of the free AI Cost Calculator, showing illustrative monthly, annual and first-year totals for three example tools.",
    image: slide06,
  },
  {
    title: "Research you can check. Advice you can trust.",
    alt: "Three editorial commitments as cards: linked sources, clear testing labels, and visible update and disclosure dates.",
    image: slide07,
  },
  {
    title: "Your next great workflow starts with one click.",
    alt: "Closing slide offering three next steps: Getting Started, Browse AI Guides, and the AI Cost Calculator.",
    image: slide08,
  },
];

export const SLIDE_COUNT = SLIDES.length;
