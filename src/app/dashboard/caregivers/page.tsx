"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { useCaregiver } from '@/hooks/useCaregiver';
import { Button, Badge, Spinner } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  TrendingUp,
  X,
  SlidersHorizontal,
  Users,
  Briefcase,
} from 'lucide-react';

function CaregiversContent() {
  const router = useRouter();
  const { caregivers, isLoading, searchCaregivers } = useCaregiver();

  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(10000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    searchCaregivers({});
  }, []);

  const handleSearch = () => {
    searchCaregivers({
      minRating: minRating || undefined,
      maxHourlyRate: maxRate || undefined,
    });
  };

  const handleResetFilters = () => {
    setMinRating(0);
    setMaxRate(10000);
    searchCaregivers({});
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-dark-900 to-dark-700 dark:from-white dark:to-dark-300 bg-clip-text text-transparent">
                Find Caregivers
              </h1>
              <p className="text-dark-600 dark:text-dark-400 flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-primary-500" />
                {filteredCaregivers.length} verified professionals ready to help
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by skills, experience, specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-dark-900 border-2 border-dark-100 dark:border-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-lg shadow-dark-900/5 dark:shadow-black/20"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl border-2 flex items-center gap-3 font-semibold transition-all shadow-lg ${
                showFilters
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 border-primary-500 text-white shadow-primary-500/30'
                  : 'bg-white dark:bg-dark-900 border-dark-100 dark:border-dark-800 text-dark-900 dark:text-white hover:border-primary-500 shadow-dark-900/5 dark:shadow-black/20'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-white dark:bg-dark-900 rounded-2xl p-6 border-2 border-dark-100 dark:border-dark-800 shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl flex items-center justify-center">
                      <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white">Advanced Filters</h3>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Minimum Rating
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                      <option value="0">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Max Hourly Rate (KES)
                    </label>
                    <input
                      type="number"
                      value={maxRate}
                      onChange={(e) => setMaxRate(Number(e.target.value))}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter max rate"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="primary"
                      onClick={handleSearch}
                      className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg shadow-primary-500/30"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Caregivers Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-dark-600 dark:text-dark-400 mt-4">Loading caregivers...</p>
            </div>
          </div>
        ) : filteredCaregivers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-900 rounded-3xl p-12 text-center border-2 border-dashed border-dark-200 dark:border-dark-800 shadow-xl"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
              <User className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              No caregivers found
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find the perfect caregiver
            </p>
            <Button variant="primary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCaregivers.map((caregiver, index) => (
                <motion.div
                  key={caregiver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/dashboard/caregivers/${caregiver.id}`)}
                  className="group bg-white dark:bg-dark-900 rounded-3xl p-6 border-2 border-dark-100 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary-500/10"
                >
                  <div className="flex gap-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                          <User className="w-12 h-12" />
                        </div>
                        {caregiver.documentsVerified && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-dark-900 flex items-center justify-center shadow-lg">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                            Professional Caregiver
                          </h3>
                          {caregiver.experience && (
                            <p className="text-sm text-dark-600 dark:text-dark-400 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5" />
                              {caregiver.experience}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Rating & Stats */}
                      <div className="flex items-center gap-3 mb-4">
                        {caregiver.rating && (
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 px-3 py-1.5 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-dark-900 dark:text-white">
                              {caregiver.rating.toFixed(1)}
                            </span>
                            {caregiver.totalReviews && (
                              <span className="text-xs text-dark-600 dark:text-dark-400">
                                ({caregiver.totalReviews})
                              </span>
                            )}
                          </div>
                        )}
                        {caregiver.documentsVerified && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1.5 px-3 py-1.5">
                            <Award className="w-3.5 h-3.5" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Bio */}
                      {caregiver.bio && (
                        <p className="text-sm text-dark-700 dark:text-dark-300 mb-4 line-clamp-2 leading-relaxed">
                          {caregiver.bio}
                        </p>
                      )}

                      {/* Skills */}
                      {Array.isArray(caregiver.skills) && caregiver.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {caregiver.skills.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 dark:from-primary-900/20 dark:to-accent-900/20 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {caregiver.skills.length > 4 && (
                            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300 border border-dark-200 dark:border-dark-700">
                              +{caregiver.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Details Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-dark-100 dark:border-dark-800">
                        {caregiver.hourlyRate && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs text-dark-600 dark:text-dark-400">Hourly Rate</p>
                              <p className="text-sm font-bold text-dark-900 dark:text-white">
                                KES {caregiver.hourlyRate}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 transition-all">
                          <span className="text-sm">View Profile</span>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Results Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-dark-900 rounded-full border border-dark-200 dark:border-dark-800 shadow-lg">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-semibold text-dark-700 dark:text-dark-300">
                  Showing {filteredCaregivers.length} caregiver{filteredCaregivers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
          </>
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
