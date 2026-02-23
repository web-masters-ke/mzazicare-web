"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui";
import { Quote } from "lucide-react";

const stories = [
  {
    quote: "Finding Mary was a blessing. She treats my mother like her own and the companionship has made such a difference in Mom's happiness.",
    name: "James Kamau",
    role: "Son of Care Recipient",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&h=400&fit=crop",
  },
  {
    quote: "As a caregiver, MzaziCare gave me the flexibility to build my career while still being there for my own family. The training was excellent.",
    name: "Grace Wanjiru",
    role: "Certified Caregiver",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop",
  },
  {
    quote: "The peace of mind knowing Dad has reliable care while I'm at work is priceless. The GPS check-ins and daily reports keep me connected.",
    name: "Sarah Muthoni",
    role: "Daughter of Care Recipient",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&h=400&fit=crop",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function SuccessStories() {
  return (
    <section className="py-24 bg-dark-50 dark:bg-dark-900">
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
            Stories from our community
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Real experiences from families and caregivers across Kenya
          </p>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-dark-950 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent z-10" />
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
                <Quote className="absolute top-4 right-4 w-12 h-12 text-white/20 z-20" />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-dark-700 dark:text-dark-300 leading-relaxed mb-6 italic">
                  "{story.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar
                    src={story.avatar}
                    alt={story.name}
                    size="md"
                  />
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-white">
                      {story.name}
                    </p>
                    <p className="text-sm text-dark-500 dark:text-dark-500">
                      {story.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
