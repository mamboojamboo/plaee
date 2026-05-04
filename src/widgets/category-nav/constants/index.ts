export type NavigationItem = {
  href: string;
  label: string;
  showTrendingIcon?: boolean;
};

export const CATEGORY_NAV_HOME_TITLE = "Polymarket Clone";

export const CATEGORY_NAV_ITEMS: NavigationItem[] = [
  { href: "/", label: "Trending", showTrendingIcon: true },
  { href: "/crypto", label: "Crypto" },
];
