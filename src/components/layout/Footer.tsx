"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Caregivers", href: "/caregivers" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Help Center", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "Community", href: "/community" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative bg-[var(--color-bg-secondary)] border-t border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-[var(--color-fg)]">
                Mzazi<span className="text-brand-accent">Care</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-fg-muted)] mb-6 max-w-xs leading-relaxed">
              Connecting families with trusted caregivers for elderly parents.
              Professional in-home care, simplified.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "w-10 h-10 rounded-full glass-subtle",
                    "flex items-center justify-center",
                    "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--glass-bg)]",
                    "transition-all duration-200"
                  )}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[var(--color-fg)] uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-fg-subtle)]">
            &copy; {new Date().getFullYear()} MzaziCare. All rights reserved.
          </p>
          <p className="text-sm text-[var(--color-fg-subtle)] flex items-center gap-1">
            Made with{" "}
            <Heart size={14} className="text-brand-accent fill-brand-accent" /> in
            Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
