import type { Category } from "@/src/entities/category";
import type { Market } from "@/src/entities/market";
import type { Tag } from "@/src/entities/tag";

export type Event = {
  id: string;
  slug: string;
  seriesSlug?: string;
  seriesTitle?: string;
  title: string;
  description?: string;
  markets: Market[];
  tags: Tag[];
  volume: number;
  volume24hr?: number;
  liquidity: number;
  categories: Category[];
  imageUrl?: string;
  iconUrl?: string;
  startDate?: string;
  resolutionDate?: string;
  createdAt: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  isNew?: boolean;
  featured?: boolean;
  live?: boolean;
};
