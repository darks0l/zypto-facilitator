export const RPC = {
  8453: "https://mainnet.base.org",
  56: "https://bsc-dataseed.bnbchain.org",
  1: "https://eth.llamarpc.com",
  1399811149: "https://api.mainnet-beta.solana.com",
} as const

export type ChainId = keyof typeof RPC
