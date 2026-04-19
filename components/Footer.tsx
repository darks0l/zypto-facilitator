import { ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src="/zypto-logo.png"
                alt="Zypto"
                className="h-6 w-auto"
              />
              <span className="text-xs font-mono text-text-secondary">
                Facilitator
              </span>
            </div>
            <p className="text-xs text-text-muted max-w-xs">
              Free x402 payment facilitator by the Zypto Community Initiative.
              We cover gas. You receive in full.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            <a
              href="#hero"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              Docs
            </a>
            <a
              href="#api-reference"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              API
            </a>
            <a
              href="https://github.com/darks0l/zypto-facilitator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              GitHub <ExternalLink size={12} />
            </a>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs text-text-muted">
              Built by the{" "}
              <span className="text-primary font-medium">Zypto Community Initiative</span> ·
              Powered by{" "}
              <span className="text-secondary font-medium">x402</span>
            </p>
            <p className="text-[10px] text-text-muted max-w-xl leading-relaxed">
              Owned and maintained by the Zypto Community. $ZYPTO Token governed
              by Zypto Foundation. Not available in restricted jurisdictions
              including Canada and UK.
            </p>
          </div>
          <p className="text-xs text-text-muted mt-4">
            © {currentYear} Zypto Community Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
