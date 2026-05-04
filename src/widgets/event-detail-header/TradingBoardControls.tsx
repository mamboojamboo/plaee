import { ChevronDown, Dot } from "lucide-react";
import { Pill } from "@/src/shared/ui/pill";
import { EVENT_DETAIL_HEADER_INTL } from "./constants";

export const LiveResolutionDot = () => {
  return (
    <span className="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center overflow-visible">
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
        aria-hidden
      >
        <span className="live-dot-ring box-border h-2.5 w-2.5 rounded-full border-2 border-accent-live" />
      </span>
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
        aria-hidden
      >
        <span className="live-dot-ring live-dot-ring--delayed box-border h-2.5 w-2.5 rounded-full border-2 border-accent-live" />
      </span>
      <Dot
        size={18}
        strokeWidth={4}
        className="relative z-10 text-accent-live"
        aria-hidden
      />
    </span>
  );
};

type TradingBoardControlsProps = {
  resolutionDateLabel: string;
  timeframeLabel: string;
};

export const TradingBoardControls = ({
  resolutionDateLabel,
  timeframeLabel,
}: TradingBoardControlsProps) => {
  return (
    <div className="flex items-center gap-2 py-3 lg:gap-3 lg:py-4">
      <Pill className="px-3 py-1.5 text-sm font-normal leading-5 lg:text-[13px] lg:font-normal lg:leading-6" rightSlot={<ChevronDown size={16} className="opacity-80" />}>
        {timeframeLabel}
      </Pill>

      <Pill
        tone="highlight"
        className="px-3 py-1.5 text-sm font-normal leading-5 lg:text-[13px] lg:font-normal lg:leading-6"
        leftSlot={<LiveResolutionDot />}
      >
        {EVENT_DETAIL_HEADER_INTL.RESOLUTION_TIME_PREFIX} {resolutionDateLabel}
      </Pill>
    </div>
  );
};
