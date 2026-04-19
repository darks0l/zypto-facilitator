import { PenTool, CheckCircle, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PenTool,
    title: "Sign",
    description:
      "User signs a payment authorization. EVM: EIP-3009 transferWithAuthorization. Solana: SPL token approval. No gas. No waiting.",
    color: "primary",
  },
  {
    number: "02",
    icon: CheckCircle,
    title: "Verify",
    description:
      "Zypto verifies balance, nonce, and expiry — instant and free. No on-chain calls, no gas, no delays.",
    color: "secondary",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Settle",
    description:
      "On-chain execution happens. Full amount reaches you. Gas is covered by Zypto — always.",
    color: "accent",
  },
];

const colorMap: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const iconBgMap: Record<string, string> = {
  primary: "bg-primary/10 border-primary/20",
  secondary: "bg-secondary/10 border-secondary/20",
  accent: "bg-accent/10 border-accent/20",
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-content mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Three steps from signature to settlement. Zero fees. Full amount.
            Every time.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col md:flex-row items-center flex-1">
                {/* Step card */}
                <div className="flex-1 w-full">
                  <div className="relative p-6 rounded-card bg-surface border border-border hover:border-primary/20 transition-all duration-300 group">
                    {/* Step number */}
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`text-xs font-mono font-bold ${colorMap[step.color]}`}
                      >
                        {step.number}
                      </span>
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center ${iconBgMap[step.color]}`}
                      >
                        <Icon
                          size={20}
                          className={colorMap[step.color]}
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-text-primary">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-12 flex-shrink-0">
                    <div className="w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30" />
                  </div>
                )}
                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex items-center justify-center h-8 flex-shrink-0">
                    <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-secondary/30" />
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
