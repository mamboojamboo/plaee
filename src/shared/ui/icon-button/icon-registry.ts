import {
  Bookmark,
  CodeXml,
  Gift,
  Link,
  Search,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

export const iconRegistry = {
  bookmark: Bookmark,
  code: CodeXml,
  gift: Gift,
  link: Link,
  search: Search,
  sliders: SlidersHorizontal,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export const getIcon = (name: IconName): LucideIcon => iconRegistry[name];
