"use client";

import { Search, UserCheck, Calendar, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { useState } from "react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Tell us your needs",
    description:
      "Share your loved one's care requirements, schedule preferences, and any special considerations.",
    details: [
      "Complete a simple intake form",
      "Specify care type and schedule",
      "Add any special requirements",
    ],
  },
  {
    icon: UserCheck,
    number: "02",
    title: "Meet verified caregivers",
    description:
      "Browse profiles of background-checked, trained caregivers with verified reviews from other families.",
    details: [
      "View detailed caregiver profiles",
      "Read reviews and ratings",
      "Check certifications and experience",
    ],
  },
  {
    icon: Calendar,
    number: "03",
    title: "Schedule care sessions",
    description:
      "Book regular visits or one-time appointments with flexible scheduling that fits your family.",
    details: [
      "Choose from available time slots",
      "Set recurring appointments",
      "Modify bookings anytime",
    ],
  },
  {
    icon: Heart,
    number: "04",
    title: "Experience peace of mind",
    description:
      "Stay connected with real-time updates, GPS check-ins, and detailed care reports after each visit.",
    details: [
      "Receive real-time notifications",
      "Track caregiver arrival/departure",
      "Get detailed care reports",
    ],
  },
];

export function HowItWorksScene() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-gradient-to-br from-dark-50 via-primary-50/20 to-accent-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 relative overflow-hidden">
      {/* Background Elements */}
      <GradientOrb
        size="lg"
        color="accent"
        blur="heavy"
        className="top-20 -left-20 opacity-10"
      />
      <GradientOrb
        size="md"
        color="mixed"
        blur="heavy"
        className="bottom-20 -right-20 opacity-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4"
          >
            Simple Process
          </motion.div>
          <h2 className="text-4xl lg:text-6xl font-bold text-dark-900 dark:text-white mb-6">
            Finding care shouldn't be
            <br />
            <span className="text-gradient-animated">complicated</span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
            Four simple steps to connect your loved ones with compassionate, professional caregivers
          </p>
        </motion.div>

        {/* Desktop: Horizontal Flowing Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Flowing Path */}
            <svg
              className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 z-0"
              viewBox="0 0 1200 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M 0 40 Q 300 10, 400 40 T 800 40 T 1200 40"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="var(--color-accent-500)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>

            {/* Step Cards */}
            <div className="grid grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isExpanded = expandedStep === index;

                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <TiltCard tiltIntensity={10}>
                      <motion.div
                        className={`relative glass-heavy rounded-3xl p-8 cursor-pointer border transition-all duration-500 ${
                          isExpanded
                            ? 'border-primary-500 shadow-2xl shadow-primary-500/20'
                            : 'border-dark-200/30 dark:border-dark-700/30 hover:border-primary-500/50'
                        }`}
                        onClick={() => setExpandedStep(isExpanded ? null : index)}
                        whileHover={{ y: -12 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Large Background Number */}
                        <div className="absolute top-4 right-4 text-[120px] font-black text-dark-100 dark:text-dark-800/30 leading-none select-none pointer-events-none">
                          {step.number}
                        </div>

                        {/* Icon floating in 3D space */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotateY: 15 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>

                        {/* Content */}
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-3">
                            {step.title}
                          </h3>
                          <p className="text-dark-600 dark:text-dark-400 leading-relaxed mb-4">
                            {step.description}
                          </p>

                          {/* Expanded Details */}
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: isExpanded ? 'auto' : 0,
                              opacity: isExpanded ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <ul className="space-y-2 pt-4 border-t border-dark-200 dark:border-dark-700">
                              {step.details.map((detail, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-400"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                                  {detail}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        </div>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                        </div>

                        {/* Connector Dot */}
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.5 }}
                          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full border-4 border-dark-50 dark:border-dark-900 shadow-lg z-20"
                        />
                      </motion.div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isExpanded = expandedStep === index;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-primary-500/50 to-transparent" />
                )}

                <TiltCard tiltIntensity={8}>
                  <motion.div
                    className={`relative glass-heavy rounded-3xl p-8 cursor-pointer border transition-all duration-500 ${
                      isExpanded
                        ? 'border-primary-500 shadow-2xl shadow-primary-500/20'
                        : 'border-dark-200/30 dark:border-dark-700/30'
                    }`}
                    onClick={() => setExpandedStep(isExpanded ? null : index)}
                  >
                    {/* Number Badge */}
                    <div className="absolute -left-4 top-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl z-20">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>

                    {/* Content */}
                    <div className="pl-16">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 pt-4 border-t border-dark-200 dark:border-dark-700">
                          {step.details.map((detail, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-400"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
