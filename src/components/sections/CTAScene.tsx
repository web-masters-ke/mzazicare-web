"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { useState } from "react";

export function CTAScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      className="py-32 lg:py-40 bg-gradient-to-br from-primary-100 via-accent-100 to-primary-50 dark:from-dark-950 dark:via-primary-950 dark:to-dark-950 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,107,61,0.15) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 8s ease infinite',
          }}
        />
      </div>

      {/* Multiple Large Gradient Orbs */}
      <GradientOrb
        size="xl"
        color="accent"
        blur="heavy"
        className="top-0 left-1/4 opacity-40"
        style={{
          transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`,
        }}
      />
      <GradientOrb
        size="xl"
        color="mixed"
        blur="heavy"
        className="bottom-0 right-1/4 opacity-30"
        style={{
          transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
        }}
      />
      <GradientOrb
        size="lg"
        color="accent"
        blur="heavy"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-heavy rounded-full border border-primary-300 dark:border-primary-500/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-500 dark:text-primary-400" />
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-300">
              Join 10,000+ Happy Families
            </span>
          </motion.div>

          {/* Huge Headline with Animated Gradient */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-8xl font-extrabold mb-8 leading-[1.1]"
          >
            <span className="text-dark-900 dark:text-white">Ready to give</span>
            <br />
            <span className="text-dark-900 dark:text-white">your loved ones</span>
            <br />
            <span className="text-gradient-animated text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-[length:200%_auto]">
              the care they deserve?
            </span>
          </motion.h2>

          {/* Subtext with Glow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl lg:text-2xl text-dark-700 dark:text-primary-200/80 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Join thousands of families who have found trusted, compassionate caregivers through MzaziCare. Your journey to peace of mind starts here.
          </motion.p>

          {/* CTA Buttons with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link href="/register">
              <MagneticButton
                size="xl"
                className="rounded-full px-12 py-5 text-lg bg-white text-dark-900 hover:bg-primary-50 shadow-2xl shadow-primary-500/30 font-bold relative overflow-hidden group"
                magneticStrength={0.4}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <span className="relative z-10 flex items-center gap-3">
                  Find a Caregiver
                  <ArrowRight className="w-6 h-6" />
                </span>
              </MagneticButton>
            </Link>

            <Link href="/caregiver-onboarding">
              <MagneticButton
                size="xl"
                className="rounded-full px-12 py-5 text-lg glass-heavy border-2 border-primary-300 dark:border-primary-400/50 text-dark-900 dark:text-white hover:bg-primary-100 dark:hover:bg-primary-500/20 shadow-xl font-bold relative overflow-hidden group"
                magneticStrength={0.4}
              >
                {/* Glow Trail */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 blur-xl" />
                </div>
                <span className="relative z-10">
                  Become a Caregiver
                </span>
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-dark-600 dark:text-primary-300/70"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-scale-pulse" />
              <span className="text-sm font-medium">Instant Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-scale-pulse" />
              <span className="text-sm font-medium">100% Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-scale-pulse" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
