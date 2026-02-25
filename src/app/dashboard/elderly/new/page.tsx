"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { useElderly } from '@/hooks/useElderly';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole, CreateElderlyRequest } from '@/types/models';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
} from 'lucide-react';

function NewElderlyContent() {
  const router = useRouter();
  const { createElderly, isLoading } = useElderly();

  const [formData, setFormData] = useState<CreateElderlyRequest>({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    latitude: undefined,
    longitude: undefined,
    locationNotes: '',
    medicalConditions: '',
    medications: '',
    mobilityNotes: '',
    specialInstructions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.address) {
      toast.error('Please fill in required fields (Full Name and Address)');
      return;
    }

    try {
      await createElderly(formData);
      toast.success('Profile created successfully!', { icon: '✅' });
      setTimeout(() => {
        router.push('/dashboard/elderly');
      }, 500);
    } catch (error) {
      console.error('Failed to create elderly profile:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back
        </Button>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-100 dark:border-dark-800">
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              Add Elderly Profile
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">
              Create a profile for a new elderly person in your care
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Location Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Location Notes
                  </label>
                  <textarea
                    value={formData.locationNotes}
                    onChange={(e) => setFormData({ ...formData, locationNotes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Near Senteu Plaza, kilimani"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Medical Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., HBP, Diabetes, Heart condition"
                    maxLength={2000}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 2000 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Metformin 500mg twice daily, Aspirin 81mg daily"
                    maxLength={2000}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Care Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Care Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Mobility Notes
                  </label>
                  <textarea
                    value={formData.mobilityNotes}
                    onChange={(e) => setFormData({ ...formData, mobilityNotes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Uses wheelchair, Needs walker, Fully mobile"
                    maxLength={500}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 500 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Any special care instructions, preferences, or important notes for caregivers"
                    maxLength={2000}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="w-5 h-5" />}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function NewElderlyPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
      <NewElderlyContent />
    </ProtectedRoute>
  );
}
