"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp } from "lucide-react";

type CategoryNavItemProps = {
  href: string;
  label: string;
  showTrendingIcon?: boolean;
};

export function CategoryNavItem({
  href,
  label,
  showTrendingIcon = false,
}: CategoryNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`inline-flex h-12 shrink-0 items-center px-3 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 rounded-sm hover:text-white ${
        isActive ? "text-white" : "text-foreground-muted"
      }`}
    >
      {showTrendingIcon ? (
        <span className="inline-flex items-center gap-1.5">
          <TrendingUp size={18} />
          {label}
        </span>
      ) : (
        label
      )}
    </Link>
  );
}
