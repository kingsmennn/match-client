import { CoinPayment } from "~/types";

export const HEDERA_JSON_RPC = {
  mainnet: "https://mainnet.hashio.io/api",
  testnet: "https://testnet.hashio.io/api",
};
export const LOCATION_DECIMALS = 18;
export const PROJECT_ID = "73801621aec60dfaa2197c7640c15858";
export const DEBUG = true;
export const appMetaData = {
  name: "Finder",
  description:
    "Finder is a blockchain application that allows buyers to find the best deals on products they want to buy.",
  icons: [window.location.origin + "/favicon.ico"],
  url: window.location.origin,
};

export const PAYMENT_COIN = "HBAR";
export const tokens: {
  name: string;
  symbol: string;
  network?: string;
  logo: string;
}[] = [
  {
    name: "HBAR",
    symbol: CoinPayment.HBAR,
    logo: "https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=035",
  },
  {
    name: "USDC",
    symbol: CoinPayment.USDC,
    network: "hbar",
    logo: "https://www.svgrepo.com/show/428625/usdc-usd-coin.svg",
  },
];
