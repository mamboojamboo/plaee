import { FORMAT_INTL } from "./constants";

export function formatPercentFromPrice(price: number): string {
  if (!Number.isFinite(price)) {
    return FORMAT_INTL.UNAVAILABLE_PERCENT;
  }
  const rounded = Math.round(price * 100);
  if (rounded <= 0) {
    return FORMAT_INTL.LESS_THAN_ONE_PERCENT;
  }
  if (rounded >= 100) {
    return FORMAT_INTL.FULL_PERCENT;
  }
  return `${rounded}%`;
}
