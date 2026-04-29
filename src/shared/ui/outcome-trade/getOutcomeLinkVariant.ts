export type OutcomeLinkVariant = "positive" | "negative";

const POSITIVE_LABELS = new Set(["yes", "up"]);
const NEGATIVE_LABELS = new Set(["no", "down"]);

export function getOutcomeLinkVariant(outcomeName: string): OutcomeLinkVariant {
  const key = outcomeName.trim().toLowerCase();
  if (POSITIVE_LABELS.has(key)) return "positive";
  if (NEGATIVE_LABELS.has(key)) return "negative";
  return "negative";
}
