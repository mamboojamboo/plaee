import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlugFromGamma, getMarketsByEventId } from "@/src/entities/event/server";
import {
  EventDetailPage,
  EVENT_DETAIL_INTL,
} from "@/src/page-templates/event-detail";

export const revalidate = 30;

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: EventPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const event = await getEventBySlugFromGamma(slug);

  if (!event) {
    return {
      title: EVENT_DETAIL_INTL.NOT_FOUND_TITLE,
    };
  }

  const title = event.title;
  const descriptionSource =
    event.description && event.description.trim() !== ""
      ? event.description
      : `${EVENT_DETAIL_INTL.METADATA_DESCRIPTION_PREFIX}${event.title}`;
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
};

export const EventPage = async ({ params }: EventPageProps) => {
  const { slug } = await params;
  const eventShell = await getEventBySlugFromGamma(slug);

  if (!eventShell) {
    notFound();
  }

  const marketsFromListEndpoint = await getMarketsByEventId(
    eventShell.id,
    eventShell.slug,
  );
  const markets =
    marketsFromListEndpoint.length > 0 ? marketsFromListEndpoint : eventShell.markets;
  const initialEvent = { ...eventShell, markets };

  return <EventDetailPage slug={slug} initialEvent={initialEvent} />;
};

export default EventPage;
