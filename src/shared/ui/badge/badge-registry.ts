import { Sparkle, type LucideIcon } from "lucide-react";
import type { ComponentProps, ComponentType } from "react";

import { LiveRadioWithWaves } from "./LiveRadioWithWaves";

export type BadgeName = "new" | "live";

type BadgeIconProps = {
  size?: number | string;
  className?: string;
  "aria-hidden"?: boolean;
};

type BadgeEntry = {
  label: string;
  icon: ComponentType<BadgeIconProps>;
  rootClassName: string;
  iconClassName: string;
  iconSize: number;
  iconProps?: Partial<ComponentProps<LucideIcon>>;
};

export const badgeRegistry: Record<BadgeName, BadgeEntry> = {
  new: {
    label: "NEW",
    icon: Sparkle,
    rootClassName: "inline-flex items-center gap-1 font-semibold text-accent-warning",
    iconClassName: "shrink-0",
    iconSize: 14,
    iconProps: {
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 0,
    },
  },
  live: {
    label: "LIVE",
    icon: LiveRadioWithWaves,
    rootClassName: "inline-flex items-center gap-1 font-semibold text-accent-live",
    iconClassName: "shrink-0",
    iconSize: 14,
  },
};

export const getBadgeEntry = (name: BadgeName): BadgeEntry => badgeRegistry[name];
