"use client";

import { useState } from "react";
import { BookOpen, Zap, Shield, Users, ChevronDown } from "lucide-react";

const concepts = [
  {
    icon: BookOpen,
    title: "What is x402?",
    content:
      "x402 is an HTTP protocol extension that lets servers request payments alongside any API response. Instead of credit cards or Stripe, a resource server attaches a payment nonce to a 402 response — the client signs a payment token and sends it back. It's a web-native invoice that resolves automatically.",
  },
  {
    icon: Zap,
    title: "How Zypto Fits In",
    content:
      "Zypto handles the settlement layer. When a client signs a payment, Zypto verifies the authorization, executes the on-chain transfer, and delivers the resource — all without the resource server touching crypto infrastructure. You set a price, Zypto covers gas, you receive USDC in full.",
  },
  {
    icon: Shield,
    title: "EIP-3009 on EVM",
    content:
      "EVM chains use EIP-3009 (transferWithAuthorization) for gas-less, pull-based payments. The client signs a message authorizing a transfer — no transaction fee for them. Zypto submits the on-chain transaction and covers gas. The authorization includes a window (validAfter / validBefore) and a nonce to prevent replay.",
  },
  {
    icon: Users,
    title: "SPL on Solana",
    content:
      "Solana uses SPL token transfers. The client signs a message authorizing the token transfer — similar in spirit to EIP-3009 but using Solana's native signature scheme. Zypto verifies the signature and settles via the Solana program. No EVM, no gas for the client.",
  },
];

const faqs = [
  {
    q: "Who pays the gas fees?",
    a: "Zypto does. Every settlement is gas-free for the client. The facilitator covers the transaction fee on-chain.",
  },
  {
    q: "How much does Zypto charge?",
    a: "Zero. No fees, no subscriptions, no hidden cuts. The facilitator is free to use forever.",
  },
  {
    q: "What chains are supported?",
    a: "Base, BNB Chain, Ethereum, and Solana. USDC on each chain is settled natively — no bridging, no wrapping.",
  },
  {
    q: "What happens when the contracts deploy?",
    a: "The facilitator is currently in simulated mode. Real on-chain settlements go live once the contracts are deployed and verified.",
  },
  {
    q: "Can I use this in an AI agent?",
    a: "Yes. AI agents can sign EIP-3009 authorizations with a wallet and forward the payment to Zypto — enabling autonomous, on-chain payments in agentic workflows.",
  },
  {
    q: "Is this related to Chainlink CCIP?",
    a: "No. Zypto Facilitator handles same-chain settlement. CCIP is for cross-chain bridging and is not used by this product.",
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-background/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-text-primary pr-4">{faq.q}</span>
        <ChevronDown
          size={14}
          className={`text-text-muted flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function DocsSection() {
  return (
    <section id="docs" className="py-20 px-6">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Docs</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            x402 payments, EIP-3009 authorizations, and how Zypto&apos;s facilitator
            ties it all together.
          </p>
        </div>

        {/* Two-column: concepts left, flow + FAQ right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: concept sections */}
          <div className="space-y-8">
            {concepts.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-border bg-surface flex items-center justify-center mt-1">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: payment flow + FAQ */}
          <div className="space-y-8">
            {/* Payment flow diagram */}
            <div className="bg-surface border border-border rounded-card p-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">
                Payment Flow
              </p>
              <div className="space-y-3">
                {[
                  { step: "01", label: "Client requests resource", sub: "GET /api/data" },
                  { step: "02", label: "Server returns 402 + nonce", sub: 'x402: payment="1000000"' },
                  { step: "03", label: "Client signs authorization", sub: "EIP-3009 (EVM) or SPL (Solana)" },
                  { step: "04", label: "Server forwards to Zypto", sub: "POST /api/verify" },
                  { step: "05", label: "Zypto settles on-chain", sub: "POST /api/settle — gas covered" },
                  { step: "06", label: "Server delivers resource", sub: "200 OK — payment confirmed" },
                ].map((item, i, arr) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-xs font-mono text-primary w-6 text-right">
                      {item.step}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-muted font-mono">{item.sub}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-text-muted text-xs flex-shrink-0 mt-0.5">↓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                FAQ
              </p>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
