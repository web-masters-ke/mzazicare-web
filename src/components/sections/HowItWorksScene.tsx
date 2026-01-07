"use client";

import { useState } from "react";
import { Search, UserCheck, Calendar, Heart } from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Tell us your needs",
    description:
      "Share your loved one's care requirements, schedule preferences, and any special considerations.",
    detail:
      "Our smart matching system analyzes over 50 criteria to find the perfect caregiver match.",
  },
  {
    icon: UserCheck,
    number: "02",
    title: "Meet verified caregivers",
    description:
      "Browse profiles of background-checked, trained caregivers with verified reviews from other families.",
    detail:
      "Every caregiver passes our rigorous 7-step verification process including criminal background checks.",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Schedule care sessions",
    description:
      "Book regular visits or one-time appointments with flexible scheduling that fits your family.",
    detail:
      "Manage bookings, track visits, and communicate through our secure family dashboard.",
  },
  {
    icon: Heart,
    number: "04",
    title: "Experience peace of mind",
    description:
      "Stay connected with real-time updates, GPS check-ins, and detailed care reports after each visit.",
    detail:
      "Our 24/7 support team is always ready to assist with any concerns or schedule changes.",
  },
];

export function HowItWorksScene() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <SceneWrapper id="how-it-works" className="bg-[var(--color-bg)]" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background Decoration */}
        <GradientOrb
          color="accent"
          size="xl"
          blur="heavy"
          className="top-0 right-0 opacity-20"
        />

        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <AnimatedText animation="fade-up">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
              Simple Process
            </p>
          </AnimatedText>
          <AnimatedText animation="fade-up" delay={100}>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-fg)] mb-6">
              Finding care shouldn&apos;t be{" "}
              <span className="text-brand-accent">complicated</span>
            </h2>
          </AnimatedText>
          <AnimatedText animation="fade-up" delay={200}>
            <p className="text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto">
              Four simple steps to connect your loved ones with compassionate,
              professional caregivers.
            </p>
          </AnimatedText>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <AnimatedText
              key={step.number}
              animation="fade-up"
              delay={300 + index * 100}
            >
              <GlassCard
                variant={activeStep === index ? "liquid" : "subtle"}
                hover
                glow={activeStep === index}
                className={cn(
                  "h-full relative cursor-pointer",
                  "transition-all duration-500",
                  activeStep === index && "scale-[1.02] border-brand-accent/30"
                )}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Number */}
                <span className="text-5xl font-bold text-[var(--color-fg)]/5 absolute top-4 right-4">
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                    "transition-all duration-500",
                    activeStep === index
                      ? "bg-brand-accent text-white"
                      : "bg-[var(--glass-bg)] text-[var(--color-fg-muted)]"
                  )}
                >
                  <step.icon size={28} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[var(--color-fg)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--color-fg-muted)] text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Expanded Detail (Progressive Disclosure) */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500",
                    activeStep === index
                      ? "max-h-24 opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-brand-accent/80 text-xs leading-relaxed pt-4 border-t border-[var(--glass-border)]">
                    {step.detail}
                  </p>
                </div>
              </GlassCard>
            </AnimatedText>
          ))}
        </div>

        {/* Progress Indicator */}
        <AnimatedText animation="fade-up" delay={700}>
          <div className="mt-12 md:mt-16 max-w-md mx-auto">
            <div className="h-1 bg-[var(--glass-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-[var(--color-fg-subtle)] text-sm mt-4">
              Step {activeStep + 1} of {steps.length}
            </p>
          </div>
        </AnimatedText>
      </div>
    </SceneWrapper>
  );
}
