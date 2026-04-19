export interface ChainConfig {
  name: string;
  id: number;
  chainSelector: string;
  usdc: string;
  pool: string;
  poolType: "BurnMint" | "LockRelease";
  explorer: string;
  explorerName: string;
  color: string;
  emoji: string;
}

export const CHAINS: Record<string, ChainConfig> = {
  base: {
    name: "Base",
    id: 8453,
    chainSelector: "15971525489660198786",
    usdc: "0xde184c7228430cca03a4a5792234a6fc99728ef1",
    pool: "0x307933Cf4b8dA967A35bb8470D473b108F1b588E",
    poolType: "BurnMint",
    explorer: "https://basescan.org",
    explorerName: "Basescan",
    color: "#0052FF",
    emoji: "🔵",
  },
  bnb: {
    name: "BNB Chain",
    id: 56,
    chainSelector: "11344663589394136015",
    usdc: "0xb838fb4edc798D0D8Ff3B4e3CAA9FFE318c620B7",
    pool: "0xe3CE34766E8800d906B81E627efa82E2ACCd6634",
    poolType: "BurnMint",
    explorer: "https://bscscan.com",
    explorerName: "BscScan",
    color: "#F0B90B",
    emoji: "🟡",
  },
  ethereum: {
    name: "Ethereum",
    id: 1,
    chainSelector: "5009297550715157269",
    usdc: "0x7A65CB87F596Caf31a4932f074c59c0592bE77D7",
    pool: "0x7F8189A226093f76AEc663C9C5bf8EEA9Ad0CB71",
    poolType: "LockRelease",
    explorer: "https://etherscan.io",
    explorerName: "Etherscan",
    color: "#8B61FF",
    emoji: "🟣",
  },
};

export const SUPPORTED_CHAIN_IDS = [8453, 56, 1];

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
