"use client";

import { Check, DollarSign, Calendar, Award, Shield, Users, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { FloatingElement } from "@/components/ui/FloatingElement";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { useRef } from "react";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive pay with weekly payments",
    gradient: "from-success-500 to-success-600",
  },
  {
    icon: Calendar,
    title: "Flexible schedules that work around your life",
    gradient: "from-accent-500 to-accent-600",
  },
  {
    icon: Award,
    title: "Free training and certification programs",
    gradient: "from-primary-500 to-primary-600",
  },
  {
    icon: Shield,
    title: "Insurance coverage and legal protection",
    gradient: "from-info-500 to-info-600",
  },
  {
    icon: Users,
    title: "Join a supportive community of caregivers",
    gradient: "from-warning-500 to-warning-600",
  },
];

export function ForCaregivers() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      id="for-caregivers"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-br from-white via-accent-50/30 to-white dark:from-dark-950 dark:via-accent-950/10 dark:to-dark-950 relative overflow-hidden"
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-primary-500/10"
          style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 10s ease infinite' }}
        />
      </div>

      {/* Gradient Orbs */}
      <GradientOrb
        size="xl"
        color="accent"
        blur="heavy"
        className="-top-40 -left-40 opacity-15"
      />
      <GradientOrb
        size="lg"
        color="mixed"
        blur="heavy"
        className="bottom-20 -right-20 opacity-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Layered Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 relative"
          >
            <FloatingElement speed="slow">
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{ y: imageY }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent-900/80 via-transparent to-transparent z-10" />

                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=900&fit=crop"
                  alt="Professional caregiver"
                  className="w-full h-[600px] object-cover"
                />

                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-accent-500/50 via-transparent to-primary-500/50 bg-clip-border opacity-30" />
              </motion.div>
            </FloatingElement>

            {/* Floating Stat Cards */}
            <FloatingElement speed="medium" delay={200}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-8 -right-8 z-20"
              >
                <TiltCard glowEffect tiltIntensity={12}>
                  <div className="glass-intense rounded-2xl p-6 border border-accent-200 dark:border-accent-500/30 shadow-2xl backdrop-blur-xl w-48">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-success-500 rounded-full animate-scale-pulse" />
                      <span className="text-sm font-semibold text-dark-600 dark:text-dark-300">
                        This Month
                      </span>
                    </div>
                    <p className="text-4xl font-bold text-dark-900 dark:text-white mb-1">
                      <AnimatedCounter end={500} suffix="+" />
                    </p>
                    <p className="text-sm text-dark-600 dark:text-dark-400">New Caregivers</p>
                  </div>
                </TiltCard>
              </motion.div>
            </FloatingElement>

            <FloatingElement speed="fast" delay={400}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-8 -left-8 z-20"
              >
                <TiltCard glowEffect tiltIntensity={12}>
                  <div className="glass-intense rounded-2xl p-6 border border-primary-200 dark:border-primary-500/30 shadow-2xl backdrop-blur-xl w-52">
                    <p className="text-5xl font-bold bg-gradient-to-br from-accent-500 to-primary-600 bg-clip-text text-transparent mb-1">
                      KES <AnimatedCounter end={2500} formatK />
                    </p>
                    <p className="text-sm text-dark-600 dark:text-dark-400 font-medium">
                      Average Weekly Earnings
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            </FloatingElement>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full text-sm font-semibold mb-6 border border-accent-200 dark:border-accent-800"
            >
              For Caregivers
            </motion.div>

            <h2 className="text-4xl lg:text-6xl font-bold text-dark-900 dark:text-white mb-6 leading-tight">
              Build a rewarding career
              <br />
              <span className="text-gradient-animated">helping families</span>
            </h2>

            <p className="text-xl text-dark-600 dark:text-dark-400 mb-10 leading-relaxed">
              Make a real difference in people's lives while enjoying the flexibility and support you deserve. Join Kenya's fastest-growing caregiving platform.
            </p>

            {/* Benefits as Floating Cards */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <FloatingElement key={benefit.title} speed="slow" delay={index * 100}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <TiltCard tiltIntensity={5}>
                        <div className="glass-heavy rounded-2xl p-5 border border-dark-200/50 dark:border-dark-700/30 hover:border-accent-500/50 transition-all duration-300 group">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <p className="flex-1 text-lg font-semibold text-dark-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                              {benefit.title}
                            </p>
                            <Check className="w-6 h-6 text-success-500 dark:text-success-400 flex-shrink-0" />
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  </FloatingElement>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/caregiver-onboarding">
                <MagneticButton
                  size="xl"
                  className="rounded-full px-10 bg-accent-500 hover:bg-accent-600 shadow-2xl shadow-accent-500/30"
                  magneticStrength={0.3}
                >
                  Become a Caregiver
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
