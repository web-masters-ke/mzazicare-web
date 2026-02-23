"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authRepository } from '@/repositories/auth.repository';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import { Users, Heart, CheckCircle } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, loadUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      if (selectedRole === UserRole.CAREGIVER) {
        // For caregivers: Update role, then redirect to caregiver onboarding
        await authRepository.updateProfile({ role: selectedRole });
        await loadUser();
        router.push('/caregiver-onboarding');
      } else {
        // For family users: Update role and redirect to dashboard
        await authRepository.updateProfile({ role: selectedRole });
        await loadUser();
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to set role:', error);
      alert('Failed to save your selection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
            How will you use MzaziCare?
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400">
            Select your role to personalize your experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Family Member Card */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setSelectedRole(UserRole.FAMILY_USER)}
            className={`relative p-8 rounded-3xl border-2 transition-all duration-300 text-left ${
              selectedRole === UserRole.FAMILY_USER
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-xl shadow-primary-500/20'
                : 'border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 hover:border-primary-300 hover:shadow-lg'
            }`}
          >
            {/* Selection Indicator */}
            {selectedRole === UserRole.FAMILY_USER && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </motion.div>
            )}

            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              selectedRole === UserRole.FAMILY_USER
                ? 'bg-primary-500'
                : 'bg-primary-100 dark:bg-primary-900/20'
            }`}>
              <Heart className={`w-8 h-8 ${
                selectedRole === UserRole.FAMILY_USER
                  ? 'text-white'
                  : 'text-primary-600 dark:text-primary-400'
              }`} />
            </div>

            {/* Content */}
            <h3 className={`text-2xl font-bold mb-3 ${
              selectedRole === UserRole.FAMILY_USER
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-dark-900 dark:text-white'
            }`}>
              Family Member
            </h3>
            <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
              I'm looking for caregivers to help care for my elderly loved ones
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Browse verified caregivers
              </li>
              <li className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Book and manage care services
              </li>
              <li className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Track elderly profiles
              </li>
            </ul>
          </motion.button>

          {/* Caregiver Card */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setSelectedRole(UserRole.CAREGIVER)}
            className={`relative p-8 rounded-3xl border-2 transition-all duration-300 text-left ${
              selectedRole === UserRole.CAREGIVER
                ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20 shadow-xl shadow-accent-500/20'
                : 'border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 hover:border-accent-300 hover:shadow-lg'
            }`}
          >
            {/* Selection Indicator */}
            {selectedRole === UserRole.CAREGIVER && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </motion.div>
            )}

            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              selectedRole === UserRole.CAREGIVER
                ? 'bg-accent-500'
                : 'bg-accent-100 dark:bg-accent-900/20'
            }`}>
              <Users className={`w-8 h-8 ${
                selectedRole === UserRole.CAREGIVER
                  ? 'text-white'
                  : 'text-accent-600 dark:text-accent-400'
              }`} />
            </div>

            {/* Content */}
            <h3 className={`text-2xl font-bold mb-3 ${
              selectedRole === UserRole.CAREGIVER
                ? 'text-accent-600 dark:text-accent-400'
                : 'text-dark-900 dark:text-white'
            }`}>
              Caregiver
            </h3>
            <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
              I'm a professional caregiver looking to offer my services
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Find job opportunities
              </li>
              <li className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Manage your bookings
              </li>
              <li className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Track your earnings
              </li>
            </ul>
          </motion.button>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            variant="primary"
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="w-full rounded-2xl"
          >
            {isLoading ? 'Setting up...' : 'Continue'}
          </Button>
        </motion.div>

        {/* Help Text */}
        <p className="text-center text-sm text-dark-500 mt-6">
          You can always change your role later in settings
        </p>
      </motion.div>
    </div>
  );
}
