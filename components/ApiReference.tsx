"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  request?: object;
  response?: object;
  note?: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/health",
    description: "Service status, supported chains, and aggregate statistics.",
    response: {
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
      totals: { settlements: 12847, volume: "1240000.00" },
      endpoints: ["/api/health", "/api/verify", "/api/settle"],
      operator: "Zypto Foundation",
      website: "https://zypto.com",
    },
  },
  {
    method: "POST",
    path: "/api/verify",
    description:
      "Verifies a payment authorization without executing it. EVM: EIP-3009 transferWithAuthorization. Solana: SPL token approval.",
    request: {
      chainId: 8453,
      from: "0x742d35Cc6634C0532925a3b844Bc9e7595f5a6bE",
      to: "0x_resource_server_address_",
      value: "1000000",
      validAfter: 0,
      validBefore: 1747700000,
      nonce: "0x_unique_per_transaction",
    },
    response: {
      valid: true,
      facilitator: "0x_facilitator_address",
      chain: 8453,
    },
    note: "Solana uses SPL token transfer — omit validAfter/validBefore/nonce, use mint field instead.",
  },
  {
    method: "POST",
    path: "/api/settle",
    description:
      "Executes a payment on-chain. EVM: submits EIP-3009. Solana: SPL token transfer. Gas is covered by Zypto.",
    request: {
      chainId: 8453,
      from: "0x742d35Cc6634C0532925a3b844Bc9e7595f5a6bE",
      to: "0x_resource_server_address_",
      value: "1000000",
      validAfter: 0,
      validBefore: 1747700000,
      nonce: "0x_unique_per_transaction",
      signature: "0x_65_byte_signature_",
    },
    response: {
      success: true,
      txHash: "0x_on_chain_transaction_hash",
      blockNumber: 19842301,
      gasUsed: "85000",
      chain: 8453,
    },
  },
];

function formatJson(obj: object): string {
  return JSON.stringify(obj, null, 2);
}

function JsonBlock({ obj }: { obj: object }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(formatJson(obj));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="p-4 overflow-x-auto text-sm font-mono bg-background rounded-lg border border-border m-0">
        <code className="text-text-secondary">
          {formatJson(obj).split("\n").map((line, i) => {
            const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
            return (
              <div key={i} className={indent === 2 ? "pl-4" : indent === 4 ? "pl-8" : ""}>
                {line.split(/(".*?":\s*)(.*)/).map((part, j) => {
                  if (j === 1) {
                    return (
                      <span key={j} className="json-key">
                        {part}
                      </span>
                    );
                  }
                  if (j === 2 && part) {
                    const trimmed = part.trim();
                    if (trimmed.startsWith('"')) {
                      return (
                        <span key={j} className="json-string">
                          {part}
                        </span>
                      );
                    }
                    if (trimmed === "true" || trimmed === "false") {
                      return (
                        <span key={j} className="json-boolean">
                          {part}
                        </span>
                      );
                    }
                    if (/^\d+$/.test(trimmed)) {
                      return (
                        <span key={j} className="json-number">
                          {part}
                        </span>
                      );
                    }
                    return <span key={j}>{part}</span>;
                  }
                  return <span key={j}>{part}</span>;
                })}
              </div>
            );
          })}
        </code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copy JSON"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function ApiReference() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="api-reference" className="py-20 px-6">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">API Reference</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Three endpoints. Zero authentication. Go wild.
          </p>
        </div>

        {/* Endpoints */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {endpoints.map((endpoint, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={endpoint.path + index}
                className="rounded-card border border-border bg-surface overflow-hidden"
              >
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-background/50 transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`px-2 py-0.5 rounded-badge text-xs font-bold font-mono ${
                      endpoint.method === "GET"
                        ? "bg-secondary/10 text-secondary border border-secondary/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-text-primary">
                    {endpoint.path}
                  </code>
                  <span className="flex-1 text-sm text-text-secondary truncate">
                    {endpoint.description}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-text-muted flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                    {endpoint.note && (
                      <p className="text-xs text-accent bg-accent/10 border border-accent/20 rounded px-3 py-2">
                        {endpoint.note}
                      </p>
                    )}
                    {endpoint.request && (
                      <div>
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                          Request Body
                        </p>
                        <JsonBlock obj={endpoint.request} />
                      </div>
                    )}
                    {endpoint.response && (
                      <div>
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                          Response
                        </p>
                        <JsonBlock obj={endpoint.response} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
