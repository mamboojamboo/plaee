import React from "react";

import type { BadgeName } from "./badge-registry";
import { badgeRegistry } from "./badge-registry";

type BadgeProps = {
  name: BadgeName;
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ name, className = "" }) => {
  const def = badgeRegistry[name];
  const Icon = def.icon;

  return (
    <span className={`${def.rootClassName} ${className}`.trim()}>
      <Icon
        {...def.iconProps}
        className={def.iconClassName}
        size={def.iconSize}
        aria-hidden
      />
      {def.label}
    </span>
  );
};
