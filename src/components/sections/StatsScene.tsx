"use client";

import { useEffect, useRef, useState } from "react";
import { Users, MapPin, Clock, ThumbsUp } from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Families Served",
    description: "Trusted by families across Kenya",
  },
  {
    icon: MapPin,
    value: 47,
    suffix: "",
    label: "Counties Covered",
    description: "Nationwide caregiver network",
  },
  {
    icon: Clock,
    value: 500000,
    suffix: "+",
    label: "Care Hours Delivered",
    description: "Professional in-home support",
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Based on family reviews",
  },
];

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
    }
    return num.toString();
  };

  return (
    <span className="tabular-nums">
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export function StatsScene() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden"
    >
      {/* Animated background lines */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, transparent 50%, rgba(236,112,78,0.1) 50%, transparent 50.5%),
              linear-gradient(0deg, transparent 0%, transparent 50%, rgba(236,112,78,0.1) 50%, transparent 50.5%)
            `,
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <AnimatedText animation="fade-up">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
              Our Impact
            </p>
          </AnimatedText>
          <AnimatedText animation="fade-up" delay={100}>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Numbers that speak for{" "}
              <span className="text-brand-accent">themselves</span>
            </h2>
          </AnimatedText>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <AnimatedText
              key={stat.label}
              animation="scale-in"
              delay={200 + index * 100}
            >
              <div
                className={cn(
                  "relative group p-6 md:p-8 rounded-3xl",
                  "bg-gradient-to-br from-white/5 to-transparent",
                  "border border-white/5 hover:border-brand-accent/30",
                  "transition-all duration-500 hover:scale-105"
                )}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-brand-accent/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-brand-accent" />
                  </div>

                  {/* Value */}
                  <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      isVisible={isVisible}
                    />
                  </p>

                  {/* Label */}
                  <p className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-white/50">{stat.description}</p>
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
}
