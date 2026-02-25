"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { useCaregiver } from '@/hooks/useCaregiver';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import {
  Award,
  CheckCircle,
  Upload,
  User,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

// Available skill options that match backend enum
const AVAILABLE_SKILLS = [
  { value: 'HOME_CHECK_IN', label: 'Home Check-In' },
  { value: 'COMPANIONSHIP', label: 'Companionship' },
  { value: 'CLEANING', label: 'Cleaning & Housekeeping' },
  { value: 'ERRANDS', label: 'Errands & Shopping' },
  { value: 'HEALTH_MONITORING', label: 'Health Monitoring' },
  { value: 'EMERGENCY_RESPONSE', label: 'Emergency Response' },
];

function CaregiverOnboardingContent() {
  const router = useRouter();
  const { registerCaregiver, updateProfile } = useCaregiver();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',

    // Experience
    yearsOfExperience: '',
    skills: [] as string[],
    certifications: [] as string[],

    // Documents
    nationalIdNumber: '',
    nationalIdFront: null as File | null,
    nationalIdBack: null as File | null,
    selfieWithId: null as File | null,
  });

  const [currentCertification, setCurrentCertification] = useState('');

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Experience', icon: Award },
    { number: 3, title: 'Documents', icon: Upload },
  ];

  const toggleSkill = (skillValue: string) => {
    if (formData.skills.includes(skillValue)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillValue) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skillValue] });
    }
  };

  const addCertification = () => {
    if (currentCertification.trim() && !formData.certifications.includes(currentCertification.trim())) {
      setFormData({ ...formData, certifications: [...formData.certifications, currentCertification.trim()] });
      setCurrentCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData({ ...formData, certifications: formData.certifications.filter(c => c !== cert) });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (fieldName: string, file: File | null) => {
    setFormData({ ...formData, [fieldName]: file });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { authRepository } = await import('@/repositories/auth.repository');

      // First: Update user profile with personal info
      if (formData.fullName || formData.email) {
        await authRepository.updateProfile({
          fullName: formData.fullName || undefined,
          email: formData.email || undefined,
        });
      }

      // Second: Create the caregiver profile
      await registerCaregiver({
        bio: formData.bio,
        skills: formData.skills,
      });

      // Third: Upload documents if all three are provided
      if (formData.nationalIdFront && formData.nationalIdBack && formData.selfieWithId) {
        const { caregiverRepository } = await import('@/repositories/caregiver.repository');

        // Upload files
        const uploadedUrls = await caregiverRepository.uploadDocuments({
          nationalIdFront: formData.nationalIdFront,
          nationalIdBack: formData.nationalIdBack,
          selfieWithId: formData.selfieWithId,
        });

        // Submit document URLs with ID number
        await caregiverRepository.submitDocuments({
          nationalIdNumber: formData.nationalIdNumber || 'PENDING',
          ...uploadedUrls,
        });
      }

      alert('Caregiver profile setup complete! Welcome to MzaziCare.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to save profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className={`text-sm font-medium ${
                    currentStep >= step.number
                      ? 'text-dark-900 dark:text-white'
                      : 'text-dark-600 dark:text-dark-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-4 ${
                    currentStep > step.number
                      ? 'bg-primary-500'
                      : 'bg-dark-200 dark:bg-dark-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-dark-900 rounded-3xl p-8 shadow-xl border border-dark-100 dark:border-dark-800"
        >
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                  Personal Information
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Tell us about yourself
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+254 712 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="City, Area"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell families about your experience and approach to elderly care..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                  Experience & Skills
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Share your qualifications
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                  Skills & Services You Offer
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <label
                      key={skill.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.skills.includes(skill.value)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill.value)}
                        onChange={() => toggleSkill(skill.value)}
                        className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-dark-900 dark:text-white">
                        {skill.label}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.skills.length > 0 && (
                  <p className="text-sm text-primary-600 dark:text-primary-400 mt-3">
                    {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Certifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentCertification}
                    onChange={(e) => setCurrentCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    className="flex-1 px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Certified Nursing Assistant"
                  />
                  <Button variant="secondary" onClick={addCertification}>
                    Add
                  </Button>
                </div>
                {formData.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-sm font-medium flex items-center gap-2"
                      >
                        {cert}
                        <button onClick={() => removeCertification(cert)} className="hover:text-green-900">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                  Documents
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Upload required verification documents
                </p>
              </div>

              {/* National ID Number */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  National ID Number
                </label>
                <input
                  type="text"
                  value={formData.nationalIdNumber}
                  onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="12345678"
                />
              </div>

              {/* ID Front */}
              <div className="p-6 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-2xl">
                <Upload className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-700 dark:text-dark-300 mb-2 text-center">
                  National ID - Front Side
                </p>
                <p className="text-sm text-dark-500 mb-4 text-center">
                  JPG, PNG - Max 10MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange('nationalIdFront', e.target.files?.[0] || null)}
                  className="hidden"
                  id="nationalIdFront"
                />
                <label
                  htmlFor="nationalIdFront"
                  className="inline-block px-6 py-3 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white border border-dark-300 dark:border-dark-700 hover:bg-dark-200 dark:hover:bg-dark-700 cursor-pointer transition-colors text-center font-medium"
                >
                  {formData.nationalIdFront ? `✓ ${formData.nationalIdFront.name}` : 'Choose File'}
                </label>
              </div>

              {/* ID Back */}
              <div className="p-6 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-2xl">
                <Upload className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-700 dark:text-dark-300 mb-2 text-center">
                  National ID - Back Side
                </p>
                <p className="text-sm text-dark-500 mb-4 text-center">
                  JPG, PNG - Max 10MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange('nationalIdBack', e.target.files?.[0] || null)}
                  className="hidden"
                  id="nationalIdBack"
                />
                <label
                  htmlFor="nationalIdBack"
                  className="inline-block px-6 py-3 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white border border-dark-300 dark:border-dark-700 hover:bg-dark-200 dark:hover:bg-dark-700 cursor-pointer transition-colors text-center font-medium"
                >
                  {formData.nationalIdBack ? `✓ ${formData.nationalIdBack.name}` : 'Choose File'}
                </label>
              </div>

              {/* Selfie with ID */}
              <div className="p-6 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-2xl">
                <Upload className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-700 dark:text-dark-300 mb-2 text-center">
                  Selfie Holding ID
                </p>
                <p className="text-sm text-dark-500 mb-4 text-center">
                  JPG, PNG - Max 10MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange('selfieWithId', e.target.files?.[0] || null)}
                  className="hidden"
                  id="selfieWithId"
                />
                <label
                  htmlFor="selfieWithId"
                  className="inline-block px-6 py-3 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white border border-dark-300 dark:border-dark-700 hover:bg-dark-200 dark:hover:bg-dark-700 cursor-pointer transition-colors text-center font-medium"
                >
                  {formData.selfieWithId ? `✓ ${formData.selfieWithId.name}` : 'Choose File'}
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-400">
                  <strong>Note:</strong> Documents are optional during onboarding but required for verification. You can skip this step and upload later. Your profile will be reviewed within 24-48 hours after document submission.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-dark-100 dark:border-dark-800">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Submitting...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CaregiverOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CAREGIVER]}>
      <CaregiverOnboardingContent />
    </ProtectedRoute>
  );
}
