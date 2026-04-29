import { LayoutGrid } from "lucide-react";
import type { CryptoSidebarGroups } from "@/src/features/crypto-feed";
import { CryptoSidebarItem } from "./CryptoSidebarItem";
import { assetIcon, timeframeIconForSlug } from "./icons";

type CryptoSidebarProps = {
  groups: CryptoSidebarGroups;
  activeSubSlug: string | null;
};

export function CryptoSidebar({ groups, activeSubSlug }: CryptoSidebarProps) {
  const AssetIcon = assetIcon();

  return (
    <aside className="hidden w-[190px] shrink-0 lg:block">
      <nav className="sticky top-16 space-y-0.5">
        <CryptoSidebarItem
          href="/crypto"
          label="All"
          count={groups.allCount}
          active={activeSubSlug === null}
          Icon={LayoutGrid}
        />

        {groups.timeframes.map((row) => (
          <CryptoSidebarItem
            key={row.slug}
            href={`/crypto/${encodeURIComponent(row.slug)}`}
            label={row.label}
            count={row.count}
            active={
              activeSubSlug !== null &&
              activeSubSlug.toLowerCase() === row.slug.toLowerCase()
            }
            Icon={timeframeIconForSlug(row.slug)}
          />
        ))}

        <div className="my-2 border-t border-border/60" aria-hidden />

        {groups.assets.map((row) => (
          <CryptoSidebarItem
            key={row.slug}
            href={`/crypto/${encodeURIComponent(row.slug)}`}
            label={row.label}
            count={row.count}
            active={
              activeSubSlug !== null &&
              activeSubSlug.toLowerCase() === row.slug.toLowerCase()
            }
            Icon={AssetIcon}
          />
        ))}
      </nav>
    </aside>
  );
}
