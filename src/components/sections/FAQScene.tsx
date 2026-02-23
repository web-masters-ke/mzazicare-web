"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How are caregivers verified?",
    answer:
      "Every caregiver goes through our rigorous 7-step verification process including national ID verification, criminal background checks, reference checks, skills assessment, health screening, training verification, and an in-person interview. Only about 15% of applicants make it through our vetting process.",
  },
  {
    question: "Can I choose my own caregiver?",
    answer:
      "Absolutely! You can browse caregiver profiles, view their qualifications, read reviews from other families, and select the caregiver that best fits your needs. You can also let our matching algorithm recommend caregivers based on your specific requirements.",
  },
  {
    question: "What happens in case of an emergency?",
    answer:
      "Our caregivers are trained in basic first aid and emergency protocols. In case of a medical emergency, they will immediately contact emergency services and notify you. Our 24/7 support team is always available to coordinate emergency responses and provide guidance.",
  },
  {
    question: "How does scheduling work?",
    answer:
      "You can book care sessions through our app or website. Choose from one-time visits, recurring schedules (daily, weekly, monthly), or request immediate care for urgent needs. You can easily modify or cancel bookings with our flexible scheduling system.",
  },
  {
    question: "What services do caregivers provide?",
    answer:
      "Our caregivers offer a wide range of services including daily living assistance, medication management, meal preparation, companionship, transportation, health monitoring, light housekeeping, and specialized care for conditions like dementia or post-surgery recovery.",
  },
  {
    question: "How do payments work?",
    answer:
      "We accept M-Pesa, credit/debit cards, and bank transfers. Subscription plans are billed monthly or annually. For pay-per-service, you're only charged for completed visits. All transactions are secure and you receive detailed receipts for every payment.",
  },
  {
    question: "Can I track caregiver visits?",
    answer:
      "Yes! Our app provides real-time GPS tracking so you can see when the caregiver arrives and leaves. You also receive instant notifications for check-ins and check-outs, plus detailed visit reports including tasks completed and any observations.",
  },
  {
    question: "What if I'm not satisfied with a caregiver?",
    answer:
      "Your satisfaction is our priority. If you're not happy with a caregiver, you can request a different one at any time at no extra cost. Our support team will work with you to find a better match and address any concerns promptly.",
  },
];

export function FAQScene() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-dark-50 dark:bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-400">
            Everything you need to know about finding and booking elderly care
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`bg-white dark:bg-dark-950 rounded-2xl border-2 transition-all duration-200 ${
                openIndex === index
                  ? "border-primary-500 shadow-lg"
                  : "border-dark-200 dark:border-dark-800"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
              >
                <span className="text-lg font-semibold text-dark-900 dark:text-white">
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index
                      ? "bg-primary-500 text-white"
                      : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400"
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-dark-600 dark:text-dark-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
