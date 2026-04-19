# SPEC.md — Zypto Facilitator

## 1. Concept & Vision

**Zypto Facilitator** is a free on-chain x402 micropayment facilitator for the Zypto ecosystem. It verifies and settles EIP-3009 `transferWithAuthorization` payments on EVM chains (Base, BNB, Ethereum) and SPL token transfers on Solana. Zero fees, gas covered by Zypto. Dark-themed, brand-aligned, built to be a public utility.

Tagline: *"Gas-free payments. Zero friction. Built on Zypto."*

---

## 2. Design Language

**Aesthetic:** Dark, premium fintech. Stripe Docs meets crypto terminal — authoritative, clean, developer-forward but visually striking.

**Color Palette:**
- Background: `#050507` | Surface: `#0d0d14` | Border: `#1a1a2e`
- Primary: `#00D4AA` (Zypto mint green) | Secondary: `#4F8EF7` (Zypto blue) | Accent: `#7B61FF` (purple)
- Text Primary: `#FFFFFF` | Text Secondary: `#8B8B9E` | Text Muted: `#4A4A5C`
- Success: `#00D4AA` | Error: `#FF6B6B` | Warning: `#FFB84D`

**Typography:** Inter (headings/body), JetBrains Mono (code/addresses)

**Visual Assets:** Lucide React icons, Zypto logo (public/zypto-logo.png), chain emoji

---

## 3. Layout & Structure

```
Header (sticky, blur backdrop) — Zypto logo + nav + GitHub
Hero — H1 "Pay Anyone. Pay Nothing." + CTAs + live stats bar
Chains — 4-column grid: Base | BNB | Ethereum | Solana
How It Works — 3-step: Sign → Verify → Settle
Code Examples — tabbed: cURL | JS | Python | Solana
API Reference — accordion: health, verify, settle(EVM), settle(Solana)
Tools (coming soon) — Pay SDK, Agent Skills, Dashboard
Footer — logo, links, legal
```

**Responsive:** Mobile-first. 1-col mobile → 2-col tablet → 4-col desktop.

---

## 4. Features & Interactions

- Sticky header with blur backdrop, mobile hamburger menu
- Hero stats loaded client-side from `/api/health`
- Chain cards: hover lift, copy button, explorer links, status badge
- Code tabs: cURL / JS / Python / Solana, syntax highlighted, copy button
- API accordion: expandable request/response with syntax highlighting
- Solana-specific handling: no CCIP chain selector, base58 addresses, MintBurn pool type

---

## 5. Component Inventory

| Component | States |
|-----------|--------|
| `<ChainCard>` | operational (green pulse), hover (border glow) |
| `<Header>` | desktop nav, mobile collapsed/expanded |
| `<Hero>` | loading skeleton, live data from API |
| `<CodeExample>` | 4 tabs (cURL/JS/Python/Solana), copy state |
| `<ApiReference>` | accordion, open/closed |
| `<HowItWorks>` | static 3-step |
| `<ToolsSection>` | coming soon cards (disabled) |
| `<Footer>` | static |

---

## 6. Technical Approach

**Framework:** Next.js 14 (App Router) | **Styling:** Tailwind CSS v3 | **Deployment:** Vercel

### Supported Chains

| Chain     | ID          | USDC Address                                  | Pool Address / PDA                          | Pool Type    |
|-----------|-------------|----------------------------------------------|--------------------------------------------|--------------|
| Base      | 8453        | `0xde184c7228430cca03a4a5792234a6fc99728ef1` | `0x307933Cf4b8dA967A35bb8470D473b108F1b588E` | BurnMint     |
| BNB       | 56          | `0xb838fb4edc798D0D8Ff3B4e3CAA9FFE318c620B7` | `0xe3CE34766E8800d906B81E627efa82E2ACCd6634` | BurnMint     |
| Ethereum  | 1           | `0x7A65CB87F596Caf31a4932f074c59c0592bE77D7` | `0x7F8189A226093f76AEc663C9C5bf8EEA9Ad0CB71` | LockRelease  |
| Solana    | 1399811149  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | `D9m8DMVSgLkht448sR2qQtX9rd5gphZauGmmT34Fxe1G` | MintBurn     |

### API Design

```
GET  /api/health
  → { service, version, protocol, fee, chains[], totals, endpoints }

POST /api/verify
  EVM: { chainId, token, from, to, value, validAfter, validBefore, nonce }
  SOL: { chainId, from, to, value, mint }
  → { valid: true, facilitator, chain } | { valid: false, error, reason }

POST /api/settle
  EVM: { chainId, token, from, to, value, validAfter, validBefore, nonce, signature }
  SOL: { chainId, from, to, value, mint, signature }
  → { success: true, txHash/signature, blockNumber/slot, gasUsed, chain }
```

### File Structure

```
/
├── public/
│   └── zypto-logo.png        # Official Zypto logo (neon green "Z" with arrows)
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── health/route.ts   # GET — health + stats
│       ├── verify/route.ts   # POST — EVM EIP-3009 + Solana SPL verify
│       └── settle/route.ts   # POST — EVM + Solana settlement (simulated)
├── components/
│   ├── Header.tsx, Hero.tsx, Footer.tsx
│   ├── ChainCard.tsx         # handles EVM + Solana
│   ├── HowItWorks.tsx
│   ├── CodeExample.tsx       # cURL/JS/Python/Solana tabs
│   ├── ApiReference.tsx      # all 4 endpoints
│   └── ToolsSection.tsx
├── lib/
│   ├── chains.ts             # Chain configs (Base/BNB/ETH/Solana)
│   ├── rpc.ts                # RPC endpoints per chain
│   └── stats.ts              # In-memory settlement stats
├── package.json, tailwind.config.ts, next.config.mjs, vercel.json
└── SKILL.md                  # ~/.openclaw/skills/zypto-facilitator/SKILL.md
```
