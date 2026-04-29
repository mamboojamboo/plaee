import { CategoryNavItem } from "./CategoryNavItem";

type NavigationItem = {
  href: string;
  label: string;
  showTrendingIcon?: boolean;
};

const NAV_ITEMS: NavigationItem[] = [
  { href: "/", label: "Trending", showTrendingIcon: true },
  { href: "/crypto", label: "Crypto" },
];

export function CategoryNav() {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center gap-1 py-3">
        <div className="flex h-12 min-w-0 flex-1 items-center space-x-1 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <CategoryNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              showTrendingIcon={item.showTrendingIcon}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
