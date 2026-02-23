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

function CaregiverOnboardingContent() {
  const router = useRouter();
  const { updateProfile } = useCaregiver();
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
    idDocument: null,
    certificate: null,
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCertification, setCurrentCertification] = useState('');

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Experience', icon: Award },
    { number: 3, title: 'Documents', icon: Upload },
  ];

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Submit caregiver profile data
      await updateProfile({
        bio: formData.bio,
        experience: formData.yearsOfExperience,
        skills: formData.skills,
        certifications: formData.certifications,
        // Documents will be handled separately via file upload
      });

      alert('Caregiver profile setup complete! Welcome to MzaziCare.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error);
      alert(error.response?.data?.message || error.message || 'Failed to save profile. Please try again.');
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
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Dementia Care, Medication Management"
                  />
                  <Button variant="secondary" onClick={addSkill}>
                    Add
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-primary-900">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
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

              <div className="p-6 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-2xl text-center">
                <Upload className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-700 dark:text-dark-300 mb-2">
                  Upload ID Document
                </p>
                <p className="text-sm text-dark-500 mb-4">
                  National ID or Passport (PDF, JPG, PNG - Max 5MB)
                </p>
                <Button variant="secondary">
                  Choose File
                </Button>
              </div>

              <div className="p-6 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-2xl text-center">
                <Award className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-700 dark:text-dark-300 mb-2">
                  Upload Certification (Optional)
                </p>
                <p className="text-sm text-dark-500 mb-4">
                  Professional certifications or training documents
                </p>
                <Button variant="secondary">
                  Choose File
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-400">
                  <strong>Note:</strong> Your documents will be reviewed by our team within 24-48 hours. You'll receive an email once verification is complete.
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
