import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/src/entities/event";

type EventCardHeaderProps = Pick<Event, "imageUrl" | "slug"> & {
  headline: string;
  fullTitle: string;
  chanceIndicator?: React.ReactNode;
};

export const EventCardHeader = ({
  imageUrl,
  headline,
  fullTitle,
  slug,
  chanceIndicator,
}: EventCardHeaderProps) => {
  return (
    <div className="flex items-start gap-2">
      {imageUrl && (
        <Image
          className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
          src={imageUrl}
          alt={fullTitle}
          width={40}
          height={40}
          sizes="40px"
        />
      )}
      <h3 className="flex flex-col justify-center flex-1 self-stretch text-pretty text-sm font-bold leading-snug text-foreground">
        <Link
          href={`/event/${slug}`}
          className="block text-inherit decoration-2 transition-colors [overflow-wrap:anywhere] hover:underline line-clamp-3"
        >
          {headline}
        </Link>
      </h3>
      {chanceIndicator && (
        <div className="ml-auto">
          {chanceIndicator}
        </div>
      )}
    </div>
  );
};
