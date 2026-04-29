import { fetchEvents } from "@/src/features/event-feed/server";
import { getMarketTags } from "@/src/features/tags-feed/server";
import { HomePage } from "@/src/page-templates/home";
import { mapEventsToCardNodes } from "@/src/widgets/event-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [initialEvents, initialTags] = await Promise.all([
    fetchEvents(),
    getMarketTags(),
  ]);

  const cards = mapEventsToCardNodes(initialEvents);

  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col gap-4">
        <HomePage
          initialEvents={initialEvents}
          initialTags={initialTags}
          cards={cards}
        />
      </div>
    </main>
  );
}
