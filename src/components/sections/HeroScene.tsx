"use client";

import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Users, Zap, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { TiltCard } from "@/components/ui/TiltCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { GradientText } from "@/components/ui/GradientText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FloatingElement } from "@/components/ui/FloatingElement";
import { useEffect, useState } from "react";

const activities = [
  { name: "Mary J.", action: "found a caregiver", time: "2m ago" },
  { name: "John D.", action: "booked 10 hours", time: "5m ago" },
  { name: "Sarah K.", action: "joined MzaziCare", time: "8m ago" },
  { name: "David M.", action: "left 5-star review", time: "12m ago" },
  { name: "Lisa P.", action: "completed booking", time: "15m ago" },
];

const caregiverImages = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
];

export function HeroScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Care for those", "who cared", "for you."];

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev < words.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      className="min-h-screen pt-32 md:pt-24 pb-20 relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950"
      onMouseMove={handleMouseMove}
    >
      <GradientOrb
        size="xl"
        color="accent"
        blur="heavy"
        className="top-0 -right-32 opacity-30 dark:opacity-20"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      <GradientOrb
        size="lg"
        color="mixed"
        blur="heavy"
        className="bottom-20 -left-20 opacity-20 dark:opacity-15"
        style={{
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
        }}
      />
      <GradientOrb
        size="md"
        color="secondary"
        blur="medium"
        className="top-1/3 left-1/4 opacity-10 dark:opacity-5"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Experimental Bento Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Row 1 & 2: Headline Card (Full Width, 2 rows tall) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-12 row-span-2 relative z-10"
          >
            <h1 className="text-[11vw] sm:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw] font-extrabold leading-[0.9] tracking-tighter">
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: index <= wordIndex ? 1 : 0,
                    y: index <= wordIndex ? 0 : 20,
                  }}
                  transition={{ duration: 0.5 }}
                  className="block"
                >
                  {index === 1 || index === 2 ? (
                    <GradientText animated>{word}</GradientText>
                  ) : (
                    <span className="text-dark-900 dark:text-white">{word}</span>
                  )}
                </motion.span>
              ))}
            </h1>

            {/* Animated Gradient Underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="h-2 w-64 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-6 origin-left"
            />
          </motion.div>

          {/* Stat 1 - Overlapping headline bottom-right */}
          <FloatingElement speed="slow" delay={0} className="col-span-6 md:col-span-4 lg:col-span-3 md:absolute md:top-32 md:right-8 lg:right-16 z-20">
            <TiltCard tiltIntensity={8} glowEffect>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-heavy rounded-3xl p-6 lg:p-8 border border-primary-200/50 dark:border-primary-800/50 shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/5 relative overflow-hidden group"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animate-shimmer" />
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <div className="p-2 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl">
                    <Users className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                  </div>
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white">
                  <AnimatedCounter end={10000} formatK suffix="+" />
                </div>
                <div className="text-dark-600 dark:text-dark-400 font-medium mt-1">
                  Families Helped
                </div>
              </motion.div>
            </TiltCard>
          </FloatingElement>

          {/* Row 2: Description Card (Large, Dark) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="col-span-12 md:col-span-7 lg:col-span-5 mt-8 md:mt-0"
          >
            <TiltCard tiltIntensity={5}>
              <div className="relative bg-dark-900 dark:bg-dark-800 rounded-3xl p-8 lg:p-10 min-h-[320px] flex flex-col justify-between overflow-hidden group gradient-border-animated border border-dark-700 dark:border-dark-600">
                {/* Gradient Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <p className="text-xl lg:text-2xl text-dark-700 dark:text-dark-200 leading-relaxed font-medium">
                    Connect with <span className="text-dark-900 dark:text-white font-bold">vetted, compassionate caregivers</span> who treat your elderly parents like family. Professional in-home care, simplified.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8 relative z-10">
                  <Link href="/register">
                    <MagneticButton
                      size="lg"
                      className="rounded-full px-8 bg-white text-dark-900 hover:bg-dark-100 shadow-2xl w-full sm:w-auto"
                      magneticStrength={0.25}
                    >
                      Find a Caregiver
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </Link>
                  <Link href="/caregiver-onboarding">
                    <MagneticButton
                      size="lg"
                      variant="ghost"
                      className="rounded-full px-8 text-dark-200 dark:text-white hover:bg-dark-100 dark:hover:bg-dark-800 w-full sm:w-auto border border-dark-300 dark:border-dark-700"
                      magneticStrength={0.2}
                    >
                      Become a Caregiver
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Hero Image 1 (Main - Floating, rotated) */}
          <FloatingElement speed="medium" delay={200} className="col-span-12 md:col-span-5 lg:col-span-4 mt-8 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative rounded-3xl overflow-hidden min-h-[320px] group shadow-2xl border-2 border-white/20 dark:border-dark-700/30"
              style={{ transform: 'rotate(2deg)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop"
                alt="Caregiver with elderly person"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="glass-heavy rounded-2xl p-4 border border-dark-200/50 dark:border-white/20">
                  <p className="text-dark-900 dark:text-white font-semibold text-sm">Professional Care at Home</p>
                </div>
              </div>
            </motion.div>
          </FloatingElement>

          {/* Stat 2 - Small, elevated */}
          <FloatingElement speed="fast" delay={100} className="col-span-6 md:col-span-4 lg:col-span-3 mt-8 md:mt-0">
            <TiltCard tiltIntensity={12} glowEffect>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="glass-heavy rounded-2xl p-6 border border-accent-200/50 dark:border-accent-800/50 shadow-xl min-h-[160px] flex flex-col justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-accent-500 dark:text-accent-400 fill-accent-500 dark:fill-accent-400" />
                  </div>
                  <div className="text-4xl font-bold text-dark-900 dark:text-white">
                    <AnimatedCounter end={4.9} suffix="/5" />
                  </div>
                  <div className="text-dark-600 dark:text-dark-400 font-medium mt-1">
                    Average Rating
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          </FloatingElement>

          {/* Row 3: Small Image Gallery (3 circular images) */}
          <div className="col-span-12 md:col-span-8 lg:col-span-6 mt-4 grid grid-cols-3 gap-4">
            {caregiverImages.map((src, index) => (
              <FloatingElement key={index} speed="slow" delay={300 + index * 100}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.7 + index * 0.1 }}
                  className="relative rounded-full overflow-hidden aspect-square group shadow-2xl border-3 border-white dark:border-dark-800"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-accent-500/30 z-10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={src}
                    alt={`Professional caregiver ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-dark-900/90 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-500" />
                    </div>
                  </div>
                </motion.div>
              </FloatingElement>
            ))}
          </div>

          {/* Additional Image Card - Landscape */}
          <FloatingElement speed="medium" delay={500} className="col-span-12 md:col-span-6 lg:col-span-3 mt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="relative rounded-3xl overflow-hidden h-48 group shadow-xl border-2 border-white/20 dark:border-dark-700/30"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop"
                alt="Compassionate caregiving"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-white dark:text-white fill-white dark:fill-white" />
                  <p className="text-white dark:text-white font-bold text-sm">Compassionate Care</p>
                </div>
              </div>
            </motion.div>
          </FloatingElement>

          {/* CTA Card - Gradient, Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="col-span-12 md:col-span-6 lg:col-span-3 mt-4"
          >
            <TiltCard tiltIntensity={6}>
              <div className="relative rounded-3xl p-8 min-h-[200px] flex flex-col justify-between overflow-hidden group">
                {/* Animated Mesh Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-xl">
                      <Zap className="w-6 h-6 text-white dark:text-white" />
                    </div>
                    <span className="text-white/90 dark:text-white/90 font-semibold">Limited Time</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white dark:text-white mb-2">
                    Get 20% off your first month
                  </h3>
                  <p className="text-white/80 dark:text-white/80 font-medium">
                    Join hundreds of families who found trusted care
                  </p>
                </div>

                <div className="mt-6 relative z-10">
                  <Link href="/register">
                    <MagneticButton
                      size="lg"
                      className="rounded-full px-8 bg-white text-primary-600 hover:bg-dark-50 shadow-2xl font-bold"
                      magneticStrength={0.3}
                    >
                      Claim Offer
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Stat 3 - Minimal */}
          <FloatingElement speed="medium" delay={400} className="col-span-6 md:col-span-3 lg:col-span-2 mt-4">
            <TiltCard tiltIntensity={10} glowEffect>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="glass-heavy rounded-2xl p-6 border border-success-200/50 dark:border-success-800/50 shadow-xl min-h-[160px] flex flex-col justify-center group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success-500 dark:text-success-400" />
                </div>
                <div className="text-4xl font-bold text-dark-900 dark:text-white">
                  <AnimatedCounter end={2500} formatK suffix="+" />
                </div>
                <div className="text-dark-600 dark:text-dark-400 font-medium mt-1">
                  Caregivers
                </div>
              </motion.div>
            </TiltCard>
          </FloatingElement>

          {/* Avatar Stack - Floating */}
          <FloatingElement speed="slow" delay={500} className="col-span-6 md:col-span-3 lg:col-span-4 mt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              className="glass-heavy rounded-2xl p-6 border border-dark-200/50 dark:border-dark-700/50 shadow-xl min-h-[160px] flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 animate-glow-pulse" />

              <div className="relative z-10">
                <div className="flex -space-x-3 mb-3">
                  {[
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                  ].map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
                      className="w-12 h-12 rounded-full border-3 border-white dark:border-dark-900 overflow-hidden shadow-lg hover:scale-110 transition-transform"
                    >
                      <img
                        src={src}
                        alt="Caregiver"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.5 }}
                    className="w-12 h-12 rounded-full bg-primary-500 border-3 border-white dark:border-dark-900 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  >
                    +500
                  </motion.div>
                </div>
                <p className="text-sm text-dark-600 dark:text-dark-400 font-medium">
                  Joined this month
                </p>
              </div>
            </motion.div>
          </FloatingElement>

          {/* Row 4: Live Activity Ticker - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="col-span-12 mt-4"
          >
            <div className="glass-heavy rounded-2xl p-4 border-t border-primary-200/30 dark:border-primary-700/30 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

              <div className="flex gap-4 overflow-hidden">
                <motion.div
                  animate={{ x: [0, -1000] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="flex gap-4 flex-shrink-0"
                >
                  {[...activities, ...activities].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-dark-800/50 rounded-xl backdrop-blur-sm border border-dark-200/30 dark:border-dark-700/30 whitespace-nowrap"
                    >
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-scale-pulse" />
                      <span className="text-sm font-medium text-dark-900 dark:text-white">
                        {activity.name}
                      </span>
                      <span className="text-sm text-dark-500 dark:text-dark-400">
                        {activity.action}
                      </span>
                      <span className="text-xs text-dark-400 dark:text-dark-500">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
