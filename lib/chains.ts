export interface ChainConfig {
  name: string
  id: number
  explorer: string
  explorerName: string
  color: string
  emoji: string
}

export const CHAINS: Record<string, ChainConfig> = {
  base: {
    name: "Base",
    id: 8453,
    explorer: "https://basescan.org",
    explorerName: "Basescan",
    color: "#0052FF",
    emoji: "🔵",
  },
  bnb: {
    name: "BNB Chain",
    id: 56,
    explorer: "https://bscscan.com",
    explorerName: "BscScan",
    color: "#F0B90B",
    emoji: "🟡",
  },
  ethereum: {
    name: "Ethereum",
    id: 1,
    explorer: "https://etherscan.io",
    explorerName: "Etherscan",
    color: "#8B61FF",
    emoji: "🟣",
  },
  solana: {
    name: "Solana",
    id: 1399811149,
    explorer: "https://solscan.io",
    explorerName: "Solscan",
    color: "#00FFA3",
    emoji: "🟢",
  },
}

export const SUPPORTED_CHAIN_IDS = [8453, 56, 1, 1399811149]
