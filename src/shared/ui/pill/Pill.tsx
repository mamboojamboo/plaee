import type { ReactNode } from "react";

type PillTone = "default" | "highlight";

const toneClass: Record<PillTone, string> = {
  default:
    "bg-background text-foreground border-border",
  highlight:
    "bg-pill-highlight-bg text-pill-highlight-fg border-transparent",
};

type PillProps = {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export const Pill = ({
  children,
  tone = "default",
  className = "",
  leftSlot,
  rightSlot,
}: PillProps) => {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${toneClass[tone]} ${className}`.trim()}
    >
      {leftSlot}
      <span>{children}</span>
      {rightSlot}
    </div>
  );
};
