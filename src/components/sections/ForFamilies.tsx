"use client";

import { Shield, Clock, DollarSign, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui";

const perks = [
  {
    icon: Shield,
    title: "Vetted Caregivers",
    description: "Background-checked professionals you can trust",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Schedule care that fits your family's needs",
  },
  {
    icon: DollarSign,
    title: "Affordable Rates",
    description: "Quality care at transparent, competitive pricing",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "We're here whenever you need assistance",
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

export function ForFamilies() {
  return (
    <section className="py-24 bg-dark-900 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Peace of mind.
              <br />
              Professional care.
              <br />
              <span className="text-primary-400">Your loved ones deserve it.</span>
            </h2>
            <p className="text-lg text-dark-300 mb-8 leading-relaxed">
              Finding the right caregiver for your elderly parents shouldn't be stressful.
              We connect you with compassionate, trained professionals who provide
              the highest quality in-home care.
            </p>

            {/* Perks Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
            >
              {perks.map((perk) => (
                <motion.div
                  key={perk.title}
                  variants={itemVariants}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <perk.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{perk.title}</h3>
                    <p className="text-sm text-dark-400">{perk.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <Link href="/register">
              <Button size="lg" className="rounded-full">
                Find a Caregiver
              </Button>
            </Link>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&h=900&fit=crop"
                alt="Caregiver with elderly person"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Floating stat badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-6 left-6 bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-2xl"
            >
              <p className="text-3xl font-bold text-primary-500">4.9/5</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">Family Satisfaction</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
