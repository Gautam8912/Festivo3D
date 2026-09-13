import { festivalAliases } from "../data/aliases";
import { festivals, businesses } from "../data/templates";
// Explicit dictionary and grammar rules; never presented as AI or open-ended language understanding.
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function mentioned(text, values) {
  return [...values]
    .sort((a, b) => b.length - a.length)
    .find((v) => new RegExp("\\b" + escape(v) + "\\b", "i").test(text));
}
export function parseBrief(text) {
  const occasion =
    mentioned(text, festivals) ||
    Object.entries(festivalAliases).find(([, aliases]) =>
      mentioned(text, aliases),
    )?.[0];
  const businessCategory =
    mentioned(text, businesses) ||
    (/\bfashion\b/i.test(text) ? "Clothing" : undefined);
  const percentage = text.match(/\b(100|[1-9]?\d)\s*%/);
  const format = /\b(status|story|portrait)\b/i.test(text)
    ? "WhatsApp Status"
    : /\bsquare\b/i.test(text)
      ? "Instagram Post"
      : undefined;
  return {
    occasion,
    businessCategory,
    amount: percentage ? Number(percentage[1]) : undefined,
    format,
  };
}
