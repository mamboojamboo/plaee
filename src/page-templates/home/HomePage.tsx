import type { ReactNode } from "react";

import type { Event } from "@/src/entities/event";
import type { Tag } from "@/src/entities/tag";

import { HomeFeedBootstrap } from "./HomeFeedBootstrap";
import { HomeFeedFilters } from "./HomeFeedFilters";
import { HomeFeedGrid } from "./HomeFeedGrid";

type HomePageProps = {
  initialEvents: Event[];
  initialTags: Tag[];
  cards: Array<{ id: string; node: ReactNode }>;
};

export const HomePage = ({
  initialEvents,
  initialTags,
  cards,
}: HomePageProps) => {
  return (
    <HomeFeedBootstrap key="home" initialEvents={initialEvents}>
      <HomeFeedFilters initialTags={initialTags} />
      <HomeFeedGrid cards={cards} />
    </HomeFeedBootstrap>
  );
};
