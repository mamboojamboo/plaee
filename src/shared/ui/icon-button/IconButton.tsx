"use client";

import React from "react";

import type { IconName } from "./icon-registry";
import { getIcon } from "./icon-registry";
import {
  IconDisplay,
  iconSurfaceClass,
  sizeIconPx,
  type IconButtonShape,
  type IconButtonSize,
} from "./IconDisplay";

export type { IconButtonShape, IconButtonSize };

type IconButtonProps = {
  name: IconName;
  shape: IconButtonShape;
  size?: IconButtonSize;
  iconColor?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  "aria-label"?: string;
};

export const IconButton = ({
  name,
  shape,
  size = "sm",
  iconColor,
  onClick,
  className = "",
  "aria-label": ariaLabel,
}: IconButtonProps) => {
  if (!onClick) {
    return (
      <IconDisplay
        name={name}
        shape={shape}
        size={size}
        iconColor={iconColor}
        className={className}
        aria-label={ariaLabel}
      />
    );
  }

  const iconPx = sizeIconPx[size];
  const iconEl = React.createElement(getIcon(name), {
    "aria-hidden": true,
    className: "shrink-0 opacity-80",
    size: iconPx,
    style: iconColor ? { color: iconColor, opacity: 1 } : undefined,
  });

  return (
    <button
      type="button"
      className={iconSurfaceClass(shape, size, className)}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {iconEl}
    </button>
  );
};
