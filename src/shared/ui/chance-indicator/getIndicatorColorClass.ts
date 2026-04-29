export function getIndicatorColorClass(probability: number): string {
  if (probability >= 50) return "stroke-indicator-band-high";
  if (probability >= 30) return "stroke-indicator-band-mid";
  return "stroke-indicator-band-low";
}
