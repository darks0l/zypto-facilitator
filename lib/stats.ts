// In-memory stats (v1, no persistence — resets on cold start)
export const stats: Record<number, { settlements: number; volumeUSDC: number }> = {
  8453: { settlements: 0, volumeUSDC: 0 },
  56: { settlements: 0, volumeUSDC: 0 },
  1: { settlements: 0, volumeUSDC: 0 },
  1399811149: { settlements: 0, volumeUSDC: 0 }, // Solana
}
