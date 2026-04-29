import type { OutcomeLinkVariant } from "./getOutcomeLinkVariant";

type OutcomeSurfaceClassOptions = {
  variant: OutcomeLinkVariant;
  size: "default" | "small";
  showProbabilityOnHover: boolean;
  className?: string;
};

export function outcomeTradeSurfaceClasses({
  variant,
  size,
  showProbabilityOnHover,
  className = "",
}: OutcomeSurfaceClassOptions): string {
  const palette =
    variant === "positive"
      ? "text-trade-yes-fg bg-trade-yes-bg hover:bg-trade-yes-hover-bg hover:text-white"
      : "text-trade-no-fg bg-trade-no-bg hover:bg-trade-no-hover-bg hover:text-white";

  const sizeClasses =
    size === "small"
      ? "py-1 px-2 text-[13px] leading-[19px]"
      : "p-2 text-sm leading-[24px]";

  return `${showProbabilityOnHover ? "group " : ""}inline-flex flex-1 items-center justify-center rounded-[7.2px] font-semibold transition-all duration-150 ${sizeClasses} ${palette} ${className}`.trim();
}
