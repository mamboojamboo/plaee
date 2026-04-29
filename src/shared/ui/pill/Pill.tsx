import React from "react";

type PillTone = "default" | "highlight";

const toneClass: Record<PillTone, string> = {
  default:
    "bg-background text-foreground border-border",
  highlight:
    "bg-pill-highlight-bg text-pill-highlight-fg border-transparent",
};

type PillProps = {
  children: React.ReactNode;
  tone?: PillTone;
  className?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export function Pill({
  children,
  tone = "default",
  className = "",
  leftSlot,
  rightSlot,
}: PillProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${toneClass[tone]} ${className}`.trim()}
    >
      {leftSlot}
      <span>{children}</span>
      {rightSlot}
    </div>
  );
}
