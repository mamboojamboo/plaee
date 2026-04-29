import type { Metadata } from "next";
import { getEventBySlugFromGamma, getMarketsByEventId } from "@/src/entities/event/server";
import { EventDetailPage } from "@/src/page-templates/event-detail";

export const dynamic = "force-dynamic";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlugFromGamma(slug);

  if (!event) {
    return {
      title: "Event not found",
    };
  }

  const title = event.title;
  const descriptionSource =
    event.description && event.description.trim() !== ""
      ? event.description
      : `Prediction market on Polymarket Clone: ${event.title}`;
  const description = descriptionSource.slice(0, 200);
  const images = event.imageUrl ? [{ url: event.imageUrl }] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.imageUrl ? [event.imageUrl] : undefined,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const eventShell = await getEventBySlugFromGamma(slug);

  if (!eventShell) {
    return <EventDetailPage slug={slug} initialEvent={null} />;
  }

  const marketsFromListEndpoint = await getMarketsByEventId(
    eventShell.id,
    eventShell.slug,
  );
  const markets =
    marketsFromListEndpoint.length > 0 ? marketsFromListEndpoint : eventShell.markets;
  const initialEvent = { ...eventShell, markets };

  return <EventDetailPage slug={slug} initialEvent={initialEvent} />;
}
