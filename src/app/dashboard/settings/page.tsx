"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Users,
  Wallet,
  CreditCard,
  Bell,
  Globe,
  Settings as SettingsIcon,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Info,
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
  danger?: boolean;
  showArrow?: boolean;
}

function MenuItem({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-primary-500',
  onClick,
  danger = false,
  showArrow = true,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors ${
        danger ? 'hover:bg-red-50 dark:hover:bg-red-900/10' : ''
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          danger
            ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p
          className={`font-medium ${
            danger
              ? 'text-red-600 dark:text-red-400'
              : 'text-dark-900 dark:text-white'
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-dark-600 dark:text-dark-400">{subtitle}</p>
        )}
      </div>
      {badge && (
        <span
          className={`${badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}
        >
          {badge}
        </span>
      )}
      {showArrow && !danger && (
        <ChevronRight className="w-5 h-5 text-dark-400" />
      )}
    </button>
  );
}

function SettingsContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />

      <div className="relative pb-24 pt-8 px-4 sm:px-6 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
            Settings & More
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
            Account
          </h2>
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden">
            <MenuItem
              icon={<User className="w-5 h-5" />}
              title="Personal Information"
              subtitle="Update your profile details"
              onClick={() => router.push('/dashboard/profile')}
            />
            <div className="border-t border-dark-100 dark:border-dark-800" />
            <MenuItem
              icon={<Users className="w-5 h-5" />}
              title="Family Members"
              subtitle="Manage elderly profiles"
              onClick={() => router.push('/dashboard/elderly')}
            />
            <div className="border-t border-dark-100 dark:border-dark-800" />
            <MenuItem
              icon={<Wallet className="w-5 h-5" />}
              title="Wallet"
              subtitle="View balance and transactions"
              onClick={() => router.push('/dashboard/wallet')}
            />
            <div className="border-t border-dark-100 dark:border-dark-800" />
            <MenuItem
              icon={<CreditCard className="w-5 h-5" />}
              title="Payment Methods"
              subtitle="Manage payment options"
              onClick={() => toast('Payment methods coming soon', { icon: '🚧' })}
            />
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
            Preferences
          </h2>
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden">
            <MenuItem
              icon={<Bell className="w-5 h-5" />}
              title="Notifications"
              subtitle="Manage notification preferences"
              onClick={() => toast('Notifications settings coming soon', { icon: '🚧' })}
            />
            <div className="border-t border-dark-100 dark:border-dark-800" />
            <MenuItem
              icon={<Globe className="w-5 h-5" />}
              title="Language"
              subtitle="English"
              onClick={() => toast('Language selection coming soon', { icon: '🚧' })}
            />
            <div className="border-t border-dark-100 dark:border-dark-800" />
            <MenuItem
              icon={<SettingsIcon className="w-5 h-5" />}
              title="App Settings"
              subtitle="Theme, security, and more"
              onClick={() => toast('Advanced settings coming soon', { icon: '🚧' })}
            />
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
            Support
          </h2>
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden">
            <MenuItem
              icon={<HelpCircle className="w-5 h-5" />}
              title="Help Center"
              subtitle="Get help and support"
              onClick={() => toast('Help center coming soon', { icon: '🚧' })}
            />
            <div className="border-t border-dark-100 dark:border-dark-800" />
            <MenuItem
              icon={<Shield className="w-5 h-5" />}
              title="Privacy Policy"
              subtitle="View our privacy practices"
              onClick={() => toast('Privacy policy coming soon', { icon: '🚧' })}
            />
            <div className="border-t border-dark-100 dark:border-dark-800" />
            <MenuItem
              icon={<FileText className="w-5 h-5" />}
              title="Terms of Service"
              subtitle="Read our terms and conditions"
              onClick={() => toast('Terms of service coming soon', { icon: '🚧' })}
            />
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
            About
          </h2>
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden">
            <MenuItem
              icon={<Info className="w-5 h-5" />}
              title="App Version"
              subtitle="1.0.0"
              onClick={() => {}}
              showArrow={false}
            />
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden">
            <MenuItem
              icon={<LogOut className="w-5 h-5" />}
              title="Log Out"
              subtitle="Sign out of your account"
              onClick={() => setShowLogoutModal(true)}
              danger
              showArrow={false}
            />
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-sm w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
              Log Out
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="flex-1"
              >
                Log Out
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
