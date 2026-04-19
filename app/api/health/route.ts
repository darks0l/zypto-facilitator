import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json(
    {
      service: "zypto-facilitator",
      version: "1.0.0",
      protocol: "x402",
      fee: "0",
      chains: [
        { name: "Base", chainId: 8453, status: "operational" },
        { name: "BNB Chain", chainId: 56, status: "operational" },
        { name: "Ethereum", chainId: 1, status: "operational" },
        { name: "Solana", chainId: 1399811149, status: "operational" },
      ],
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
