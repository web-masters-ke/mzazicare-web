"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = [
      "relative overflow-hidden rounded-full font-medium",
      "transition-all duration-300",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50",
      "active:scale-[0.98]",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ];

    const variants = {
      primary: [
        "bg-brand-accent text-white",
        "hover:bg-brand-accent-light",
        "hover:shadow-[0_0_30px_rgba(236,112,78,0.4)]",
        // Shimmer effect on hover
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:translate-x-[-200%]",
        "hover:before:translate-x-[200%]",
        "before:transition-transform before:duration-700",
      ],
      secondary: [
        "glass border border-[var(--glass-border)]",
        "text-[var(--color-fg)]",
        "hover:bg-[var(--glass-bg-medium)] hover:border-[var(--glass-border-hover)]",
      ],
      ghost: [
        "bg-transparent text-[var(--color-fg-muted)]",
        "hover:text-[var(--color-fg)] hover:bg-[var(--glass-bg-subtle)]",
      ],
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };
