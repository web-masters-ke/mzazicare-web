"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, Star, Users, Heart, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "#features", label: "Features", icon: Star },
  { href: "#for-families", label: "For Families", icon: Users },
  { href: "#for-caregivers", label: "For Caregivers", icon: Heart },
  { href: "#how-it-works", label: "How It Works", icon: Home },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
];

export function LandingNav() {
  const [scrollY, setScrollY] = useState(0);
  const [isSidebar, setIsSidebar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsSidebar(currentScrollY > 200);

      // Track active section
      const sections = navLinks.map(link => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate scroll progress
  const scrollProgress = typeof document !== 'undefined'
    ? Math.min(
        (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
        100
      )
    : 0;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Navigation - Morphing */}
      <motion.nav
        className={cn(
          "fixed z-50 hidden md:block transition-all duration-500 ease-out",
          isSidebar ? "left-4 top-4 bottom-4" : "top-0 left-0 right-0"
        )}
        initial={false}
        animate={{
          width: isSidebar ? "80px" : "100%",
        }}
      >
        <div
          className={cn(
            "relative h-full transition-all duration-500 backdrop-blur-xl border",
            isSidebar
              ? "glass-heavy rounded-3xl border-dark-200/50 dark:border-dark-700/50 shadow-2xl"
              : "glass rounded-none border-transparent border-b border-dark-200/50 dark:border-dark-700/50 shadow-sm"
          )}
        >
          {/* Scroll Progress Bar */}
          {isSidebar && (
            <motion.div
              className="absolute left-0 top-0 w-1 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"
              style={{ height: `${scrollProgress}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Horizontal Nav (Top) */}
          {!isSidebar && (
            <motion.div
              className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-dark-900 dark:text-white tracking-tight">
                  Mzazi<span className="text-primary-500">Care</span>
                </span>
              </Link>

              {/* Nav Links */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2",
                        activeSection === link.href
                          ? "bg-primary-500 text-white shadow-colored"
                          : "text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-800"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link href="/login">
                  <Button variant="ghost" size="md">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="md">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Vertical Sidebar (Scrolled) */}
          {isSidebar && (
            <motion.div
              className="h-full flex flex-col items-center py-6 px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Logo Icon */}
              <Link
                href="/"
                className="mb-8 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl shadow-lg hover:scale-110 transition-transform"
              >
                MC
              </Link>

              {/* Nav Icons */}
              <div className="flex-1 flex flex-col gap-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeSection === link.href;

                  return (
                    <div key={link.href} className="relative group">
                      <Link
                        href={link.href}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative",
                          isActive
                            ? "bg-primary-500 text-white shadow-glow"
                            : "text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {isActive && (
                          <motion.div
                            className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full"
                            layoutId="activeIndicator"
                          />
                        )}
                      </Link>

                      {/* Tooltip */}
                      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-dark-900 dark:bg-dark-100 text-white dark:text-dark-900 text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                        {link.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-8 border-transparent border-r-dark-900 dark:border-r-dark-100" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              <div className="mt-4">
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div
          className={cn(
            "transition-all duration-300",
            scrollY > 20
              ? "py-3 glass-heavy border-b border-dark-200/50 dark:border-dark-700/50 shadow-lg"
              : "py-5 bg-transparent"
          )}
        >
          <div className="px-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-dark-900 dark:text-white tracking-tight">
                Mzazi<span className="text-primary-500">Care</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-dark-900 dark:text-white hover:bg-dark-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 md:hidden glass-intense pt-20"
          >
            <div className="h-full overflow-y-auto px-6 py-8 space-y-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 text-base font-semibold rounded-2xl transition-all",
                        activeSection === link.href
                          ? "bg-primary-500 text-white shadow-glow"
                          : "text-dark-900 dark:text-white hover:bg-dark-100 dark:hover:bg-dark-800"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="pt-6 space-y-3"
              >
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" size="lg" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
