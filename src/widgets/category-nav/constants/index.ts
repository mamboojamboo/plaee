export type NavigationItem = {
  href: string;
  label: string;
  showTrendingIcon?: boolean;
};

export const CATEGORY_NAV_ITEMS: NavigationItem[] = [
  { href: "/", label: "Trending", showTrendingIcon: true },
  { href: "/crypto", label: "Crypto" },
];
