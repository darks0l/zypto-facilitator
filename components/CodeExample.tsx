"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CHAINS } from "@/lib/chains";

type TabKey = "curl" | "javascript" | "python";

const tabs: { key: TabKey; label: string }[] = [
  { key: "curl", label: "cURL" },
  { key: "javascript", label: "JavaScript" },
  { key: "python", label: "Python" },
];

function buildCode(lang: TabKey) {
  const base = CHAINS.base;
  const code: Record<TabKey, string> = {
    curl: `curl -X POST https://facilitator.zypto.com/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "chainId": ${base.id},
    "token": "${base.usdc}",
    "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f5a6bE",
    "to": "${base.pool}",
    "value": "1000000",
    "validAfter": 0,
    "validBefore": 1747700000,
    "nonce": "0xabcd1234efgh5678"
  }'`,

    javascript: `const res = await fetch('https://facilitator.zypto.com/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chainId: ${base.id},
    token: '${base.usdc}',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f5a6bE',
    to: '${base.pool}',
    value: '1000000',
    validAfter: 0,
    validBefore: 1747700000,
    nonce: '0xabcd1234efgh5678'
  })
});

const { valid, facilitator, reason } = await res.json();
console.log('Verified:', valid);`,

    python: `import requests

res = requests.post(
    'https://facilitator.zypto.com/api/verify',
    headers={'Content-Type': 'application/json'},
    json={
        'chainId': ${base.id},
        'token': '${base.usdc}',
        'from': '0x742d35Cc6634C0532925a3b844Bc9e7595f5a6bE',
        'to': '${base.pool}',
        'value': '1000000',
        'validAfter': 0,
        'validBefore': 1747700000,
        'nonce': '0xabcd1234efgh5678'
    }
)

data = res.json()
print(f"Verified: {data['valid']}")`,
  };
  return code[lang];
}

function highlightCode(code: string, lang: TabKey): React.ReactNode {
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "curl") {
    highlighted = highlighted
      .replace(/(curl)/g, '<span class="json-key">$1</span>')
      .replace(/(-X|-H|-d)/g, '<span class="json-boolean">$1</span>');
  } else if (lang === "javascript") {
    highlighted = highlighted
      .replace(/\b(const|await|fetch|method|headers|body|JSON\.stringify|console\.log)\b/g, '<span class="json-key">$1</span>')
      .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>');
  } else if (lang === "python") {
    highlighted = highlighted
      .replace(/\b(import|from|requests\.post|headers|json|print)\b/g, '<span class="json-key">$1</span>');
  }

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b(\d+)\b/g,
    '<span class="json-number">$1</span>'
  );

  // Highlight hex strings
  highlighted = highlighted.replace(
    /'(0x[a-fA-F0-9]{6,})'/g,
    '<span class="json-string">\'$1\'</span>'
  );

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

export default function CodeExample() {
  const [activeTab, setActiveTab] = useState<TabKey>("curl");
  const [copied, setCopied] = useState(false);

  const code = buildCode(activeTab);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code-example" className="py-20 px-6 bg-surface/50">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Building
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Integrate in minutes. One POST request and gas is covered.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-button bg-background border border-border w-fit mx-auto mb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-button text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-background"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="mt-0 rounded-card border border-border overflow-hidden max-w-3xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
            <span className="text-xs font-mono text-text-muted">
              {tabs.find((t) => t.key === activeTab)?.label}
            </span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-success" />
                  <span className="text-success">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-6 overflow-x-auto bg-background m-0 border-0 rounded-0">
            <code className="text-sm font-mono leading-relaxed">
              {highlightCode(code, activeTab)}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
