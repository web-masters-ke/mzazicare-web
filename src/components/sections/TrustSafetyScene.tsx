"use client";

import {
  Shield,
  Fingerprint,
  Clock,
  FileCheck,
  Award,
  Lock,
} from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";

const trustFeatures = [
  {
    icon: Fingerprint,
    title: "Background Verified",
    description:
      "Comprehensive criminal background checks and identity verification for every caregiver.",
  },
  {
    icon: FileCheck,
    title: "Credential Checks",
    description:
      "Verified certifications, training records, and professional references reviewed.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "GPS check-ins, visit logs, and instant notifications keep you informed.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description:
      "Continuous performance monitoring and family feedback ensure high standards.",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description:
      "Bank-level encryption protects your family's sensitive information.",
  },
  {
    icon: Shield,
    title: "Insured Care",
    description:
      "All caregivers are fully insured for liability and bonded for your protection.",
  },
];

const stats = [
  { value: "100%", label: "Background Checked" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24/7", label: "Support Available" },
];

export function TrustSafetyScene() {
  return (
    <SceneWrapper id="trust" className="bg-zinc-950" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background Elements */}
        <GradientOrb
          color="white"
          size="xl"
          blur="heavy"
          className="-top-32 -left-32 opacity-10"
        />
        <GradientOrb
          color="accent"
          size="lg"
          blur="heavy"
          className="bottom-0 right-0 opacity-15"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Main Message */}
          <div className="space-y-8">
            <AnimatedText animation="fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle">
                <Shield className="w-4 h-4 text-brand-accent" />
                <span className="text-sm text-white/70">
                  Your Family&apos;s Safety First
                </span>
              </div>
            </AnimatedText>

            <AnimatedText animation="fade-up" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Trust built on{" "}
                <span className="text-brand-accent">transparency</span>
              </h2>
            </AnimatedText>

            <AnimatedText animation="fade-up" delay={200}>
              <p className="text-xl text-white/60 leading-relaxed">
                Every caregiver goes through our rigorous 7-step verification
                process. We don&apos;t just check boxes—we ensure your loved ones are
                in genuinely caring hands.
              </p>
            </AnimatedText>

            {/* Key Stats */}
            <AnimatedText animation="fade-up" delay={300}>
              <div className="grid grid-cols-3 gap-6 pt-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedText>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {trustFeatures.map((feature, index) => (
              <AnimatedText
                key={feature.title}
                animation="scale-in"
                delay={400 + index * 100}
              >
                <GlassCard variant="subtle" hover className="h-full p-5">
                  <feature.icon className="w-8 h-8 text-brand-accent mb-4" />
                  <h3 className="text-base font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </AnimatedText>
            ))}
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}
