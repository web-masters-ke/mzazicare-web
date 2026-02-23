"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui";

const benefits = [
  "Flexible schedules that work around your life",
  "Competitive pay with weekly payments",
  "Free training and certification programs",
  "Join a supportive community of caregivers",
  "Insurance coverage and legal protection",
  "Career growth and advancement opportunities",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function ForCaregivers() {
  return (
    <section className="py-24 bg-white dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=900&fit=crop"
                alt="Professional caregiver"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Floating stat badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-6 right-6 bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-2xl"
            >
              <p className="text-3xl font-bold text-accent-500">500+</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">Joined This Month</p>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white mb-6">
              Build a rewarding career
              <br />
              <span className="text-accent-500">helping families</span>
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 mb-8 leading-relaxed">
              Make a real difference in people's lives while enjoying the flexibility
              and support you deserve. Join Kenya's fastest-growing caregiving platform.
            </p>

            {/* Benefits List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-4 mb-8"
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <p className="text-dark-700 dark:text-dark-300">{benefit}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <Link href="/caregivers/register">
              <Button size="lg" variant="primary" className="rounded-full bg-accent-500 hover:bg-accent-600">
                Become a Caregiver
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
