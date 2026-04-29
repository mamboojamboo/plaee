import type { OutcomeLinkVariant } from "./getOutcomeLinkVariant";

export function getEventCardOutcomeButtonVariant(
  outcomeIndex: number,
): OutcomeLinkVariant {
  return outcomeIndex === 0 ? "positive" : "negative";
}
