import { formatMoneyCompact } from "./formatMoneyCompact";

export function formatVolumeLabel(volume: number): string {
  if (volume >= 1_000_000) {
    return `${formatMoneyCompact(volume)} Vol.`;
  }

  if (volume >= 1_000) {
    return `${formatMoneyCompact(volume)} Vol.`;
  }

  return `$${Math.round(volume).toLocaleString()} Vol.`;
}
