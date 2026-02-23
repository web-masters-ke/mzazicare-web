"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui";

const testimonials = [
  {
    id: 1,
    content:
      "Finding a caregiver for my mother was overwhelming until I found MzaziCare. Within days, we were matched with Sarah, who has become like family. The peace of mind is priceless.",
    author: "Michelle K.",
    role: "Daughter of care recipient",
    location: "Nairobi",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    content:
      "As a caregiver, MzaziCare has transformed my career. The platform connects me with families who truly value what I do, and the support from the team is exceptional.",
    author: "Grace M.",
    role: "Professional Caregiver",
    location: "Mombasa",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    content:
      "The real-time updates and GPS tracking give us comfort knowing Dad is safe. We can see exactly when the caregiver arrives and get detailed reports after each visit.",
    author: "James O.",
    role: "Son of care recipient",
    location: "Kisumu",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 4,
    content:
      "What sets MzaziCare apart is their verification process. We could see the caregiver's background check, certifications, and reviews from other families before making a decision.",
    author: "Catherine W.",
    role: "Family caregiver coordinator",
    location: "Nakuru",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
  },
  {
    id: 5,
    content:
      "The scheduling flexibility is amazing. We needed weekend care and found the perfect match within hours. The booking process couldn't be simpler.",
    author: "David M.",
    role: "Son of care recipient",
    location: "Eldoret",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
  {
    id: 6,
    content:
      "Being part of MzaziCare's caregiver network has given me steady work and fair compensation. The families I work with are wonderful and respectful.",
    author: "Mary A.",
    role: "Professional Caregiver",
    location: "Thika",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
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

export function TestimonialsScene() {
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
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white mb-4">
            Trusted by families across Kenya
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            See what families and caregivers are saying about their experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-dark-900 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-dark-100 dark:border-dark-800"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-warning-500 text-warning-500"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-dark-700 dark:text-dark-300 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-dark-100 dark:border-dark-800">
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  size="md"
                />
                <div>
                  <p className="font-semibold text-dark-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-dark-500 dark:text-dark-500">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
