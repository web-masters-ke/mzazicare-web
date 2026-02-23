"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { useCaregiver } from '@/hooks/useCaregiver';
import { Button, Badge, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/models';
import {
  Search,
  Filter,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Heart,
  User,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

function CaregiversContent() {
  const router = useRouter();
  const { caregivers, isLoading, searchCaregivers } = useCaregiver();

  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(1000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initial search with default filters
    searchCaregivers({});
  }, []);

  const handleSearch = () => {
    searchCaregivers({
      minRating: minRating || undefined,
      maxHourlyRate: maxRate || undefined,
    });
  };

  const filteredCaregivers = caregivers.filter((caregiver) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      caregiver.bio?.toLowerCase().includes(query) ||
      (Array.isArray(caregiver.skills) && caregiver.skills.some((skill) => skill.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="pb-24 pt-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
              Find Caregivers
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              {filteredCaregivers.length} verified professionals
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search by name, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 rounded-2xl bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800 hover:border-primary-500 flex items-center gap-2 text-dark-900 dark:text-white transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-200 dark:border-dark-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="0">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Max Hourly Rate (KES)
                    </label>
                    <input
                      type="number"
                      value={maxRate}
                      onChange={(e) => setMaxRate(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter max rate"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="primary"
                      onClick={handleSearch}
                      className="w-full"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Caregivers Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredCaregivers.length === 0 ? (
          <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-800">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              No caregivers found
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCaregivers.map((caregiver, index) => (
              <motion.div
                key={caregiver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/dashboard/caregivers/${caregiver.id}`)}
                className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-6 border border-dark-100 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                      C
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                          Caregiver Profile
                        </h3>
                        {caregiver.experience && (
                          <p className="text-sm text-dark-600 dark:text-dark-400">
                            {caregiver.experience}
                          </p>
                        )}
                      </div>
                      {caregiver.documentsVerified && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    {caregiver.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-dark-900 dark:text-white">
                          {caregiver.rating.toFixed(1)}
                        </span>
                        {caregiver.totalReviews && (
                          <span className="text-sm text-dark-600 dark:text-dark-400">
                            ({caregiver.totalReviews} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bio */}
                    {caregiver.bio && (
                      <p className="text-sm text-dark-700 dark:text-dark-300 mb-3 line-clamp-2">
                        {caregiver.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {Array.isArray(caregiver.skills) && caregiver.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {caregiver.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                          >
                            {skill}
                          </span>
                        ))}
                        {caregiver.skills.length > 3 && (
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
                            +{caregiver.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-dark-600 dark:text-dark-400">
                      {caregiver.hourlyRate && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>KES {caregiver.hourlyRate}/hr</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>View Profile</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && filteredCaregivers.length > 0 && (
          <div className="mt-8 text-center text-sm text-dark-600 dark:text-dark-400">
            Showing {filteredCaregivers.length} caregiver{filteredCaregivers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function CaregiversPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
      <CaregiversContent />
    </ProtectedRoute>
  );
}
