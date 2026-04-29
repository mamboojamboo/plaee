type FormatMoneyCompactOptions = {
  maximumFractionDigits?: number;
};

export function formatMoneyCompact(
  value: number,
  options: FormatMoneyCompactOptions = {},
): string {
  const { maximumFractionDigits = 1 } = options;
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(maximumFractionDigits)}B`;
  }

  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(maximumFractionDigits)}M`;
  }

  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }

  return `$${Math.round(value).toLocaleString()}`;
}
