"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-8 rounded-full p-1",
        "bg-[var(--color-bg-tertiary)] border border-[var(--glass-border)]",
        "transition-all duration-300 ease-out",
        "hover:border-[var(--color-accent)]/30",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50",
        className
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Track icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun
          className={cn(
            "w-3.5 h-3.5 transition-opacity duration-300",
            theme === "light" ? "opacity-0" : "opacity-40 text-yellow-400"
          )}
        />
        <Moon
          className={cn(
            "w-3.5 h-3.5 transition-opacity duration-300",
            theme === "dark" ? "opacity-0" : "opacity-40 text-slate-400"
          )}
        />
      </div>

      {/* Sliding knob */}
      <div
        className={cn(
          "relative w-6 h-6 rounded-full",
          "bg-[var(--color-bg)] shadow-md",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        )}
      >
        {theme === "light" ? (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
        )}
      </div>
    </button>
  );
}
