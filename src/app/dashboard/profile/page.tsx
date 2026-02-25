"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Users,
  Wallet,
  CreditCard,
  Bell,
  Globe,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Info,
  Edit,
  Mail,
  Phone,
  Camera,
  Briefcase,
  DollarSign,
  Calendar,
  Star,
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

function ProfileContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handlePhotoUpload = () => {
    setShowPhotoModal(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950">
        <DashboardNav />
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />

      <div className="relative pb-24 pt-8 px-4 sm:px-6 max-w-3xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-6">
            My Profile
          </h1>

          {/* Profile Card */}
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6">
            <div className="flex items-start gap-6">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {user.profilePhotoUrl || user.profilePhoto ? (
                    <img
                      src={user.profilePhotoUrl || user.profilePhoto}
                      alt={user.fullName || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.fullName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <button
                  onClick={handlePhotoUpload}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                  {user.fullName || 'User'}
                </h2>
                <div className="space-y-2">
                  {user.email && (
                    <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                      {user.role === 'FAMILY_USER' ? 'Family User' : user.role === 'CAREGIVER' ? 'Caregiver' : user.role}
                    </span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Edit className="w-4 h-4" />}
                  onClick={() => router.push('/dashboard/profile/edit')}
                  className="mt-4"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Caregiver Settings Section - Only for Caregivers */}
        {user.role === 'CAREGIVER' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
              Professional Profile
            </h2>

            {/* Featured Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border-2 border-green-300 dark:border-green-700 p-6 mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
                    Set Your Rates & Services
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                    Manage your professional profile: set hourly rates for each service, add your experience, and update your availability to start getting bookings.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<DollarSign className="w-4 h-4" />}
                    onClick={() => router.push('/dashboard/caregiver/settings')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Manage Professional Settings
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden">
              <MenuItem
                icon={<DollarSign className="w-5 h-5" />}
                title="Skills & Hourly Rates"
                subtitle="Set your rates for each service"
                onClick={() => router.push('/dashboard/caregiver/settings?tab=skills')}
              />
              <div className="border-t border-dark-100 dark:border-dark-800" />
              <MenuItem
                icon={<Calendar className="w-5 h-5" />}
                title="Availability Schedule"
                subtitle="Set your working hours"
                onClick={() => router.push('/dashboard/caregiver/settings?tab=availability')}
              />
              <div className="border-t border-dark-100 dark:border-dark-800" />
              <MenuItem
                icon={<FileText className="w-5 h-5" />}
                title="Professional Bio"
                subtitle="Tell families about yourself"
                onClick={() => router.push('/dashboard/caregiver/settings?tab=bio')}
              />
            </div>
          </motion.div>
        )}

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: user.role === 'CAREGIVER' ? 0.2 : 0.1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
            Account
          </h2>
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden">
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
          transition={{ delay: user.role === 'CAREGIVER' ? 0.3 : 0.2 }}
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
              icon={<Settings className="w-5 h-5" />}
              title="Settings"
              subtitle="App preferences and more"
              onClick={() => router.push('/dashboard/settings')}
            />
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: user.role === 'CAREGIVER' ? 0.4 : 0.3 }}
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
          transition={{ delay: user.role === 'CAREGIVER' ? 0.5 : 0.4 }}
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
          transition={{ delay: user.role === 'CAREGIVER' ? 0.6 : 0.5 }}
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

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl max-w-sm w-full p-6"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
              Change Profile Photo
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              Photo upload feature coming soon. For now, please use the edit profile page.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setShowPhotoModal(false);
                router.push('/dashboard/profile/edit');
              }}
              className="w-full"
            >
              Go to Edit Profile
            </Button>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
