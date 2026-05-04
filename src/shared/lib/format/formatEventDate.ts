import { FORMAT_INTL } from "./constants";

const DEFAULT_DATE_FORMATTER = new Intl.DateTimeFormat(FORMAT_INTL.DATE_LOCALE, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatEventDate(date: string | Date | undefined): string {
  if (!date) return "";

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return DEFAULT_DATE_FORMATTER.format(parsed);
}
