export type Outcome = {
  id: string;
  name: string;
  price: number;
  probability: number;
  volume?: number;
};

export type Market = {
  id: string;
  question: string;
  groupItemTitle?: string;
  outcomes: Outcome[];
  volume: number;
  liquidity: number;
  createdAt: string;
  resolutionDate: string;
  clobTokenIds?: string[];
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  isNew?: boolean;
  featured?: boolean;
  fpmmLive?: boolean;
};
