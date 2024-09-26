export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    nameid: string;
    rank: number;
    price_usd: string;
    percent_change_24h: string;
    percent_change_7d: string;
    market_cap_usd: string;
    volume24: string;
    volume24a: string;
    csupply: string;
    tsupply: string;
    msupply: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: string;
  }