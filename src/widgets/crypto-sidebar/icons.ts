import {
  CalendarDays,
  Clock,
  Coins,
  LineChart,
  Timer,
  type LucideIcon,
  Sunrise,
} from "lucide-react";

const TIMEFRAME_ICON_BY_SLUG: Record<string, LucideIcon> = {
  "5m": Timer,
  "15m": Timer,
  "1h": Clock,
  "4h": Clock,
  daily: CalendarDays,
  weekly: CalendarDays,
  monthly: CalendarDays,
  yearly: CalendarDays,
  "pre-market": Sunrise,
  etf: LineChart,
};

export function timeframeIconForSlug(slug: string): LucideIcon {
  return TIMEFRAME_ICON_BY_SLUG[slug.toLowerCase()] ?? Clock;
}

export function assetIcon(): LucideIcon {
  return Coins;
}
