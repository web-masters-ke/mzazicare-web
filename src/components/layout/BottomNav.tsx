"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import {
  Home,
  Calendar,
  Heart,
  Users,
  Wallet,
  MessageSquare,
  Briefcase,
  TrendingUp,
  User as UserIcon,
} from 'lucide-react';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useAuth();

  const familyNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Elderly', href: '/dashboard/elderly', icon: Heart },
    { name: 'Caregivers', href: '/dashboard/caregivers', icon: Users },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  ];

  const caregiverNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Earnings', href: '/dashboard/earnings', icon: TrendingUp },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  ];

  const navItems = userRole === UserRole.CAREGIVER ? caregiverNavItems : familyNavItems;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Spacer for bottom nav */}
      <div className="h-20" />

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-2xl border-t border-dark-100/50 dark:border-dark-800/50 safe-area-bottom"
      >
        <div className="max-w-screen-xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-around h-20">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className="relative flex flex-col items-center justify-center flex-1 h-full group"
                >
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Icon Container */}
                  <div className="relative">
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 -m-2 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl"
                      />
                    )}
                    <motion.div
                      animate={{
                        scale: active ? 1.1 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`relative p-2 rounded-2xl transition-colors ${
                        active
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                          : 'bg-transparent'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 transition-colors ${
                          active
                            ? 'text-white'
                            : 'text-dark-600 dark:text-dark-400 group-hover:text-primary-500'
                        }`}
                      />
                    </motion.div>
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs font-medium mt-1 transition-colors ${
                      active
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-dark-600 dark:text-dark-400 group-hover:text-primary-500'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
