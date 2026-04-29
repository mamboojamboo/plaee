export function formatPercentFromPrice(price: number): string {
  if (!Number.isFinite(price)) {
    return "—";
  }
  const rounded = Math.round(price * 100);
  if (rounded <= 0) {
    return "<1%";
  }
  if (rounded >= 100) {
    return "100%";
  }
  return `${rounded}%`;
}
