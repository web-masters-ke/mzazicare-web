"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '';
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const { user, isNewUser, verifyOtp, sendOtp, verificationLoading, verificationError, otpLoading, clearError, isAuthenticated } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Redirect if no phone number
    if (!phoneNumber) {
      router.push('/login');
    }
  }, [phoneNumber, router]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  // Redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      // Check if user needs to select a role (new user or no role set)
      if (isNewUser || !user?.role) {
        // New user or user without role - redirect to role selection
        router.push('/role-selection');
      } else {
        // Existing user with role - redirect to returnUrl
        router.push(returnUrl);
      }
    }
  }, [isAuthenticated, isNewUser, user, returnUrl, router]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only handle 6-digit paste
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      return;
    }

    try {
      await verifyOtp(phoneNumber, otpCode);
      // Redirect will happen via useEffect when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by the store
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    clearError();
    try {
      await sendOtp(phoneNumber);
      // Clear current OTP
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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

        {/* Verification Card */}
        <div className="bg-white dark:bg-dark-900 rounded-3xl p-8 shadow-xl border border-dark-100 dark:border-dark-800">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>

          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Verify OTP
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-dark-900 dark:text-white">
              {phoneNumber}
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-3">
                Enter OTP
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border ${
                      verificationError
                        ? 'border-red-500'
                        : 'border-dark-200 dark:border-dark-700'
                    } bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500`}
                    disabled={verificationLoading}
                  />
                ))}
              </div>
              {verificationError && (
                <p className="text-sm text-red-500 mt-2">{verificationError}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              isLoading={verificationLoading}
              disabled={!isOtpComplete}
              rightIcon={!verificationLoading && <ArrowRight className="w-5 h-5" />}
            >
              {verificationLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="text-center mt-6">
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Didn't receive the code?{' '}
              <button
                onClick={handleResendOtp}
                disabled={otpLoading}
                className="text-primary-500 hover:underline font-semibold disabled:opacity-50"
              >
                {otpLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
          </div>
        </div>

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
      </motion.div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center">
        <div className="text-dark-600 dark:text-dark-400">Loading...</div>
      </div>
    }>
      <VerifyOtpForm />
    </Suspense>
  );
}
