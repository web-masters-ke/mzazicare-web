"use client";

import { Shield, Clock, Calendar, CreditCard, CheckCircle, Home } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Verified & Trained Caregivers",
    description: "All caregivers undergo thorough background checks, training, and certification before joining our platform.",
    icon: Shield,
    iconBg: "bg-primary-500",
    cardBg: "bg-primary-50 dark:bg-primary-950/30",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    height: "min-h-[240px]",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock assistance for families and caregivers. We're here whenever you need us.",
    icon: Clock,
    iconBg: "bg-success-500",
    cardBg: "bg-white dark:bg-dark-900",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    height: "min-h-[240px] lg:min-h-[320px]",
  },
  {
    title: "Flexible Scheduling",
    description: "Book care on your terms - hourly, daily, or long-term arrangements available.",
    icon: Calendar,
    iconBg: "bg-accent-500",
    cardBg: "bg-white dark:bg-dark-900",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    height: "min-h-[240px]",
  },
  {
    title: "Secure Payments",
    description: "Safe, transparent payment processing with detailed invoicing.",
    icon: CreditCard,
    iconBg: "bg-warning-500",
    cardBg: "bg-warning-50 dark:bg-warning-950/30",
    span: "col-span-6 lg:col-span-3",
    height: "min-h-[180px]",
  },
  {
    title: "Background Checks",
    description: "Comprehensive verification for your peace of mind.",
    icon: CheckCircle,
    iconBg: "bg-primary-500",
    cardBg: "bg-dark-100 dark:bg-dark-800",
    span: "col-span-6 lg:col-span-3",
    height: "min-h-[180px]",
  },
  {
    title: "In-Home & Facility Care",
    description: "Whether at home or in assisted living, our caregivers provide personalized support tailored to your loved one's needs.",
    icon: Home,
    iconBg: "bg-accent-500",
    cardBg: "bg-accent-50 dark:bg-accent-950/30",
    span: "col-span-12 lg:col-span-6",
    height: "min-h-[180px]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesScene() {
  return (
    <section className="py-24 bg-dark-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white mb-4">
            Why Families Choose Us
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Professional elderly care with the compassion your loved ones deserve
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-12 gap-4 lg:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`${feature.span} ${feature.height} ${feature.cardBg} rounded-3xl p-6 lg:p-8 flex flex-col justify-between transition-all duration-200`}
            >
              <div>
                <div className={`w-12 h-12 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
