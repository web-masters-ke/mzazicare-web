"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { useCaregiver } from '@/hooks/useCaregiver';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { UserRole, type CaregiverProfile } from '@/types/models';
import {
  Search,
  Star,
  ChevronRight,
  Sparkles,
  Award,
  TrendingUp,
  Users,
  Heart,
  Shield,
  Zap,
  Home,
  Stethoscope,
  ShoppingBag,
  Activity,
  Grid3x3,
  List,
  LayoutGrid,
  MapPin,
  Clock,
  CheckCircle,
  Crown,
  Flame,
  Target,
} from 'lucide-react';

// View mode type
type ViewMode = 'mixed' | 'grid' | 'list';

// Category configuration
const CATEGORIES = [
  { id: 'HOME_CHECK_IN', label: 'Home Check-In', icon: Home, color: 'blue' },
  { id: 'COMPANIONSHIP', label: 'Companionship', icon: Heart, color: 'pink' },
  { id: 'HEALTH_MONITORING', label: 'Health Care', icon: Stethoscope, color: 'green' },
  { id: 'ERRANDS', label: 'Errands', icon: ShoppingBag, color: 'purple' },
  { id: 'EMERGENCY_RESPONSE', label: 'Emergency', icon: Zap, color: 'red' },
  { id: 'CLEANING', label: 'Cleaning', icon: Sparkles, color: 'cyan' },
];

// Hero Card - Large Featured Card
function HeroCard({ caregiver }: { caregiver: CaregiverProfile }) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => router.push(`/dashboard/caregivers/${caregiver.id}`)}
      className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-8 cursor-pointer group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {caregiver.user?.profilePhoto ? (
            <img
              src={caregiver.user.profilePhoto}
              alt={caregiver.user.fullName || 'Caregiver'}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white/50"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center text-white text-3xl font-bold">
              {caregiver.user?.fullName?.charAt(0).toUpperCase() || 'C'}
            </div>
          )}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-5 h-5 text-yellow-900" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide">
              ⭐ Featured
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {caregiver.user?.fullName || 'Professional Caregiver'}
          </h3>
          <p className="text-white/90 mb-4 line-clamp-2">
            {caregiver.bio || 'Experienced professional caregiver'}
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span className="font-semibold">{caregiver.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">{caregiver.completedJobs || 0} jobs</span>
            </div>
            {caregiver.verificationStatus === 'APPROVED' && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}

// Compact List Item
function ListItem({ caregiver }: { caregiver: CaregiverProfile }) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => router.push(`/dashboard/caregivers/${caregiver.id}`)}
      className="flex items-center gap-4 p-4 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-all hover:shadow-lg"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {caregiver.user?.profilePhoto ? (
          <img
            src={caregiver.user.profilePhoto}
            alt={caregiver.user.fullName || 'Caregiver'}
            className="w-14 h-14 rounded-xl object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
            {caregiver.user?.fullName?.charAt(0).toUpperCase() || 'C'}
          </div>
        )}
        {caregiver.verificationStatus === 'APPROVED' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-dark-900 flex items-center justify-center">
            <Shield className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-dark-900 dark:text-white truncate mb-1">
          {caregiver.user?.fullName || 'Professional Caregiver'}
        </h4>
        <div className="flex items-center gap-3 text-sm">
          {caregiver.rating && (
            <div className="flex items-center gap-1 text-dark-600 dark:text-dark-400">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{caregiver.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-dark-500 dark:text-dark-500">•</span>
          <span className="text-dark-600 dark:text-dark-400">{caregiver.completedJobs || 0} jobs</span>
        </div>
      </div>

      {/* Skills Badge */}
      {caregiver.skills && caregiver.skills.length > 0 && (
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-lg">
            {caregiver.skills[0].replace(/_/g, ' ')}
          </span>
          {caregiver.skills.length > 1 && (
            <span className="text-xs text-dark-500 dark:text-dark-400">
              +{caregiver.skills.length - 1}
            </span>
          )}
        </div>
      )}

      <ChevronRight className="w-5 h-5 text-dark-400" />
    </motion.div>
  );
}

// Standard Grid Card
function GridCard({ caregiver }: { caregiver: CaregiverProfile }) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={() => router.push(`/dashboard/caregivers/${caregiver.id}`)}
      className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer hover:shadow-xl p-5"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative flex-shrink-0">
          {caregiver.user?.profilePhoto ? (
            <img
              src={caregiver.user.profilePhoto}
              alt={caregiver.user.fullName || 'Caregiver'}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
              {caregiver.user?.fullName?.charAt(0).toUpperCase() || 'C'}
            </div>
          )}
          {caregiver.verificationStatus === 'APPROVED' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-dark-900 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-dark-900 dark:text-white truncate mb-1">
            {caregiver.user?.fullName || 'Professional'}
          </h3>
          {caregiver.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-dark-900 dark:text-white">
                {caregiver.rating.toFixed(1)}
              </span>
              {caregiver.totalReviews && (
                <span className="text-xs text-dark-500 dark:text-dark-400">
                  ({caregiver.totalReviews})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {caregiver.bio && (
        <p className="text-sm text-dark-600 dark:text-dark-400 mb-4 line-clamp-2">
          {caregiver.bio}
        </p>
      )}

      {/* Skills */}
      {caregiver.skills && caregiver.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {caregiver.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-lg"
            >
              {skill.replace(/_/g, ' ')}
            </span>
          ))}
          {caregiver.skills.length > 3 && (
            <span className="px-2.5 py-1 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 text-xs font-semibold rounded-lg">
              +{caregiver.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-100 dark:border-dark-800">
        <div className="text-sm">
          <span className="text-dark-500 dark:text-dark-400">Jobs:</span>
          <span className="ml-1 font-bold text-dark-900 dark:text-white">
            {caregiver.completedJobs || 0}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-primary-500" />
      </div>
    </motion.div>
  );
}

// Stats Card
function StatsCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-dark-200 dark:border-dark-800">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-3xl font-bold text-dark-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-dark-600 dark:text-dark-400">{label}</p>
    </div>
  );
}

function CaregiversContent() {
  const router = useRouter();
  const { caregivers, isLoading, searchCaregivers } = useCaregiver();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('mixed');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    searchCaregivers({});
  }, []);

  const filteredCaregivers = caregivers.filter((caregiver) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      caregiver.user?.fullName?.toLowerCase().includes(query) ||
      caregiver.bio?.toLowerCase().includes(query) ||
      caregiver.skills?.some((skill) => skill.toLowerCase().includes(query))
    );
  }).filter((caregiver) => {
    if (!selectedCategory) return true;
    return caregiver.skills?.includes(selectedCategory);
  });

  // Top performers
  const topRated = [...filteredCaregivers]
    .filter(c => c.rating && c.rating >= 4.5)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const mostExperienced = [...filteredCaregivers]
    .sort((a, b) => (b.completedJobs || 0) - (a.completedJobs || 0))
    .slice(0, 5);

  const verified = filteredCaregivers.filter(c => c.verificationStatus === 'APPROVED');

  // Stats
  const stats = [
    { icon: Users, label: 'Total Caregivers', value: filteredCaregivers.length, color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, label: 'Verified', value: verified.length, color: 'from-green-500 to-emerald-500' },
    { icon: Star, label: 'Top Rated', value: topRated.length, color: 'from-yellow-500 to-orange-500' },
    { icon: Flame, label: 'Most Active', value: mostExperienced.length, color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
                Find Caregivers
              </h1>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                Discover trusted professionals
              </p>
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-dark-900 rounded-xl p-1 border border-dark-200 dark:border-dark-800">
              <button
                onClick={() => setViewMode('mixed')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'mixed'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search caregivers, skills, specializations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === null
                    ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900'
                    : 'bg-white dark:bg-dark-900 text-dark-900 dark:text-white border border-dark-200 dark:border-dark-800'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-dark-900 text-dark-900 dark:text-white border border-dark-200 dark:border-dark-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredCaregivers.length === 0 ? (
          <div className="bg-white dark:bg-dark-900 rounded-2xl p-12 text-center border border-dark-200 dark:border-dark-800">
            <Users className="w-16 h-16 mx-auto mb-4 text-dark-400" />
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">No caregivers found</h3>
            <p className="text-sm text-dark-600 dark:text-dark-400">Try adjusting your search</p>
          </div>
        ) : (
          <>
            {viewMode === 'mixed' && (
              <>
                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                  {stats.map((stat, idx) => (
                    <StatsCard key={idx} {...stat} />
                  ))}
                </motion.div>

                {/* Hero Featured */}
                {topRated.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <HeroCard caregiver={topRated[0]} />
                  </motion.div>
                )}

                {/* Top Rated Grid */}
                {topRated.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-500" />
                      Top Rated
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {topRated.slice(1, 3).map((caregiver) => (
                        <GridCard key={caregiver.id} caregiver={caregiver} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Most Experienced List */}
                {mostExperienced.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6 text-blue-500" />
                      Most Experienced
                    </h2>
                    <div className="space-y-3">
                      {mostExperienced.map((caregiver) => (
                        <ListItem key={caregiver.id} caregiver={caregiver} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* All Others Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">All Caregivers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCaregivers.map((caregiver) => (
                      <GridCard key={caregiver.id} caregiver={caregiver} />
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCaregivers.map((caregiver) => (
                  <GridCard key={caregiver.id} caregiver={caregiver} />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-3">
                {filteredCaregivers.map((caregiver) => (
                  <ListItem key={caregiver.id} caregiver={caregiver} />
                ))}
              </div>
            )}
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
