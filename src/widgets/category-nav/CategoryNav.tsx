import { CATEGORY_NAV_ITEMS } from "./constants";
import { CategoryNavItem } from "./CategoryNavItem";

export const CategoryNav = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center gap-1 py-3">
        <div className="flex h-12 min-w-0 flex-1 items-center space-x-1 overflow-x-auto scrollbar-hide">
          {CATEGORY_NAV_ITEMS.map((item) => (
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
};
