"use client";

import { ExternalLink } from "lucide-react";
import { CHAINS } from "@/lib/chains";

interface ChainCardProps {
  chainKey: keyof typeof CHAINS;
}

function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function ChainCard({ chainKey }: ChainCardProps) {
  const chain = CHAINS[chainKey];

  return (
    <div className="group p-6 rounded-card bg-surface border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      {/* Chain logo / emoji */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={chain.name}>
            {chain.emoji}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-text-primary">
                {chain.name}
              </h3>
              <span className="px-2 py-0.5 text-xs font-mono rounded-badge bg-surface border border-border text-text-muted">
                ID: {chain.id}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
              <span className="text-xs text-success font-medium">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* USDC info */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-text-muted mb-1">USDC</p>
          {chain.usdc ? (
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-text-secondary bg-background px-2 py-1 rounded border border-border flex-1 overflow-hidden text-ellipsis">
                {truncateAddress(chain.usdc)}
              </code>
              <a
                href={`${chain.explorer}/token/${chain.usdc}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary transition-colors flex-shrink-0"
                aria-label={`View ${chain.name} USDC on explorer`}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">Coming soon</p>
          )}
        </div>
      </div>

      {/* Explorer link */}
      <div className="mt-4 pt-4 border-t border-border">
        <a
          href={chain.explorer}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors"
        >
          View on {chain.explorerName}
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
