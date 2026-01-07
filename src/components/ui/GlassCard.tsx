"use client";

import { ReactNode, forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "medium" | "heavy" | "subtle" | "liquid";
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { children, className, variant = "default", hover = false, glow = false, ...props },
    ref
  ) => {
    const variants = {
      default: "glass",
      medium: "glass-medium",
      heavy: "glass-heavy",
      subtle: "glass-subtle",
      liquid: "liquid-glass",
    };

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          "rounded-2xl p-6",
          "transition-all duration-300",
          hover && [
            "hover:scale-[1.02]",
            "hover:border-white/20",
            "cursor-pointer",
          ],
          glow && "hover:glow-accent",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
