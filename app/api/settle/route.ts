import { NextRequest, NextResponse } from "next/server"
import { SUPPORTED_CHAIN_IDS } from "@/lib/chains"
import { stats } from "@/lib/stats"

export const runtime = "nodejs"

const SOLANA_CHAIN_ID = 1399811149

interface SolSettleBody {
  chainId: number
  from: string
  to: string
  value: string
  mint: string
  // Solana: just needs a base58 signature (64 bytes) for simulation
  signature?: string
}

interface EVMSettleBody {
  chainId: number
  token: string
  from: string
  to: string
  value: string
  validAfter: number
  validBefore: number
  nonce: string
  signature?: string
}

function isValidAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr)
}

function isValidBytes32(hex: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(hex)
}

function isBase58Address(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)
}

function randomHex(len: number): string {
  let result = "0x"
  for (let i = 0; i < len; i++) {
    result += Math.floor(Math.random() * 16).toString(16)
  }
  return result
}

function randomBase58(len: number): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  let result = ""
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function validateEVMSignature(signature: string | undefined) {
  if (!signature || typeof signature !== "string") {
    return { valid: false, error: "missing signature" }
  }
  if (!signature.startsWith("0x") || !isValidBytes32(signature)) {
    return { valid: false, error: "invalid signature format" }
  }
  const sigHex = signature.slice(2)
  if (sigHex.length !== 130) {
    return { valid: false, error: "signature must be 65 bytes (130 hex chars)" }
  }
  const v = parseInt(sigHex.slice(128, 130), 16)
  if (v !== 27 && v !== 28) {
    return { valid: false, error: "signature v must be 27 or 28" }
  }
  return { valid: true }
}

function validateSolanaSignature(sig: string | undefined) {
  if (!sig || typeof sig !== "string") {
    return { valid: false, error: "missing signature" }
  }
  // Solana signatures are 64 bytes, base58 encoded = 88-128 chars
  if (!isBase58Address(sig) || sig.length < 64 || sig.length > 128) {
    return { valid: false, error: "invalid Solana signature format (expected base58)" }
  }
  return { valid: true }
}

function updateStats(chainId: number, value: string) {
  const volume = Number(value) / 1e6
  if (stats[chainId]) {
    stats[chainId].settlements += 1
    stats[chainId].volumeUSDC += volume
  }
}

// GET — proxy to health for convenience
export async function GET() {
  return NextResponse.redirect(new URL("/api/health", "https://facilitator.zypto.com"))
}

// POST — handle both EVM (EIP-3009) and Solana (SPL) settlement
export async function POST(request: NextRequest) {
  try {
    let body: EVMSettleBody | SolSettleBody
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "invalid_params" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    const { chainId } = body

    // --- Solana settlement ---
    if (chainId === SOLANA_CHAIN_ID) {
      const solBody = body as SolSettleBody

      if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
        return NextResponse.json(
          { success: false, error: "unsupported_chain" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      if (!solBody.from || !isBase58Address(solBody.from)) {
        return NextResponse.json(
          { success: false, error: "invalid_sender" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      if (!solBody.to || !isBase58Address(solBody.to)) {
        return NextResponse.json(
          { success: false, error: "invalid_recipient" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      if (!solBody.value || isNaN(Number(solBody.value)) || Number(solBody.value) <= 0) {
        return NextResponse.json(
          { success: false, error: "invalid_amount" },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      const sigCheck = validateSolanaSignature(solBody.signature)
      if (!sigCheck.valid) {
        return NextResponse.json(
          { success: false, error: sigCheck.error },
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
        )
      }

      updateStats(chainId, solBody.value)

      return NextResponse.json(
        {
          success: true,
          // Simulated Solana tx — replace with real on-chain settlement
          signature: solBody.signature || randomBase58(88),
          slot: 290000000 + Math.floor(Math.random() * 5000000),
          chain: chainId,
          confirmations: "finalized",
          note: "Simulated — SPL settlement not yet wired to Solana program",
        },
        { headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    // --- EVM settlement (EIP-3009) ---
    const evmBody = body as EVMSettleBody

    if (!SUPPORTED_CHAIN_IDS.includes(chainId) || chainId === SOLANA_CHAIN_ID) {
      return NextResponse.json(
        { success: false, error: "unsupported_chain" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (!evmBody.from || !isValidAddress(evmBody.from)) {
      return NextResponse.json(
        { success: false, error: "invalid_address" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    if (!evmBody.to || !isValidAddress(evmBody.to)) {
      return NextResponse.json(
        { success: false, error: "invalid_address" },
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
        { success: false, error: "invalid_params" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    const sigCheck = validateEVMSignature(evmBody.signature)
    if (!sigCheck.valid) {
      return NextResponse.json(
        { success: false, error: sigCheck.error },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      )
    }

    updateStats(chainId, evmBody.value)

    return NextResponse.json(
      {
        success: true,
        txHash: randomHex(64),
        blockNumber: 19100000 + Math.floor(Math.random() * 100000),
        gasUsed: "85000",
        chain: chainId,
        note: "Simulated — contract not yet deployed",
      },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    )
  } catch (err) {
    console.error("[settle] unexpected error:", err)
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
