export function formatCents(price: number, digits = 1): string {
  if (!Number.isFinite(price)) {
    return "—¢";
  }
  return `${(price * 100).toFixed(digits)}¢`;
}
