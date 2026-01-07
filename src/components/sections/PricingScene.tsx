"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "essential",
    name: "Essential",
    icon: Zap,
    description: "Perfect for occasional care needs",
    price: { monthly: 4999, annually: 3999 },
    currency: "KES",
    period: "per month",
    features: [
      "Up to 20 care hours/month",
      "Verified caregivers",
      "Basic visit reports",
      "SMS notifications",
      "Standard support",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    icon: Sparkles,
    description: "Most popular for regular care",
    price: { monthly: 9999, annually: 7999 },
    currency: "KES",
    period: "per month",
    features: [
      "Up to 60 care hours/month",
      "Premium verified caregivers",
      "Detailed visit reports",
      "Real-time GPS tracking",
      "Priority 24/7 support",
      "Family dashboard access",
      "Caregiver preference saving",
    ],
    highlighted: true,
    badge: "Most Popular",
    cta: "Get Started",
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    description: "Comprehensive care solution",
    price: { monthly: 19999, annually: 16999 },
    currency: "KES",
    period: "per month",
    features: [
      "Unlimited care hours",
      "Elite verified caregivers",
      "Comprehensive health reports",
      "Advanced GPS & vitals",
      "Dedicated care manager",
      "Multi-family dashboard",
      "Emergency response priority",
      "Video check-ins included",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

export function PricingScene() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <SceneWrapper id="pricing" className="bg-[var(--color-bg-secondary)]" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background */}
        <GradientOrb
          color="accent"
          size="xl"
          blur="heavy"
          className="top-0 left-1/2 -translate-x-1/2 opacity-20"
        />

        {/* Header */}
        <div className="text-center mb-12">
          <AnimatedText animation="fade-up">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">
              Simple Pricing
            </p>
          </AnimatedText>
          <AnimatedText animation="fade-up" delay={100}>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-fg)] mb-6">
              Care plans that fit{" "}
              <span className="text-brand-accent">your budget</span>
            </h2>
          </AnimatedText>
          <AnimatedText animation="fade-up" delay={200}>
            <p className="text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Choose the plan that works
              for your family.
            </p>
          </AnimatedText>
        </div>

        {/* Billing Toggle */}
        <AnimatedText animation="fade-up" delay={300}>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !isAnnual ? "text-[var(--color-fg)]" : "text-[var(--color-fg-subtle)]"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn(
                "relative w-14 h-8 rounded-full transition-colors",
                isAnnual ? "bg-brand-accent" : "bg-[var(--glass-bg)]"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300",
                  isAnnual ? "left-7" : "left-1"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isAnnual ? "text-[var(--color-fg)]" : "text-[var(--color-fg-subtle)]"
              )}
            >
              Annually
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-brand-accent/20 text-brand-accent">
                Save 20%
              </span>
            </span>
          </div>
        </AnimatedText>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <AnimatedText
              key={plan.id}
              animation="fade-up"
              delay={400 + index * 100}
            >
              <div
                className={cn(
                  "relative rounded-3xl overflow-hidden h-full",
                  "transition-all duration-500 hover:scale-[1.02]",
                  plan.highlighted
                    ? "bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 border-2 border-brand-accent/50"
                    : "bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
                )}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-brand-accent text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        plan.highlighted
                          ? "bg-brand-accent text-white"
                          : "bg-[var(--glass-bg)] text-[var(--color-fg-muted)]"
                      )}
                    >
                      <plan.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-fg)]">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-[var(--color-fg-subtle)]">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-[var(--color-fg-subtle)]">
                        {plan.currency}
                      </span>
                      <span className="text-5xl font-bold text-[var(--color-fg)]">
                        {(isAnnual
                          ? plan.price.annually
                          : plan.price.monthly
                        ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-fg-subtle)] mt-1">{plan.period}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check
                          className={cn(
                            "w-5 h-5 flex-shrink-0 mt-0.5",
                            plan.highlighted
                              ? "text-brand-accent"
                              : "text-[var(--color-fg-subtle)]"
                          )}
                        />
                        <span className="text-[var(--color-fg-muted)]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/register">
                    <GlassButton
                      variant={plan.highlighted ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {plan.cta}
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>

        {/* Bottom Note */}
        <AnimatedText animation="fade-up" delay={700}>
          <p className="text-center text-[var(--color-fg-subtle)] text-sm mt-12">
            All plans include a 14-day free trial. No credit card required to
            start.
          </p>
        </AnimatedText>
      </div>
    </SceneWrapper>
  );
}
