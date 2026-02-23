"use client";

import { useState, useEffect } from "react";
import { UserPlus, CheckCircle, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const activities = [
  {
    icon: UserPlus,
    text: "Sarah K. verified as a new caregiver",
    color: "text-primary-500",
    bg: "bg-primary-50 dark:bg-primary-900/20",
    time: "2m ago",
  },
  {
    icon: CheckCircle,
    text: "James M. found care for his mother",
    color: "text-success-500",
    bg: "bg-success-50 dark:bg-success-900/20",
    time: "5m ago",
  },
  {
    icon: Star,
    text: "Mary A. received a 5-star review",
    color: "text-warning-500",
    bg: "bg-warning-50 dark:bg-warning-900/20",
    time: "8m ago",
  },
  {
    icon: Heart,
    text: "David O. completed his 100th shift",
    color: "text-accent-500",
    bg: "bg-accent-50 dark:bg-accent-900/20",
    time: "12m ago",
  },
  {
    icon: UserPlus,
    text: "Grace N. joined as a certified caregiver",
    color: "text-primary-500",
    bg: "bg-primary-50 dark:bg-primary-900/20",
    time: "15m ago",
  },
  {
    icon: CheckCircle,
    text: "Peter K. booked weekly care sessions",
    color: "text-success-500",
    bg: "bg-success-50 dark:bg-success-900/20",
    time: "18m ago",
  },
];

export function LiveActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentActivity = activities[currentIndex];

  return (
    <section className="py-24 bg-dark-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white mb-4">
              Happening Right Now
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400">
              Real-time activity from our growing community
            </p>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-dark-950 rounded-3xl p-8 shadow-lg"
          >
            {/* Online Indicator */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-dark-100 dark:border-dark-800">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-success-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-dark-700 dark:text-dark-300">
                  1,200+ caregivers available now
                </span>
              </div>
              <span className="text-xs text-dark-500 dark:text-dark-500">LIVE</span>
            </div>

            {/* Activity Feed */}
            <div className="min-h-[120px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${currentActivity.bg} flex items-center justify-center flex-shrink-0`}>
                      <currentActivity.icon className={`w-6 h-6 ${currentActivity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-dark-900 dark:text-white font-medium mb-1">
                        {currentActivity.text}
                      </p>
                      <p className="text-sm text-dark-500 dark:text-dark-500">
                        {currentActivity.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {activities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-primary-500"
                      : "w-2 bg-dark-200 dark:bg-dark-700"
                  }`}
                  aria-label={`Go to activity ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
