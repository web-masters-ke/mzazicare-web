"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";

export function CTAScene() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-10 md:p-16 text-center border border-white/20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Ready to give your loved ones
            <br />
            <span className="text-accent-200">the care they deserve?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-primary-100 max-w-2xl mx-auto mb-10"
          >
            Join thousands of families who have found trusted, compassionate
            caregivers through MzaziCare. Your journey to peace of mind starts
            here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <Button
                size="xl"
                className="rounded-full px-8 bg-white text-primary-600 hover:bg-primary-50 shadow-2xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Find a Caregiver
              </Button>
            </Link>
            <Link href="/caregivers/register">
              <Button
                size="xl"
                className="rounded-full px-8 bg-accent-500 hover:bg-accent-600 text-white shadow-xl"
              >
                Become a Caregiver
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
