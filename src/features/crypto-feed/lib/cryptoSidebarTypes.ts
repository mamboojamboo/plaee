export type CryptoSidebarRow = {
  slug: string;
  label: string;
  count: number;
};

export type CryptoSidebarGroups = {
  allCount: number;
  timeframes: CryptoSidebarRow[];
  assets: CryptoSidebarRow[];
};
