"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { useElderly } from '@/hooks/useElderly';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import toast from 'react-hot-toast';
import {
  Plus,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Trash2,
  User,
  Camera,
  Search,
  X,
} from 'lucide-react';

function ElderlyContent() {
  const router = useRouter();
  const { elderlyList, isLoading, fetchElderlyList, deleteElderly } = useElderly();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchElderlyList();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete {name}'s profile?</p>
        <p className="text-sm text-dark-600 dark:text-dark-400">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              proceedWithDelete(id, name);
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const proceedWithDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      await deleteElderly(id);
      toast.success(`${name}'s profile deleted successfully`);
    } catch (error) {
      console.error('Failed to delete elderly profile:', error);
      toast.error('Failed to delete profile. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter elderly profiles based on search query
  const filteredElderlyList = elderlyList.filter((elderly) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      elderly.firstName?.toLowerCase().includes(query) ||
      elderly.lastName?.toLowerCase().includes(query) ||
      elderly.address?.toLowerCase().includes(query) ||
      elderly.phoneNumber?.includes(query) ||
      (Array.isArray(elderly.medicalConditions) && elderly.medicalConditions.some((condition) => condition.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
                Care Recipients
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                {filteredElderlyList.length} {filteredElderlyList.length === 1 ? 'profile' : 'profiles'}
                {searchQuery && ` found • ${elderlyList.length} total`}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => router.push('/dashboard/elderly/new')}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Add Profile
            </Button>
          </div>

          {/* Search Bar */}
          {elderlyList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search by name, address, phone, or medical condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : elderlyList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-800"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              No care recipients yet
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-8 max-w-md mx-auto">
              Create profiles for your loved ones to easily manage their care and book trusted caregivers
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/dashboard/elderly/new')}
              leftIcon={<Plus className="w-5 h-5" />}
              className="mx-auto"
            >
              Create First Profile
            </Button>
          </motion.div>
        ) : filteredElderlyList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-800"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Search className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              No profiles found
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              No care recipients match your search "{searchQuery}"
            </p>
            <Button
              variant="secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElderlyList.map((elderly, index) => (
              <motion.div
                key={elderly.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all overflow-hidden"
              >
                {/* Card Header with Profile Picture */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      {/* Profile Picture */}
                      <div className="w-20 h-20 rounded-2xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center overflow-hidden">
                        {elderly.photoUrl ? (
                          <img
                            src={elderly.photoUrl}
                            alt={`${elderly.firstName} ${elderly.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-pink-600 dark:text-pink-400" />
                        )}
                      </div>
                      {/* Camera Icon for Upload Hint */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Quick Edit Button */}
                    <button
                      onClick={() => router.push(`/dashboard/elderly/${elderly.id}`)}
                      className="w-10 h-10 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-dark-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 flex items-center justify-center transition-colors"
                    >
                      <Edit className="w-5 h-5 text-dark-600 dark:text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    </button>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                    {elderly.firstName} {elderly.lastName}
                  </h3>

                  {/* Age Badge */}
                  {elderly.dateOfBirth && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      {calculateAge(elderly.dateOfBirth)} years old
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="space-y-2.5 mt-4">
                    {elderly.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-dark-400 mt-0.5 flex-shrink-0" />
                        <span className="text-dark-700 dark:text-dark-300 line-clamp-1">
                          {elderly.address}
                        </span>
                      </div>
                    )}
                    {elderly.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-dark-400 flex-shrink-0" />
                        <span className="text-dark-700 dark:text-dark-300">
                          {elderly.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Medical Conditions */}
                  {Array.isArray(elderly.medicalConditions) && elderly.medicalConditions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-800">
                      <p className="text-xs font-medium text-dark-600 dark:text-dark-400 mb-2">
                        Medical Conditions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {elderly.medicalConditions.slice(0, 3).map((condition, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                          >
                            {condition}
                          </span>
                        ))}
                        {elderly.medicalConditions.length > 3 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300">
                            +{elderly.medicalConditions.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer with Actions */}
                <div className="px-6 py-4 bg-dark-50 dark:bg-dark-800 border-t border-dark-100 dark:border-dark-800 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/dashboard/elderly/${elderly.id}`)}
                    leftIcon={<Edit className="w-4 h-4" />}
                    className="flex-1"
                  >
                    Edit Profile
                  </Button>
                  <button
                    onClick={() => handleDelete(elderly.id, `${elderly.firstName} ${elderly.lastName}`)}
                    disabled={deletingId === elderly.id}
                    className="px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function ElderlyPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
      <ElderlyContent />
    </ProtectedRoute>
  );
}
