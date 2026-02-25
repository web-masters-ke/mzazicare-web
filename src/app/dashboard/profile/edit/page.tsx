"use client";

import { useState, useEffect } from 'react';
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
  Mail,
  Phone,
  Camera,
  Save,
  ArrowLeft,
  X,
} from 'lucide-react';

function EditProfileContent() {
  const router = useRouter();
  const { user, updateProfile, loadUser, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const { authRepository } = await import('@/repositories/auth.repository');

      // Upload photo
      await authRepository.uploadProfilePhoto(selectedFile);

      // Reload user data to get updated profile photo
      await loadUser();

      toast.success('Profile photo updated successfully!', { icon: '✅' });

      // Cleanup
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error('Failed to upload photo:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to upload photo. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
      });
      toast.success('Profile updated successfully!', { icon: '✅' });
      setTimeout(() => {
        router.push('/dashboard/profile');
      }, 500);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

      <div className="relative pb-24 pt-8 px-4 sm:px-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back
        </Button>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto bg-dark-50 dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800"
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-100 dark:border-dark-800">
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              Edit Profile
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">
              Update your personal information
            </p>
          </div>

          {/* Profile Photo */}
          <div className="p-6 border-b border-dark-100 dark:border-dark-800">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user.profilePhotoUrl || user.profilePhoto ? (
                    <img
                      src={user.profilePhotoUrl || user.profilePhoto}
                      alt={user.fullName || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.fullName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-dark-900 dark:text-white mb-1">
                  Profile Photo
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">
                  JPG, PNG. Max 5MB
                </p>
                {selectedFile ? (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handlePhotoUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-900 dark:text-white rounded-lg text-sm font-medium transition-colors">
                      Change Photo
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-200 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-dark-500 mt-1">
                  Phone number cannot be changed
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
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
                  disabled={isSaving || isLoading}
                  className="flex-1"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  );
}
