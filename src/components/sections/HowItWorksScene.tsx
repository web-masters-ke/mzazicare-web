"use client";

import { Search, UserCheck, Calendar, Heart } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Tell us your needs",
    description:
      "Share your loved one's care requirements, schedule preferences, and any special considerations.",
  },
  {
    icon: UserCheck,
    number: "02",
    title: "Meet verified caregivers",
    description:
      "Browse profiles of background-checked, trained caregivers with verified reviews from other families.",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Schedule care sessions",
    description:
      "Book regular visits or one-time appointments with flexible scheduling that fits your family.",
  },
  {
    icon: Heart,
    number: "04",
    title: "Experience peace of mind",
    description:
      "Stay connected with real-time updates, GPS check-ins, and detailed care reports after each visit.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function HowItWorksScene() {
  return (
    <section className="py-24 bg-white dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-primary-500 text-sm font-bold uppercase tracking-widest mb-4">
            Simple Process
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white mb-6">
            Finding care shouldn't be{" "}
            <span className="text-primary-500">complicated</span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Four simple steps to connect your loved ones with compassionate,
            professional caregivers.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="h-full bg-white dark:bg-dark-900 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-dark-100 dark:border-dark-800">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-colored">
                  <span className="text-xl font-bold text-white">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-6 mt-4">
                  <step.icon className="w-7 h-7 text-primary-500" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
