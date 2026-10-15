/**
 * Convert Tiptap/HTML answer markup into plain text for the AI prompt.
 * Tables become rows of `cell | cell`; lists and paragraphs become lines.
 * Deliberately dependency-free so it runs anywhere (server route handlers).
 */
export function htmlToText(html: string): string {
  if (!html) return "";

  let text = html;

  // Table cells → " | " separators, rows → newlines.
  text = text.replace(/<\/t[dh]>\s*<t[dh][^>]*>/gi, " | ");
  text = text.replace(/<\/tr>/gi, "\n");

  // List items → "- " bullets.
  text = text.replace(/<li[^>]*>/gi, "- ");

  // Line breaks and block-level closings → newlines.
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/(p|div|h[1-6]|li|tr|table|ul|ol|blockquote)>/gi, "\n");

  // Strip all remaining tags.
  text = text.replace(/<[^>]+>/g, "");

  // Decode a few common HTML entities.
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  // Collapse excess blank lines and trailing spaces.
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}
