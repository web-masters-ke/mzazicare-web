"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SceneWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fullHeight?: boolean;
  overflow?: "visible" | "hidden";
}

export function SceneWrapper({
  children,
  className,
  id,
  fullHeight = false,
  overflow = "visible",
}: SceneWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        "scene-spacing",
        fullHeight && "min-h-screen flex items-center",
        overflow === "hidden" && "overflow-hidden",
        className
      )}
    >
      {children}
    </section>
  );
}
