"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Heart, Star } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const floatingStats = [
  { icon: Shield, label: "Verified Caregivers", value: "2,500+" },
  { icon: Heart, label: "Families Helped", value: "10,000+" },
  { icon: Star, label: "Average Rating", value: "4.9" },
];

export function HeroScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950" />

      {/* Parallax Gradient Orbs */}
      <GradientOrb
        color="accent"
        size="xl"
        blur="heavy"
        className="top-1/4 -left-32 opacity-40"
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <GradientOrb
        color="white"
        size="lg"
        blur="heavy"
        className="bottom-1/4 -right-20 opacity-20"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <GradientOrb
        color="accent"
        size="md"
        blur="medium"
        className="top-1/2 right-1/4 opacity-20"
        animate={true}
      />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <AnimatedText animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle">
                <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
                <span className="text-sm text-white/70">
                  Trusted by 10,000+ families in Kenya
                </span>
              </div>
            </AnimatedText>

            {/* Headline */}
            <AnimatedText animation="fade-up" delay={100}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Care for those who{" "}
                <span className="relative inline-block">
                  <span className="text-brand-accent">cared for you</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 10C50 2 150 2 198 10"
                      stroke="#EC704E"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-draw"
                    />
                  </svg>
                </span>
              </h1>
            </AnimatedText>

            {/* Subheadline */}
            <AnimatedText animation="fade-up" delay={200}>
              <p className="text-xl text-white/60 max-w-lg leading-relaxed">
                Connect with vetted, compassionate caregivers who treat your elderly
                parents like their own family. Professional in-home care, simplified.
              </p>
            </AnimatedText>

            {/* CTA Buttons */}
            <AnimatedText animation="fade-up" delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <GlassButton variant="primary" size="lg" className="group">
                    Find a Caregiver
                    <ArrowRight
                      className="transition-transform group-hover:translate-x-1"
                      size={20}
                    />
                  </GlassButton>
                </Link>
                <Link href="/caregivers">
                  <GlassButton variant="secondary" size="lg">
                    Become a Caregiver
                  </GlassButton>
                </Link>
              </div>
            </AnimatedText>

            {/* Trust Indicators */}
            <AnimatedText animation="fade-up" delay={400}>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 border-black",
                        "bg-gradient-to-br from-brand-accent to-brand-accent-light",
                        "flex items-center justify-center text-white text-xs font-bold"
                      )}
                    >
                      {["JK", "AM", "SO", "MW"][i - 1]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/60">
                  <span className="text-white font-semibold">500+</span> caregivers
                  joined this month
                </p>
              </div>
            </AnimatedText>
          </div>

          {/* Right Column - Interactive Visual */}
          <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
            {/* Central Glass Card */}
            <AnimatedText animation="scale-in" delay={500}>
              <GlassCard
                variant="liquid"
                className="w-72 md:w-80 h-80 md:h-96 flex items-center justify-center"
                hover
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-light flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Professional Care
                  </h3>
                  <p className="text-sm text-white/60 px-4">
                    Background-checked caregivers ready to help your loved ones
                  </p>
                </div>
              </GlassCard>
            </AnimatedText>

            {/* Floating Stat Cards */}
            {floatingStats.map((stat, index) => (
              <AnimatedText
                key={stat.label}
                animation="scale-in"
                delay={600 + index * 100}
              >
                <GlassCard
                  variant="subtle"
                  className={cn(
                    "absolute p-4 min-w-[140px]",
                    index === 0 && "top-10 -left-4 md:left-0",
                    index === 1 && "top-1/2 -translate-y-1/2 -right-4 md:-right-8",
                    index === 2 && "bottom-10 left-4 md:left-10"
                  )}
                  hover
                >
                  <stat.icon className="w-5 h-5 text-brand-accent mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </GlassCard>
              </AnimatedText>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-white/40 uppercase tracking-widest">
          Scroll to explore
        </span>
        <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce-soft" />
        </div>
      </div>
    </section>
  );
}
