import { Lock, CreditCard, Bot, LayoutDashboard } from "lucide-react";

const tools = [
  {
    icon: CreditCard,
    title: "Zypto Pay SDK",
    description: "Accept crypto payments on your site in minutes. Drop-in checkout for any website.",
    badge: "Coming Soon",
  },
  {
    icon: Bot,
    title: "Agent Skills",
    description: "Use Zypto in your AI agent workflows. Let agents spend crypto on behalf of users.",
    badge: "Coming Soon",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Monitor your settlement history, volume, and revenue. Real-time analytics.",
    badge: "Coming Soon",
  },
];

export default function ToolsSection() {
  return (
    <section id="tools" className="py-20 px-6 bg-surface/50">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tools & Infrastructure
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            More coming soon. The facilitator is just the start.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                className="relative p-6 rounded-card bg-surface border border-border opacity-60 grayscale"
              >
                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <div className="flex flex-col items-center gap-2">
                    <Lock size={24} className="text-text-muted" />
                    <span className="text-xs font-mono text-text-muted bg-background/80 px-2 py-1 rounded">
                      {tool.badge}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="relative z-0">
                  <div className="w-10 h-10 rounded-lg border border-border bg-background flex items-center justify-center mb-4">
                    <Icon size={20} className="text-text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-secondary mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-warning/10 text-warning border border-warning/20">
                    {tool.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
