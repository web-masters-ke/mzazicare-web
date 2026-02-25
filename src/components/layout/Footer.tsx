"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "For Families", href: "#for-families" },
    { label: "For Caregivers", href: "/caregiver-onboarding" },
    { label: "Help Center", href: "/help" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Safety", href: "/safety" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const contactInfo = [
  { icon: Mail, text: "hello@mzazicare.com" },
  { icon: Phone, text: "+254 700 000 000" },
  { icon: MapPin, text: "Nairobi, Kenya" },
];

export function Footer() {
  return (
    <footer className="relative bg-dark-50 dark:bg-dark-950 overflow-hidden">
      {/* Glass Effect Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-dark-900 dark:text-white">
                Mzazi<span className="text-primary-500">Care</span>
              </span>
            </Link>
            <p className="text-base text-dark-600 dark:text-dark-400 mb-6 leading-relaxed max-w-sm">
              Connecting families with trusted caregivers for elderly parents. Professional in-home care, simplified.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-dark-100 dark:bg-dark-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Social Links with Glass Effect */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-11 h-11 rounded-xl glass-heavy border border-dark-200/50 dark:border-dark-700/50 flex items-center justify-center text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns - Horizontal Layout on Desktop */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <h4 className="text-sm font-bold text-dark-900 dark:text-white uppercase tracking-wider mb-5">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: linkIndex * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 inline-block relative group"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar with Glass Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-dark-200 dark:border-dark-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-dark-600 dark:text-dark-500">
              © {new Date().getFullYear()} MzaziCare. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <ThemeToggle />
              <div className="flex items-center gap-2 px-4 py-2 glass-heavy rounded-full border border-dark-200/50 dark:border-dark-700/50">
                <span className="text-sm text-dark-600 dark:text-dark-400">Made with</span>
                <Heart className="w-4 h-4 text-accent-500 fill-accent-500 animate-scale-pulse" />
                <span className="text-sm text-dark-600 dark:text-dark-400">in Kenya</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle gradient glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
    </footer>
  );
}
