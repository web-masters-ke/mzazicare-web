"use client";

import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface GradientOrbProps {
  className?: string;
  color?: "accent" | "secondary" | "mixed";
  size?: "sm" | "md" | "lg" | "xl";
  blur?: "soft" | "medium" | "heavy";
  animate?: boolean;
  style?: CSSProperties;
}

export function GradientOrb({
  className,
  color = "accent",
  size = "md",
  blur = "medium",
  animate = true,
  style,
}: GradientOrbProps) {
  const colors = {
    accent: "bg-[var(--orb-accent)]",
    secondary: "bg-[var(--orb-secondary)]",
    mixed: "bg-gradient-to-br from-[var(--orb-accent)] via-[var(--orb-secondary)] to-[var(--orb-accent)]",
  };

  const sizes = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
  };

  const blurs = {
    soft: "blur-2xl",
    medium: "blur-3xl",
    heavy: "blur-[100px]",
  };

  return (
    <div
      className={cn(
        "absolute rounded-full pointer-events-none",
        colors[color],
        sizes[size],
        blurs[blur],
        animate && "animate-float-slow",
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}
