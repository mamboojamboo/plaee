import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type CryptoSidebarItemProps = {
  href: string;
  label: string;
  count: number;
  active: boolean;
  Icon: LucideIcon;
};

export const CryptoSidebarItem = ({
  href,
  label,
  count,
  active,
  Icon,
}: CryptoSidebarItemProps) => {
  return (
    <Link
      href={href}
      className={
        active
          ? "flex items-center gap-2 rounded-lg bg-surface-card p-3 text-sm font-medium text-foreground"
          : "flex items-center gap-2 rounded-lg p-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-card/60 hover:text-foreground"
      }
    >
      <Icon className="size-5 shrink-0 opacity-90 text-foreground-muted" aria-hidden />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="shrink-0 tabular-nums text-[13px] text-foreground-muted">
        {count}
      </span>
    </Link>
  );
};
