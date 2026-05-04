import React from "react";

import type { IconName } from "./icon-registry";
import { getIcon } from "./icon-registry";

export type IconButtonShape = "square" | "circle";

export type IconButtonSize = "sm" | "md";

const shapeClass: Record<IconButtonShape, string> = {
  square: "rounded-[7.2px]",
  circle: "rounded-full",
};

const sizeContainerClass: Record<IconButtonSize, string> = {
  sm: "size-7",
  md: "size-10",
};

const sizeIconPx: Record<IconButtonSize, number> = {
  sm: 16,
  md: 20,
};

export function iconSurfaceClass(
  shape: IconButtonShape,
  size: IconButtonSize,
  extra: string = "",
): string {
  return `inline-flex items-center justify-center cursor-pointer transition duration-150 text-foreground-muted bg-transparent hover:bg-white/5 border-0 p-0 m-0 ${shapeClass[shape]} ${sizeContainerClass[size]} ${extra}`.trim();
}

export type IconDisplayProps = {
  name: IconName;
  shape: IconButtonShape;
  size?: IconButtonSize;
  iconColor?: string;
  className?: string;
  "aria-label"?: string;
};

export const IconDisplay = ({
  name,
  shape,
  size = "sm",
  iconColor,
  className = "",
  "aria-label": ariaLabel,
}: IconDisplayProps) => {
  const accessibleLabel = ariaLabel?.trim();
  const iconPx = sizeIconPx[size];
  const iconEl = React.createElement(getIcon(name), {
    "aria-hidden": true,
    className: "shrink-0 opacity-80",
    size: iconPx,
    style: iconColor ? { color: iconColor, opacity: 1 } : undefined,
  });

  return (
    <span
      className={iconSurfaceClass(shape, size, className)}
      role={accessibleLabel ? "img" : undefined}
      aria-hidden={accessibleLabel ? undefined : true}
      aria-label={accessibleLabel}
    >
      {iconEl}
    </span>
  );
};

export { sizeIconPx };
