"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { SceneWrapper } from "@/components/layout/SceneWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { GradientOrb } from "@/components/ui/GradientOrb";

export function CTAScene() {
  return (
    <SceneWrapper className="bg-[var(--color-bg)]" overflow="hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Background Elements */}
        <GradientOrb
          color="accent"
          size="xl"
          blur="heavy"
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25"
        />

        <AnimatedText animation="scale-in">
          <GlassCard
            variant="liquid"
            className="p-10 md:p-16 text-center relative overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-accent/5" />

            <div className="relative z-10">
              <AnimatedText animation="fade-up">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-fg)] mb-6 leading-tight">
                  Ready to give your loved ones
                  <br />
                  <span className="text-brand-accent">the care they deserve?</span>
                </h2>
              </AnimatedText>

              <AnimatedText animation="fade-up" delay={100}>
                <p className="text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto mb-10">
                  Join thousands of families who have found trusted, compassionate
                  caregivers through MzaziCare. Your journey to peace of mind starts
                  here.
                </p>
              </AnimatedText>

              <AnimatedText animation="fade-up" delay={200}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Link href="/register">
                    <GlassButton variant="primary" size="lg" className="group">
                      Find a Caregiver Now
                      <ArrowRight
                        className="transition-transform group-hover:translate-x-1"
                        size={20}
                      />
                    </GlassButton>
                  </Link>
                  <Link href="/contact">
                    <GlassButton variant="secondary" size="lg">
                      Schedule a Consultation
                    </GlassButton>
                  </Link>
                </div>
              </AnimatedText>

              {/* Contact Options */}
              <AnimatedText animation="fade-up" delay={300}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[var(--color-fg-subtle)]">
                  <a
                    href="tel:+254700000000"
                    className="flex items-center gap-2 hover:text-[var(--color-fg)] transition-colors"
                  >
                    <Phone size={18} />
                    <span>+254 700 000 000</span>
                  </a>
                  <a
                    href="mailto:care@mzazicare.com"
                    className="flex items-center gap-2 hover:text-[var(--color-fg)] transition-colors"
                  >
                    <Mail size={18} />
                    <span>care@mzazicare.com</span>
                  </a>
                </div>
              </AnimatedText>
            </div>
          </GlassCard>
        </AnimatedText>
      </div>
    </SceneWrapper>
  );
}
