export const FILTER_CHIP_BASE_CLASS =
  "shrink-0 px-3 py-2 text-sm whitespace-nowrap transition-all duration-150 rounded-md border";

export const FILTER_CHIP_ACTIVE_CLASS =
  "font-medium border-transparent bg-filter-chip-active-bg text-filter-chip-active-fg";

export const FILTER_CHIP_DEFAULT_CLASS =
  "font-medium border-transparent text-foreground-muted hover:text-foreground bg-transparent";

export function filterChipClass(active: boolean): string {
  if (active) {
    return `${FILTER_CHIP_BASE_CLASS} ${FILTER_CHIP_ACTIVE_CLASS}`;
  }
  return `${FILTER_CHIP_BASE_CLASS} ${FILTER_CHIP_DEFAULT_CLASS}`;
}
