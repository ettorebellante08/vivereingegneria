import sanitizeHtml from "sanitize-html";

/**
 * Sanitise rich-text HTML before it is persisted / rendered.
 *
 * Content is authored by trusted staff (blogger/admin) via Tiptap, but we
 * still enforce a strict allow-list as defence-in-depth: the stored HTML is
 * later injected with dangerouslySetInnerHTML on public pages.
 */
export function sanitizeRichText(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "hr",
      "h2", "h3", "h4",
      "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li",
      "blockquote", "code", "pre",
      "a", "img",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      // Force safe rel/target on all links.
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}
