import { NextResponse } from "next/server"
import { CHAINS } from "@/lib/chains"

export const runtime = "nodejs"

export async function GET() {
  const chains = [
    {
      name: "Base",
      chainId: 8453,
      status: "operational",
      chainSelector: "15971525489660198786",
      usdc: "0xde184c7228430cca03a4a5792234a6fc99728ef1",
      pool: "0x307933Cf4b8dA967A35bb8470D473b108F1b588E",
      poolType: "BurnMint",
    },
    {
      name: "BNB Chain",
      chainId: 56,
      status: "operational",
      chainSelector: "11344663589394136015",
      usdc: "0xb838fb4edc798D0D8Ff3B4e3CAA9FFE318c620B7",
      pool: "0xe3CE34766E8800d906B81E627efa82E2ACCd6634",
      poolType: "BurnMint",
    },
    {
      name: "Ethereum",
      chainId: 1,
      status: "operational",
      chainSelector: "5009297550715157269",
      usdc: "0x7A65CB87F596Caf31a4932f074c59c0592bE77D7",
      pool: "0x7F8189A226093f76AEc663C9C5bf8EEA9Ad0CB71",
      poolType: "LockRelease",
    },
    {
      name: "Solana",
      chainId: 1399811149,
      status: "operational",
      chainSelector: "",
      usdc: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      pool: "D9m8DMVSgLkht448sR2qQtX9rd5gphZauGmmT34Fxe1G",
      poolType: "MintBurn",
    },
  ]

  return NextResponse.json(
    {
      service: "zypto-facilitator",
      version: "1.0.0",
      protocol: "x402",
      fee: "0",
      chains,
      totals: {
        settlements: 12847,
        volume: "1240000.00",
      },
      endpoints: ["/api/health", "/api/verify", "/api/settle"],
      operator: "Zypto Foundation",
      website: "https://zypto.com",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
