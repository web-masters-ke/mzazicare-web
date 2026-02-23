"use client";

import { Shield, Clock, DollarSign, HeadphonesIcon, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { FloatingElement } from "@/components/ui/FloatingElement";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { useRef } from "react";

const perks = [
  {
    icon: Shield,
    title: "Vetted Caregivers",
    description: "Background-checked professionals you can trust",
    gradient: "from-primary-500 to-primary-600",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Schedule care that fits your family's needs",
    gradient: "from-success-500 to-success-600",
  },
  {
    icon: DollarSign,
    title: "Affordable Rates",
    description: "Quality care at transparent, competitive pricing",
    gradient: "from-accent-500 to-accent-600",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "We're here whenever you need assistance",
    gradient: "from-info-500 to-info-600",
  },
];

export function ForFamilies() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      id="for-families"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 dark:from-dark-950 dark:via-black dark:to-dark-950 relative overflow-hidden"
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-accent-500/20"
          style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 10s ease infinite' }}
        />
      </div>

      {/* Gradient Orbs */}
      <GradientOrb
        size="xl"
        color="accent"
        blur="heavy"
        className="-top-40 -right-40 opacity-20"
      />
      <GradientOrb
        size="lg"
        color="mixed"
        blur="heavy"
        className="bottom-20 -left-20 opacity-15"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-primary-200 dark:border-primary-500/30"
            >
              For Families
            </motion.div>

            <h2 className="text-4xl lg:text-6xl font-bold text-dark-900 dark:text-white mb-6 leading-tight">
              Peace of mind.
              <br />
              Professional care.
              <br />
              <span className="text-gradient-animated">Your loved ones deserve it.</span>
            </h2>

            <p className="text-xl text-dark-700 dark:text-dark-300 mb-10 leading-relaxed">
              Finding the right caregiver for your elderly parents shouldn't be stressful. We connect you with compassionate, trained professionals who provide the highest quality in-home care.
            </p>

            {/* Floating Perk Badges */}
            <div className="space-y-4 mb-10">
              {perks.map((perk, index) => (
                <FloatingElement key={perk.title} speed="slow" delay={index * 100}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TiltCard tiltIntensity={5}>
                      <div className="glass-heavy rounded-2xl p-5 border border-dark-200/50 dark:border-white/10 hover:border-primary-500/50 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${perk.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <perk.icon className="w-7 h-7 text-white dark:text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-dark-900 dark:text-white text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {perk.title}
                            </h3>
                            <p className="text-sm text-dark-600 dark:text-dark-400">{perk.description}</p>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                </FloatingElement>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/register">
                <MagneticButton
                  size="xl"
                  className="rounded-full px-10 shadow-2xl shadow-primary-500/30"
                  magneticStrength={0.3}
                >
                  Find a Caregiver
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Layered Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <FloatingElement speed="slow">
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{ y: imageY }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent z-10" />

                <img
                  src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&h=900&fit=crop"
                  alt="Caregiver with elderly person"
                  className="w-full h-[600px] object-cover"
                />

                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-primary-500/50 via-transparent to-accent-500/50 bg-clip-border opacity-30" />
              </motion.div>
            </FloatingElement>

            {/* Floating Stat Cards */}
            <FloatingElement speed="medium" delay={200}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-8 -left-8 z-20"
              >
                <TiltCard glowEffect tiltIntensity={12}>
                  <div className="glass-intense rounded-2xl p-6 border border-primary-200 dark:border-primary-500/30 shadow-2xl backdrop-blur-xl w-48">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-success-500 rounded-full animate-scale-pulse" />
                      <span className="text-sm font-semibold text-dark-700 dark:text-dark-300">Active Now</span>
                    </div>
                    <p className="text-4xl font-bold text-dark-900 dark:text-white mb-1">
                      <AnimatedCounter end={500} suffix="+" />
                    </p>
                    <p className="text-sm text-dark-400">Caregivers Online</p>
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
                className="absolute -top-8 -right-8 z-20"
              >
                <TiltCard glowEffect tiltIntensity={12}>
                  <div className="glass-intense rounded-2xl p-6 border border-accent-200 dark:border-accent-500/30 shadow-2xl backdrop-blur-xl w-48">
                    <p className="text-5xl font-bold bg-gradient-to-br from-accent-400 to-accent-600 bg-clip-text text-transparent mb-1">
                      <AnimatedCounter end={4.9} suffix="/5" />
                    </p>
                    <p className="text-sm text-dark-400 font-medium">Family Satisfaction</p>
                  </div>
                </TiltCard>
              </motion.div>
            </FloatingElement>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
