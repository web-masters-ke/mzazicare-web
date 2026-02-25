"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const { sendOtp, otpLoading, otpSent, otpError, clearError } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ phoneNumber?: string }>({});

  const validatePhone = (phone: string): boolean => {
    // Kenyan phone number format: +254 or 07/01
    const kenyanPhone = /^(?:\+254|0)?([71](?:(?:[0-9]{8})))$/;
    return kenyanPhone.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setErrors({});

    // Validate phone number
    if (!phoneNumber) {
      setErrors({ phoneNumber: 'Phone number is required' });
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setErrors({ phoneNumber: 'Please enter a valid Kenyan phone number' });
      return;
    }

    // Format phone number (ensure +254 prefix)
    let formattedPhone = phoneNumber.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+254' + formattedPhone;
    }

    try {
      await sendOtp(formattedPhone);
      // Navigate to OTP verification page with returnUrl
      const returnUrlParam = returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : '';
      router.push(`/verify-otp?phone=${encodeURIComponent(formattedPhone)}${returnUrlParam}`);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
              Mzazi<span className="text-primary-500">Care</span>
            </h1>
          </Link>
          <p className="text-dark-600 dark:text-dark-400 mt-2">
            Professional elderly care, simplified
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-dark-900 rounded-3xl p-8 shadow-xl border border-dark-100 dark:border-dark-800">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            Enter your phone number to receive an OTP
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Phone className="w-5 h-5 text-dark-400" />
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 712 345 678"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                    errors.phoneNumber || otpError
                      ? 'border-red-500'
                      : 'border-dark-200 dark:border-dark-700'
                  } bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500`}
                  disabled={otpLoading}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
              {otpError && !errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{otpError}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              isLoading={otpLoading}
              rightIcon={!otpLoading && <ArrowRight className="w-5 h-5" />}
            >
              {otpLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>

          {/* Help Text */}
          <p className="text-center text-sm text-dark-500 dark:text-dark-500 mt-6">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-primary-500 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center">
        <div className="text-dark-600 dark:text-dark-400">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
