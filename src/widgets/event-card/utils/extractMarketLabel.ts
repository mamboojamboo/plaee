import type { Market } from "@/src/entities/market";

export const extractMarketLabel = (market: Market): string => {
  if (market.groupItemTitle) {
    return market.groupItemTitle;
  }

  const question = market.question || "";

  if (question) {
    return question;
  }

  return "Option";
};