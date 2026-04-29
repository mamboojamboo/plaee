import {
  fetchCryptoSidebarCounts,
  fetchCryptoTrendingEvents,
  groupCryptoTags,
} from "@/src/features/crypto-feed/server";
import { CryptoPage } from "@/src/page-templates/crypto";
import { CryptoSidebar } from "@/src/widgets/crypto-sidebar";
import { mapEventsToCardNodes } from "@/src/widgets/event-card";

export const dynamic = "force-dynamic";

export default async function Crypto() {
  const [initialEvents, sidebar] = await Promise.all([
    fetchCryptoTrendingEvents(),
    fetchCryptoSidebarCounts(),
  ]);

  const groups = groupCryptoTags(sidebar.counts, sidebar.all);
  const cards = mapEventsToCardNodes(initialEvents);

  return (
    <main className="min-h-screen bg-background">
      <CryptoPage
        initialEvents={initialEvents}
        initialCounts={sidebar.counts}
        initialAllCount={sidebar.all}
        subSlug={null}
        sidebar={<CryptoSidebar groups={groups} activeSubSlug={null} />}
        cards={cards}
      />
    </main>
  );
}
