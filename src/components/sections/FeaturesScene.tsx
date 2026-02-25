"use client";

import { Shield, Clock, Calendar, CreditCard, CheckCircle, Home } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { useState } from "react";

const features = [
  {
    title: "Verified & Trained Caregivers",
    description: "All caregivers undergo thorough background checks, training, and certification before joining our platform.",
    expandedDescription: "Our comprehensive vetting process includes criminal background checks, reference verification, skills assessment, and ongoing training programs to ensure the highest quality of care.",
    icon: Shield,
    iconGradient: "from-primary-500 to-primary-600",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    zIndex: "z-30",
    offset: "lg:translate-y-4",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock assistance for families and caregivers. We're here whenever you need us.",
    expandedDescription: "Our dedicated support team is available day and night to address any concerns, emergencies, or questions you may have about your care arrangements.",
    icon: Clock,
    iconGradient: "from-success-500 to-success-600",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    zIndex: "z-20",
    offset: "lg:-translate-y-2",
  },
  {
    title: "Flexible Scheduling",
    description: "Book care on your terms - hourly, daily, or long-term arrangements available.",
    expandedDescription: "Whether you need a few hours of respite care or ongoing daily assistance, our platform adapts to your schedule and changing needs.",
    icon: Calendar,
    iconGradient: "from-accent-500 to-accent-600",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    zIndex: "z-10",
    offset: "lg:translate-y-6",
  },
  {
    title: "Secure Payments",
    description: "Safe, transparent payment processing with detailed invoicing.",
    expandedDescription: "Bank-level encryption, automated billing, and clear pricing ensure stress-free financial transactions.",
    icon: CreditCard,
    iconGradient: "from-warning-500 to-warning-600",
    span: "col-span-6 lg:col-span-3",
    zIndex: "z-40",
    offset: "lg:-translate-y-8",
  },
  {
    title: "Background Checks",
    description: "Comprehensive verification for your peace of mind.",
    expandedDescription: "Multi-level screening including identity verification, employment history, and professional certifications.",
    icon: CheckCircle,
    iconGradient: "from-primary-500 to-accent-500",
    span: "col-span-6 lg:col-span-3",
    zIndex: "z-30",
    offset: "lg:translate-y-2",
  },
  {
    title: "In-Home & Facility Care",
    description: "Whether at home or in assisted living, our caregivers provide personalized support tailored to your loved one's needs.",
    expandedDescription: "From companionship and meal preparation to medication reminders and mobility assistance, we cover all aspects of elderly care.",
    icon: Home,
    iconGradient: "from-info-500 to-info-600",
    span: "col-span-12 lg:col-span-6",
    zIndex: "z-20",
    offset: "lg:-translate-y-4",
  },
];

export function FeaturesScene() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 lg:py-32 bg-gradient-to-b from-white via-dark-50 to-white dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <GradientOrb
        size="xl"
        color="accent"
        blur="heavy"
        className="-top-40 -left-40 opacity-10"
      />
      <GradientOrb
        size="lg"
        color="mixed"
        blur="heavy"
        className="top-1/2 -right-32 opacity-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4"
          >
            Why Choose MzaziCare
          </motion.div>
          <h2 className="text-4xl lg:text-6xl font-bold text-dark-900 dark:text-white mb-6">
            Professional Care,
            <br />
            <span className="text-gradient-animated">Compassionate Service</span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-dark-400 max-w-3xl mx-auto leading-relaxed">
            Everything you need to provide the best care for your elderly loved ones
          </p>
        </motion.div>

        {/* Offset Depth Grid */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isExpanded = expandedCard === index;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${feature.span} ${feature.zIndex} relative`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <TiltCard tiltIntensity={8}>
                  <motion.div
                    className={`glass-heavy rounded-3xl p-8 min-h-[280px] flex flex-col relative overflow-hidden group cursor-pointer border transition-all duration-500 ${
                      isExpanded
                        ? 'border-primary-500/50 shadow-2xl shadow-primary-500/20'
                        : 'border-dark-200/30 dark:border-dark-700/30 hover:border-primary-500/30'
                    } ${feature.offset}`}
                    onClick={() => setExpandedCard(isExpanded ? null : index)}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Gradient Border Animation */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          background: `linear-gradient(135deg, transparent 0%, rgba(255,107,61,0.1) 50%, transparent 100%)`,
                          backgroundSize: '200% 200%',
                          animation: 'gradient-shift 3s ease infinite',
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon with Animated Gradient */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className={`w-14 h-14 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-dark-600 dark:text-dark-400 leading-relaxed mb-4 flex-1">
                        {feature.description}
                      </p>

                      {/* Expanded Content */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-dark-200 dark:border-dark-700">
                          <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed">
                            {feature.expandedDescription}
                          </p>
                        </div>
                      </motion.div>

                      {/* Hover Indicator */}
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
                        <motion.svg
                          animate={{ x: isExpanded ? 0 : [0, 4, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </div>
                    </div>

                    {/* Shimmer Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
                    </div>
                  </motion.div>
                </TiltCard>

                {/* Connecting Lines (decorative) */}
                {index < features.length - 1 && index % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary-500/50 to-transparent pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
