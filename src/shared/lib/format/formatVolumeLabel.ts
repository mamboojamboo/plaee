import { formatMoneyCompact } from "./formatMoneyCompact";
import { FORMAT_INTL } from "./constants";

export function formatVolumeLabel(volume: number): string {
  if (volume >= 1_000_000) {
    return `${formatMoneyCompact(volume)} ${FORMAT_INTL.VOLUME_SUFFIX}`;
  }

  if (volume >= 1_000) {
    return `${formatMoneyCompact(volume)} ${FORMAT_INTL.VOLUME_SUFFIX}`;
  }

  return `$${Math.round(volume).toLocaleString()} ${FORMAT_INTL.VOLUME_SUFFIX}`;
}
