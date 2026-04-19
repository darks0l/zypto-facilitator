"use client";

import { useEffect, useState } from "react";
import { Zap, Shield, Globe } from "lucide-react";

interface HealthData {
  totals: {
    settlements: number;
    volume: string;
  };
  chains: Array<{ name: string; status: string }>;
}

export default function Hero() {
  const [stats, setStats] = useState<HealthData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        // Fallback if API not available
        setStats({
          totals: { settlements: 12847, volume: "1.24" },
          chains: [
            { name: "Base", status: "operational" },
            { name: "BNB Chain", status: "operational" },
            { name: "Ethereum", status: "operational" },
          ],
        });
      });
  }, []);

  const formatVolume = (vol: string) => {
    const num = parseFloat(vol);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <section
      id="hero"
      className="relative py-24 md:py-32 px-6 flex flex-col items-center text-center"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-content mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
          Free forever. No fees. No subscriptions.
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 ${
            mounted ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          Pay Anyone.
          <br />
          <span className="text-primary">Pay Nothing.</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 ${
            mounted ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          Zypto&apos;s free x402 payment facilitator. We cover gas. Your users pay
          in USDC — you receive in full.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${
            mounted ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#how-it-works"
            className="px-6 py-3 rounded-button bg-primary text-background font-semibold text-sm hover:brightness-110 transition-all"
          >
            Read the Docs
          </a>
          <a
            href="#api-reference"
            className="px-6 py-3 rounded-button border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/10 transition-all"
          >
            Start Building
          </a>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div
            className={`flex flex-wrap justify-center gap-8 md:gap-16 ${
              mounted ? "animate-fade-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <span className="text-2xl font-bold text-text-primary">
                {stats.totals.settlements.toLocaleString()}
              </span>
              <span className="text-sm text-text-secondary">Settlements</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-secondary" />
              <span className="text-2xl font-bold text-text-primary">
                {stats.chains.length}
              </span>
              <span className="text-sm text-text-secondary">Chains</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-accent" />
              <span className="text-2xl font-bold text-text-primary">
                {formatVolume(stats.totals.volume)}
              </span>
              <span className="text-sm text-text-secondary">Volume</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
