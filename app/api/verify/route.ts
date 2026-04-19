import { NextRequest, NextResponse } from "next/server"
import { CHAINS, SUPPORTED_CHAIN_IDS } from "@/lib/chains"

export const runtime = "nodejs"

const SOLANA_CHAIN_ID = 1399811149

interface SolVerifyBody {
  chainId: number
  from: string
  to: string
  value: string
  mint: string
  signature?: string
}

interface EVMVerifyBody {
  chainId: number
  token: string
  from: string
  to: string
  value: string
  validAfter: number
  validBefore: number
  nonce: string
}

function isValidAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr)
}

function isBase58Address(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)
}

export async function POST(request: NextRequest) {
  try {
    let body: EVMVerifyBody | SolVerifyBody
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { valid: false, error: "invalid_params", reason: "missing or malformed JSON body" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    const { chainId } = body

    // --- Solana verify ---
    if (chainId === SOLANA_CHAIN_ID) {
      const solBody = body as SolVerifyBody

      if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
        return NextResponse.json(
          { valid: false, error: "unsupported_chain", reason: `chainId ${chainId} not supported` },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      if (!solBody.from || !isBase58Address(solBody.from)) {
        return NextResponse.json(
          { valid: false, error: "invalid_address", reason: "invalid sender address" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      if (!solBody.to || !isBase58Address(solBody.to)) {
        return NextResponse.json(
          { valid: false, error: "invalid_address", reason: "invalid recipient address" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      if (!solBody.value || isNaN(Number(solBody.value)) || Number(solBody.value) <= 0) {
        return NextResponse.json(
          { valid: false, error: "invalid_amount", reason: "value must be a positive number" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      // Solana: mint address check
      const chain = CHAINS["solana"]
      if (solBody.mint && solBody.mint !== chain.usdc) {
        return NextResponse.json(
          { valid: false, error: "unsupported_token", reason: "only USDC on Solana is supported" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      return NextResponse.json(
        {
          valid: true,
          facilitator: chain.pool,
          chain: chainId,
          protocol: "spl",
          note: "Off-chain validation only — on-chain verification requires Solana RPC",
        },
        { headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    // --- EVM verify (EIP-3009) ---
    const evmBody = body as EVMVerifyBody
    const now = Math.floor(Date.now() / 1000)

    if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
      return NextResponse.json(
        { valid: false, error: "unsupported_chain", reason: `chainId ${chainId} not supported` },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    const chainKey = Object.keys(CHAINS).find(
      (k) => CHAINS[k as keyof typeof CHAINS].id === chainId,
    ) as keyof typeof CHAINS | undefined
    const chain = chainKey ? CHAINS[chainKey] : null
    if (!chain) {
      return NextResponse.json(
        { valid: false, error: "unsupported_chain", reason: `chain ${chainId} not found` },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (!evmBody.token || evmBody.token.toLowerCase() !== chain.usdc.toLowerCase()) {
      return NextResponse.json(
        {
          valid: false,
          error: "unsupported_token",
          reason: `token does not match expected USDC for chain ${chainId}`,
        },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (!evmBody.from || !isValidAddress(evmBody.from)) {
      return NextResponse.json(
        { valid: false, error: "invalid_address", reason: "invalid address: from" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (!evmBody.to || !isValidAddress(evmBody.to)) {
      return NextResponse.json(
        { valid: false, error: "invalid_address", reason: "invalid address: to" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (
      !evmBody.value ||
      typeof evmBody.value !== "string" ||
      isNaN(Number(evmBody.value)) ||
      Number(evmBody.value) <= 0
    ) {
      return NextResponse.json(
        {
          valid: false,
          error: "invalid_params",
          reason: "value must be a positive numeric string",
        },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (evmBody.validAfter === undefined || typeof evmBody.validAfter !== "number") {
      return NextResponse.json(
        {
          valid: false,
          error: "invalid_params",
          reason: "validAfter is required as a unix timestamp",
        },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (evmBody.validBefore === undefined || typeof evmBody.validBefore !== "number") {
      return NextResponse.json(
        {
          valid: false,
          error: "invalid_params",
          reason: "validBefore is required as a unix timestamp",
        },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (evmBody.validBefore <= evmBody.validAfter) {
      return NextResponse.json(
        {
          valid: false,
          error: "invalid_params",
          reason: "validBefore must be greater than validAfter",
        },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (evmBody.validBefore <= now) {
      return NextResponse.json(
        { valid: false, error: "expired", reason: "validBefore timestamp has passed" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (evmBody.validAfter > now) {
      return NextResponse.json(
        { valid: false, error: "not_yet_valid", reason: "transfer is not yet valid" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (!evmBody.nonce || typeof evmBody.nonce !== "string") {
      return NextResponse.json(
        { valid: false, error: "invalid_params", reason: "nonce is required as a string" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    return NextResponse.json(
      { valid: true, facilitator: chain.pool, chain: chainId },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    )
  } catch (err) {
    console.error("[verify] unexpected error:", err)
    return NextResponse.json(
      { valid: false, error: "internal_error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
