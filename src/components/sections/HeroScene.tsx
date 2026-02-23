"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";

export function HeroScene() {
  return (
    <section className="min-h-screen pt-20 relative overflow-hidden bg-white dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="pt-12 lg:pt-20 pb-8">
          {/* Large Statement */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[12vw] sm:text-[10vw] lg:text-[8vw] font-bold leading-[0.85] tracking-tight text-dark-900 dark:text-white"
          >
            Care for those
            <br />
            <span className="text-primary-500">who cared for you.</span>
          </motion.h1>
        </div>

        {/* Bento Layout */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6 pb-20">
          {/* Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 md:col-span-5 lg:col-span-4 bg-dark-900 dark:bg-dark-800 rounded-3xl p-8 flex flex-col justify-between min-h-[280px]"
          >
            <p className="text-lg text-dark-300 leading-relaxed">
              Connect with vetted, compassionate caregivers who treat your elderly
              parents like family. Professional in-home care, simplified.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full px-6 bg-white text-dark-900 hover:bg-dark-100"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Find a Caregiver
                </Button>
              </Link>
              <Link href="/caregivers">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-6 text-white hover:bg-dark-800"
                >
                  Become a Caregiver
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Main Image - Elderly care */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 md:col-span-7 lg:col-span-5 rounded-3xl overflow-hidden min-h-[280px] group"
          >
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop"
              alt="Caregiver with elderly person"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>

          {/* Stats Card 1 - Families Helped */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="col-span-6 lg:col-span-3 bg-primary-500 rounded-3xl p-6 flex flex-col justify-center min-h-[140px] lg:min-h-[280px] transition-all duration-200"
          >
            <div className="text-4xl lg:text-5xl font-bold text-white">
              10,000+
            </div>
            <div className="text-primary-100 mt-1">Families Helped</div>
          </motion.div>

          {/* Stats Card 2 - Verified Caregivers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="col-span-6 lg:col-span-3 bg-dark-100 dark:bg-dark-800 rounded-3xl p-6 flex flex-col justify-center min-h-[140px] transition-all duration-200"
          >
            <div className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white">
              2,500+
            </div>
            <div className="text-dark-500 dark:text-dark-400 mt-1">
              Verified Caregivers
            </div>
          </motion.div>

          {/* Stats Card 3 - Average Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="col-span-6 lg:col-span-3 bg-accent-500 rounded-3xl p-6 flex flex-col justify-center min-h-[140px] transition-all duration-200"
          >
            <div className="text-4xl lg:text-5xl font-bold text-white">
              4.9
            </div>
            <div className="text-accent-100 mt-1">Average Rating</div>
          </motion.div>

          {/* Small Image - Caregiver portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="col-span-6 lg:col-span-3 rounded-3xl overflow-hidden min-h-[140px] group"
          >
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
              alt="Professional caregiver"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>

          {/* Social Proof Card - Full Width on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="col-span-12 lg:col-span-6 bg-dark-50 dark:bg-dark-900 rounded-3xl p-6 flex items-center justify-between min-h-[80px]"
          >
            <span className="text-dark-600 dark:text-dark-300">
              Join 500+ caregivers this month
            </span>
            <div className="flex -space-x-2">
              {/* Caregiver avatars */}
              {[
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-900 overflow-hidden"
                >
                  <img
                    src={src}
                    alt="Caregiver"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
