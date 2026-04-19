"use client";

import { useState } from "react";
import { Github, Menu, X } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Facilitator", href: "#hero" },
    { label: "Docs", href: "#how-it-works" },
    { label: "API", href: "#api-reference" },
    { label: "Agent", href: "#tools" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <img
            src="/zypto-logo.png"
            alt="Zypto"
            className="h-8 w-auto"
          />
          <span className="text-sm font-mono text-text-secondary group-hover:text-primary transition-colors">
            Facilitator
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/darks0l/zypto-facilitator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-secondary hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <nav className="max-w-content mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/darks0l/zypto-facilitator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
