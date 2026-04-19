import { NextRequest, NextResponse } from 'next/server'
import { CHAINS, SUPPORTED_CHAIN_IDS } from '@/lib/chains'
import { stats } from '@/lib/stats'

export const runtime = 'nodejs'

interface EIP3009Body {
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

function randomHex(len: number): string {
  let result = '0x'
  for (let i = 0; i < len; i++) {
    result += Math.floor(Math.random() * 16).toString(16)
  }
  return result
}

function findChainById(chainId: number) {
  return Object.values(CHAINS).find(c => c.id === chainId) ?? null
}

function validateParams(body: EIP3009Body) {
  const { chainId, token, from, to, value, validAfter, validBefore, nonce } = body
  const now = Math.floor(Date.now() / 1000)

  if (chainId === undefined || !SUPPORTED_CHAIN_IDS.includes(chainId)) {
    return { valid: false, error: 'unsupported_chain', status: 400 }
  }

  const chain = findChainById(chainId)
  if (!chain) {
    return { valid: false, error: 'unsupported_chain', status: 400 }
  }

  if (!token || token.toLowerCase() !== chain.usdc.toLowerCase()) {
    return { valid: false, error: 'unsupported_token', status: 400 }
  }

  if (!from || !isValidAddress(from)) {
    return { valid: false, error: 'invalid_address', status: 400 }
  }
  if (!to || !isValidAddress(to)) {
    return { valid: false, error: 'invalid_address', status: 400 }
  }

  if (!value || typeof value !== 'string' || isNaN(Number(value)) || Number(value) <= 0) {
    return { valid: false, error: 'invalid_params', status: 400 }
  }

  if (validAfter === undefined || typeof validAfter !== 'number') {
    return { valid: false, error: 'invalid_params', status: 400 }
  }
  if (validBefore === undefined || typeof validBefore !== 'number') {
    return { valid: false, error: 'invalid_params', status: 400 }
  }
  if (validBefore <= validAfter) {
    return { valid: false, error: 'invalid_params', status: 400 }
  }
  if (validBefore <= now) {
    return { valid: false, error: 'expired', status: 400 }
  }
  if (validAfter > now) {
    return { valid: false, error: 'not_yet_valid', status: 400 }
  }

  if (!nonce || typeof nonce !== 'string') {
    return { valid: false, error: 'invalid_params', status: 400 }
  }

  return { valid: true, chain }
}

function validateSignature(signature: string | undefined) {
  if (!signature || typeof signature !== 'string') {
    return { valid: false, error: 'missing signature' }
  }

  if (!signature.startsWith('0x') || !isValidBytes32(signature)) {
    return { valid: false, error: 'invalid signature format' }
  }

  const sigHex = signature.slice(2)
  if (sigHex.length !== 130) {
    return { valid: false, error: 'signature must be 65 bytes (130 hex chars)' }
  }

  const v = parseInt(sigHex.slice(128, 130), 16)
  if (v !== 27 && v !== 28) {
    return { valid: false, error: 'signature v must be 27 or 28' }
  }

  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    let body: EIP3009Body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'invalid_params' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    const paramCheck = validateParams(body)
    if (!paramCheck.valid) {
      return NextResponse.json(
        { success: false, error: paramCheck.error },
        { status: paramCheck.status, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    const sigCheck = validateSignature(body.signature)
    if (!sigCheck.valid) {
      return NextResponse.json(
        { success: false, error: sigCheck.error },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    const { chainId } = body

    // Update in-memory stats
    const volume = Number(body.value) / 1e6
    if (stats[chainId]) {
      stats[chainId].settlements += 1
      stats[chainId].volumeUSDC += volume
    }

    return NextResponse.json(
      {
        success: true,
        txHash: randomHex(64),
        blockNumber: 19100000 + Math.floor(Math.random() * 100000),
        gasUsed: '85000',
        chain: chainId,
        note: 'Simulated — contract not yet deployed',
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  } catch (err) {
    console.error('[settle] unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'internal_error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
