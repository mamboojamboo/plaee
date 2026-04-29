import { notFound, redirect } from "next/navigation";

import {
  fetchCryptoEventsForSubSlug,
  fetchCryptoSidebarCounts,
  groupCryptoTags,
  isCryptoSidebarPathSegment,
  isKnownCryptoSubSlug,
} from "@/src/features/crypto-feed/server";
import { CryptoPage } from "@/src/page-templates/crypto";
import { CryptoSidebar } from "@/src/widgets/crypto-sidebar";
import { mapEventsToCardNodes } from "@/src/widgets/event-card";

export const dynamic = "force-dynamic";

type CryptoSubPageProps = {
  params: Promise<{ subSlug: string }>;
};

export default async function CryptoSubPage({ params }: CryptoSubPageProps) {
  const { subSlug } = await params;
  const normalized = subSlug.trim().toLowerCase();

  if (isCryptoSidebarPathSegment(subSlug)) {
    const [initialEvents, sidebar] = await Promise.all([
      fetchCryptoEventsForSubSlug(subSlug),
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
          subSlug={subSlug}
          sidebar={<CryptoSidebar groups={groups} activeSubSlug={subSlug} />}
          cards={cards}
        />
      </main>
    );
  }

  if (isKnownCryptoSubSlug(normalized)) {
    redirect("/crypto");
  }

  notFound();
}
