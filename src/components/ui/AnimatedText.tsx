"use client";

import { useRef, useEffect, useState, ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "scale-in";
  once?: boolean;
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  animation = "fade-up",
  once = true,
  ...props
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before triggering animation
          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, once]);

  const animations = {
    "fade-up": {
      initial: "opacity-0 translate-y-8",
      animate: "opacity-100 translate-y-0",
    },
    "fade-in": {
      initial: "opacity-0",
      animate: "opacity-100",
    },
    "scale-in": {
      initial: "opacity-0 scale-95",
      animate: "opacity-100 scale-100",
    },
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? animations[animation].animate : animations[animation].initial,
        className
      )}
      style={{
        transitionTimingFunction: "var(--ease-spring)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
