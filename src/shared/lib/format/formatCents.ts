import { FORMAT_INTL } from "./constants";

export function formatCents(price: number, digits = 1): string {
  if (!Number.isFinite(price)) {
    return FORMAT_INTL.UNAVAILABLE_CENTS;
  }
  return `${(price * 100).toFixed(digits)}¢`;
}
