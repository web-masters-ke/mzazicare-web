"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Spinner } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types/models';
import { caregiverRepository } from '@/repositories/caregiver.repository';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
  FileText,
  Save,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';

// Service categories matching backend enum
const SERVICE_CATEGORIES = [
  { value: 'HOME_CHECK_IN', label: 'Home Check-In' },
  { value: 'COMPANIONSHIP', label: 'Companionship' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'ERRANDS', label: 'Errands' },
  { value: 'HEALTH_MONITORING', label: 'Health Monitoring' },
  { value: 'EMERGENCY_RESPONSE', label: 'Emergency Response' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

interface Skill {
  category: string;
  hourlyRate: number;
  experience: number;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

function CaregiverSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Get initial tab from URL query parameter
  const initialTab = (searchParams.get('tab') as 'skills' | 'availability' | 'bio') || 'skills';
  const [activeTab, setActiveTab] = useState<'skills' | 'availability' | 'bio'>(initialTab);

  // Form state
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    loadCaregiverProfile();
  }, []);

  const loadCaregiverProfile = async () => {
    try {
      const profile = await caregiverRepository.getMyProfile();

      // Set bio
      setBio(profile.bio || '');

      // Set skills with rates
      if (profile.skills && Array.isArray(profile.skills)) {
        const skillsWithRates = profile.skills.map((skill: any) => {
          // Handle both old format (string) and new format (object with hourlyRate)
          const category = typeof skill === 'string' ? skill : skill.category;
          const hourlyRate = skill.hourlyRate ? Number(skill.hourlyRate) : 500;
          const experience = skill.experience ? Number(skill.experience) : 0;

          return {
            category,
            hourlyRate: hourlyRate >= 50 ? hourlyRate : 500, // Ensure minimum rate
            experience: experience >= 0 ? experience : 0,
          };
        });
        setSkills(skillsWithRates);
      }

      // Set availability
      if (profile.availability) {
        setAvailability(profile.availability);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    // Add new skill with safe defaults
    const newSkill: Skill = {
      category: '',
      hourlyRate: 500, // Default rate
      experience: 0,
    };
    setSkills([...skills, newSkill]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    const updated = [...skills];

    // Ensure hourlyRate is always a valid number
    if (field === 'hourlyRate') {
      const numValue = Number(value);
      updated[index] = {
        ...updated[index],
        [field]: isNaN(numValue) ? 500 : Math.max(50, numValue)
      };
    } else if (field === 'experience') {
      const numValue = Number(value);
      updated[index] = {
        ...updated[index],
        [field]: isNaN(numValue) ? 0 : Math.max(0, numValue)
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    setSkills(updated);
  };

  const handleSaveSkills = async () => {
    try {
      // Validate all skills have a category and rate
      const validSkills = skills
        .filter(s => s.category && s.category.trim() !== '')
        .map(s => ({
          category: s.category,
          hourlyRate: Math.max(50, Number(s.hourlyRate) || 500), // Ensure minimum 50
          experience: Math.max(0, Number(s.experience) || 0),
        }));

      if (validSkills.length === 0) {
        toast.error('Please add at least one skill with a rate');
        return;
      }

      // Double-check all rates are valid
      const invalidRates = validSkills.filter(s => s.hourlyRate < 50 || s.hourlyRate > 10000);
      if (invalidRates.length > 0) {
        toast.error('Hourly rates must be between KES 50 and KES 10,000');
        return;
      }

      console.log('Saving skills:', validSkills); // Debug log

      setIsSaving(true);
      await caregiverRepository.updateSkills(validSkills);
      toast.success('Skills and rates saved successfully!');

      // Reload profile to ensure UI is in sync
      await loadCaregiverProfile();
    } catch (error: any) {
      console.error('Failed to save skills:', error);

      // Show validation errors if available
      if (error?.response?.data?.error?.details?.errors) {
        const errors = error.response.data.error.details.errors;
        const errorMessages = errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        const errorMessage = error?.response?.data?.error?.message || 'Failed to save skills';
        toast.error(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBio = async () => {
    try {
      setIsSaving(true);
      await caregiverRepository.updateCaregiverProfile({ bio });
      toast.success('Bio saved successfully!');
    } catch (error) {
      console.error('Failed to save bio:', error);
      toast.error('Failed to save bio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAvailability = () => {
    setAvailability([
      ...availability,
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
    ]);
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleAvailabilityChange = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const handleSaveAvailability = async () => {
    try {
      setIsSaving(true);
      await caregiverRepository.updateAvailability(availability);
      toast.success('Availability saved successfully!');
    } catch (error) {
      console.error('Failed to save availability:', error);
      toast.error('Failed to save availability');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />

      <div className="relative pb-24 pt-8 px-4 sm:px-6 max-w-4xl mx-auto">
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
            Professional Settings
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Manage your services, rates, and availability
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'skills', label: 'Skills & Rates', icon: Briefcase },
            { id: 'bio', label: 'Bio', icon: FileText },
            { id: 'availability', label: 'Availability', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Skills & Rates Tab */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Set Your Own Rates
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Choose the services you offer and set your hourly rate for each. Families will see your rates when browsing caregivers.
                    </p>
                  </div>
                </div>
              </div>

              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-5 border border-dark-100 dark:border-dark-800"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Service Category */}
                    <div>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        Service
                      </label>
                      <select
                        value={skill.category}
                        onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select service...</option>
                        {SERVICE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Hourly Rate */}
                    <div>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        Hourly Rate (KES)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="10000"
                        step="50"
                        value={skill.hourlyRate || 500}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleSkillChange(index, 'hourlyRate', value === '' ? 500 : Number(value));
                        }}
                        onBlur={(e) => {
                          // Ensure valid value on blur
                          const value = Number(e.target.value);
                          if (isNaN(value) || value < 50) {
                            handleSkillChange(index, 'hourlyRate', 500);
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="500"
                      />
                      <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                        Min: KES 50, Max: KES 10,000
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                          Experience (years)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={skill.experience || 0}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleSkillChange(index, 'experience', value === '' ? 0 : Number(value));
                          }}
                          onBlur={(e) => {
                            // Ensure valid value on blur
                            const value = Number(e.target.value);
                            if (isNaN(value) || value < 0) {
                              handleSkillChange(index, 'experience', 0);
                            }
                          }}
                          className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddSkill}
                className="w-full py-3 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Service
              </button>

              <Button
                onClick={handleSaveSkills}
                variant="primary"
                size="lg"
                disabled={isSaving || skills.length === 0}
                leftIcon={isSaving ? <Spinner size="sm" /> : <Save className="w-5 h-5" />}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Skills & Rates'}
              </Button>
            </motion.div>
          )}

          {/* Bio Tab */}
          {activeTab === 'bio' && (
            <motion.div
              key="bio"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                  About You
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={8}
                  maxLength={1000}
                  placeholder="Tell families about your experience, qualifications, and what makes you a great caregiver..."
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 text-sm text-dark-500 dark:text-dark-400 text-right">
                  {bio.length} / 1000 characters
                </div>
              </div>

              <Button
                onClick={handleSaveBio}
                variant="primary"
                size="lg"
                disabled={isSaving}
                leftIcon={isSaving ? <Spinner size="sm" /> : <Save className="w-5 h-5" />}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Bio'}
              </Button>
            </motion.div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Set Your Schedule
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Let families know when you're available to work. You can add multiple time slots for each day.
                    </p>
                  </div>
                </div>
              </div>

              {availability.map((slot, index) => (
                <div
                  key={index}
                  className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-5 border border-dark-100 dark:border-dark-800"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Day */}
                    <div>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        Day
                      </label>
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) => handleAvailabilityChange(index, 'dayOfWeek', Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="flex items-end">
                      <button
                        onClick={() => handleRemoveAvailability(index)}
                        className="w-full p-2.5 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddAvailability}
                className="w-full py-3 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Time Slot
              </button>

              <Button
                onClick={handleSaveAvailability}
                variant="primary"
                size="lg"
                disabled={isSaving || availability.length === 0}
                leftIcon={isSaving ? <Spinner size="sm" /> : <Save className="w-5 h-5" />}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Availability'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Profile Visibility
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Once you complete your profile, families will be able to find and book you based on your services, rates, and availability.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function CaregiverSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CAREGIVER]}>
      <CaregiverSettingsContent />
    </ProtectedRoute>
  );
}
