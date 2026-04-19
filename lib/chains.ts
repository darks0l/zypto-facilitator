export interface ChainConfig {
  name: string
  id: number
  /** Official USDC token address on this chain (Circle) */
  usdc: string
  explorer: string
  explorerName: string
  color: string
  emoji: string
}

export const CHAINS: Record<string, ChainConfig> = {
  base: {
    name: "Base",
    id: 8453,
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    explorer: "https://basescan.org",
    explorerName: "Basescan",
    color: "#0052FF",
    emoji: "🔵",
  },
  bnb: {
    name: "BNB Chain",
    id: 56,
    usdc: "",
    explorer: "https://bscscan.com",
    explorerName: "BscScan",
    color: "#F0B90B",
    emoji: "🟡",
  },
  ethereum: {
    name: "Ethereum",
    id: 1,
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    explorer: "https://etherscan.io",
    explorerName: "Etherscan",
    color: "#8B61FF",
    emoji: "🟣",
  },
  solana: {
    name: "Solana",
    id: 1399811149,
    usdc: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    explorer: "https://solscan.io",
    explorerName: "Solscan",
    color: "#00FFA3",
    emoji: "🟢",
  },
}

export const SUPPORTED_CHAIN_IDS = [8453, 56, 1, 1399811149]
