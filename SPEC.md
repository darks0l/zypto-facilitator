# SPEC.md — Zypto Facilitator

## 1. Concept & Vision

**Zypto Facilitator** is a free on-chain x402 micropayment facilitator for the Zypto ecosystem — the sister project to DARKSOL Facilitator. It verifies and settles EIP-3009 `transferWithAuthorization` payments across Zypto's multi-chain setup (Base, BNB, Ethereum). Zero fees, gas covered by Zypto. Dark-themed, brand-aligned, built to be a public utility that makes Zypto's crypto payment infrastructure feel alive and accessible.

Tagline: *"Gas-free payments. Zero friction. Built on Zypto."*

---

## 2. Design Language

**Aesthetic:** Dark, premium fintech. Think Stripe Docs meets crypto terminal — authoritative, clean, developer-forward but visually striking.

**Color Palette:**
- Background: `#050507` (near-black with a blue tint)
- Surface: `#0d0d14` (cards, elevated elements)
- Border: `#1a1a2e` (subtle separators)
- Primary: `#00D4AA` (Zypto mint green — for CTAs, highlights)
- Secondary: `#4F8EF7` (Zypto blue — links, accents)
- Accent: `#7B61FF` (purple — badges, special callouts)
- Text Primary: `#FFFFFF`
- Text Secondary: `#8B8B9E`
- Text Muted: `#4A4A5C`
- Success: `#00D4AA`
- Error: `#FF6B6B`
- Warning: `#FFB84D`

**Typography:**
- Headings: `Inter` (700/600) — clean, authoritative
- Body: `Inter` (400) — readable
- Monospace: `JetBrains Mono` — contract addresses, API examples, code

**Spatial System:**
- Base unit: 4px
- Section padding: 80px vertical
- Card padding: 24px
- Max content width: 1200px
- Border radius: 12px (cards), 8px (buttons), 4px (badges)

**Motion Philosophy:**
- Entrance: fade-up on scroll (opacity 0→1, translateY 20px→0, 500ms ease-out)
- Hover: scale(1.02) on cards, color shift on links
- Stats counters: animated number roll on load
- Chain status: pulsing green dot for "operational"

**Visual Assets:**
- Icon library: Lucide React (consistent, clean)
- Zypto "Z" arrow logo (extracted from brand page or SVG approximation)
- Chain logos: Base (orange lightning), BNB (yellow), Ethereum (purple)

---

## 3. Layout & Structure

```
Header (sticky, blur backdrop)
  Logo | Nav: Facilitator · Docs · API · Agent | GitHub link

Hero Section
  H1: "Pay Anyone. Pay Nothing."
  Sub: "Zypto's free x402 payment facilitator. We cover gas.
        Your users pay in USDC — you receive in full."
  CTA: "Read the Docs" + "Start Building"
  Live Stats Bar: settlements today | chains supported | total volume

Chains Section
  3-column grid: Base | BNB | Ethereum
  Each card: chain logo, name, status badge, contract address, pool type

How It Works
  3-step visual: Sign → Verify → Settle
  Each step: icon, title, description

Code Example Section
  Tabbed: cURL | JavaScript | Python
  Live example of a verify + settle flow

API Reference (collapsible)
  GET  /api/health
  POST /api/verify
  POST /api/settle

Tools Section (coming soon cards)
  • Zypto Pay SDK
  • Agent Skills
  • Dashboard

Footer
  Logo | Links | "Built by Zypto · Powered by x402"
  Legal: "Zypto Foundation governs $ZYPTO. Not available in restricted jurisdictions."
```

**Responsive:** Mobile-first. Single column on mobile, 2-col tablet, 3-col desktop.

---

## 4. Features & Interactions

### Header
- Sticky with `backdrop-filter: blur(12px)` + semi-transparent bg
- Logo links to home, nav links smooth-scroll or route to sections
- GitHub icon links to the repo

### Hero
- Animated headline (fade-in on load)
- Two CTAs: primary (mint green) + secondary (outline)
- Stats bar updates dynamically from /api/health

### Chain Cards
- Hover: lift shadow + border glow
- Status badge: pulsing green dot + "Operational"
- Contract address: monospace, truncated with copy button
- "View on Explorer" link icon

### How It Works
- Step cards with numbered badges
- Animated connector line between steps

### Code Examples
- Tabbed interface (no page reload)
- Syntax highlighted
- One-click copy button on code blocks

### API Reference
- Accordion/collapsible sections
- Request/response JSON with syntax highlighting
- "Try it out" button disabled (placeholder for future)

### Tools (Coming Soon)
- Disabled/alpha state cards
- "Coming Soon" badge overlay
- Email waitlist input (non-functional, UI only)

---

## 5. Component Inventory

### `<ChainCard>`
- States: operational, degraded, maintenance
- Shows: logo, name, status, chain selector ID, contract address, pool type
- Hover: border-color transitions to chain color

### `<ApiEndpoint>`
- Method badge (GET = blue, POST = green)
- Endpoint path in monospace
- Expandable: request/response schema
- Copy button on code examples

### `<StatBar>`
- Animated counters
- Icon + number + label
- Loads from API

### `<CodeBlock>`
- Language tab selector
- Syntax highlighting (Prism/shiki)
- Copy-to-clipboard button

### `<ToolCard>` (coming soon)
- Icon, title, description
- Disabled state with lock/warning icon
- "Coming Soon" badge

### `<Button>`
- Variants: primary (mint), secondary (outline), ghost
- States: default, hover, active, disabled

### `<Badge>`
- Status (operational = green, maintenance = yellow, down = red)
- Chain (Base = orange, BNB = yellow, ETH = purple)

---

## 6. Technical Approach

**Framework:** Next.js 14 (App Router)
**Styling:** Tailwind CSS v3
**Deployment:** Vercel (new project: `zypto-facilitator`)
**Repository:** GitHub `darks0l/zypto-facilitator`

### API Design

```
GET  /api/health
  → { service, version, protocol, fee, chains[], totals, endpoints, operator, website }

POST /api/verify
  Body: { chainId, token, from, to, value, validAfter, validBefore, nonce }
  → { valid: true, facilitator, chain } | { valid: false, reason }

POST /api/settle
  Body: { chainId, token, from, to, value, validAfter, validBefore, nonce, v, r, s }
  → { success: true, txHash, blockNumber, gasUsed, chain } | { success: false, error }
```

### Supported Chains

| Chain    | ID   | USDC Address                              | Facilitator Address                      | Pool Type   |
|----------|------|-------------------------------------------|------------------------------------------|-------------|
| Base     | 8453 | `0xde184c7228430cca03a4a5792234a6fc99728ef1` | `0x307933Cf4b8dA967A35bb8470D473b108F1b588E` | BurnMint    |
| BNB      | 56   | `0xb838fb4edc798D0D8Ff3B4e3CAA9FFE318c620B7` | `0xe3CE34766E8800d906B81E627efa82E2ACCd6634` | BurnMint    |
| Ethereum | 1    | `0x7A65CB87F596Caf31a4932f074c59c0592bE77D7` | `0x7F8189A226093f76AEc663C9C5bf8EEA9Ad0CB71` | LockRelease |

### Data Model
- Settlement counter + volume: in-memory at runtime (no persistence needed for v1)
- Health check: live on every request (read from chain)

### File Structure
```
/
├── app/
│   ├── layout.tsx          # Root layout with fonts, globals
│   ├── page.tsx            # Landing page (all sections)
│   ├── globals.css         # Tailwind + custom CSS vars
│   └── api/
│       └── health/route.ts
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ChainCard.tsx
│   ├── HowItWorks.tsx
│   ├── CodeExample.tsx
│   ├── ApiReference.tsx
│   ├── ToolsSection.tsx
│   └── Footer.tsx
├── lib/
│   └── chains.ts           # Chain configs, addresses, helpers
├── SKILL.md                # OpenClaw agent skill
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── vercel.json
```
