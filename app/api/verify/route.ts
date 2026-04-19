import { NextRequest, NextResponse } from 'next/server'
import { CHAINS, SUPPORTED_CHAIN_IDS } from '@/lib/chains'

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
}

function isValidAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr)
}

export async function POST(request: NextRequest) {
  try {
    let body: EIP3009Body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { valid: false, error: 'invalid_params', reason: 'missing or malformed JSON body' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    const { chainId, token, from, to, value, validAfter, validBefore, nonce } = body
    const now = Math.floor(Date.now() / 1000)

    // chainId: required, must be supported
    if (chainId === undefined || !SUPPORTED_CHAIN_IDS.includes(chainId)) {
      return NextResponse.json(
        { valid: false, error: 'unsupported_chain', reason: `chainId ${chainId} not supported` },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    const chainKey = Object.keys(CHAINS).find(
      k => CHAINS[k as keyof typeof CHAINS].id === chainId
    ) as keyof typeof CHAINS | undefined
    const chain = chainKey ? CHAINS[chainKey] : null
    if (!chain) {
      return NextResponse.json(
        { valid: false, error: 'unsupported_chain', reason: `chain ${chainId} not found` },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    // token: required, must match expected USDC for chain
    if (!token || token.toLowerCase() !== chain.usdc.toLowerCase()) {
      return NextResponse.json(
        { valid: false, error: 'unsupported_token', reason: `token does not match expected USDC for chain ${chainId}` },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    // from/to: required, valid Ethereum address
    if (!from || !isValidAddress(from)) {
      return NextResponse.json(
        { valid: false, error: 'invalid_address', reason: 'invalid address: from' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }
    if (!to || !isValidAddress(to)) {
      return NextResponse.json(
        { valid: false, error: 'invalid_address', reason: 'invalid address: to' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    // value: required, string of numeric value
    if (!value || typeof value !== 'string' || isNaN(Number(value)) || Number(value) <= 0) {
      return NextResponse.json(
        { valid: false, error: 'invalid_params', reason: 'value must be a positive numeric string' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    // validAfter: required, number
    if (validAfter === undefined || typeof validAfter !== 'number') {
      return NextResponse.json(
        { valid: false, error: 'invalid_params', reason: 'validAfter is required as a unix timestamp' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    // validBefore: required, must be > validAfter, must be > now
    if (validBefore === undefined || typeof validBefore !== 'number') {
      return NextResponse.json(
        { valid: false, error: 'invalid_params', reason: 'validBefore is required as a unix timestamp' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }
    if (validBefore <= validAfter) {
      return NextResponse.json(
        { valid: false, error: 'invalid_params', reason: 'validBefore must be greater than validAfter' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }
    if (validBefore <= now) {
      return NextResponse.json(
        { valid: false, error: 'expired', reason: 'validBefore timestamp has passed' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    // not_yet_valid
    if (validAfter > now) {
      return NextResponse.json(
        { valid: false, error: 'not_yet_valid', reason: 'transfer is not yet valid' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    // nonce: required, string
    if (!nonce || typeof nonce !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'invalid_params', reason: 'nonce is required as a string' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    return NextResponse.json(
      { valid: true, facilitator: chain.pool, chain: chainId },
      { headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  } catch (err) {
    console.error('[verify] unexpected error:', err)
    return NextResponse.json(
      { valid: false, error: 'internal_error' },
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
