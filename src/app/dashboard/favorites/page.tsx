"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Search,
  RefreshCw,
  ChevronRight,
  Award,
  Shield,
} from 'lucide-react';

// Types
interface FavoriteCaregiver {
  id: string;
  caregiverId: string;
  addedAt: string;
  caregiver: {
    id: string;
    userId: string;
    fullName: string;
    profilePhoto?: string;
    phone?: string;
    email?: string;
    bio?: string;
    experience: number;
    rating: number;
    totalReviews: number;
    hourlyRate: number;
    availability?: string;
    skills?: string[];
    isVerified: boolean;
    isAvailable: boolean;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteCaregiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch favorites
  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from favorites
  const removeFavorite = async (caregiverId: string) => {
    setRemovingId(caregiverId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${caregiverId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      // Remove from local state
      setFavorites((prev) =>
        prev.filter((fav) => fav.caregiverId !== caregiverId)
      );
    } catch (err) {
      console.error('Error removing favorite:', err);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 pb-24">
        {/* Header */}
        <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400 fill-red-600 dark:fill-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Favorite Caregivers
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-dark-400">
                    {favorites.length} {favorites.length === 1 ? 'caregiver' : 'caregivers'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchFavorites}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={fetchFavorites} />
          ) : favorites.length === 0 ? (
            <EmptyState onBrowse={() => router.push('/dashboard/caregivers')} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <CaregiverCard
                  key={favorite.id}
                  favorite={favorite}
                  onRemove={() => removeFavorite(favorite.caregiverId)}
                  isRemoving={removingId === favorite.caregiverId}
                  onViewProfile={() =>
                    router.push(`/dashboard/caregivers/${favorite.caregiverId}`)
                  }
                />
              ))}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}

// Caregiver Card Component
function CaregiverCard({
  favorite,
  onRemove,
  isRemoving,
  onViewProfile,
}: {
  favorite: FavoriteCaregiver;
  onRemove: () => void;
  isRemoving: boolean;
  onViewProfile: () => void;
}) {
  const { caregiver } = favorite;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-800 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar and Name */}
          <div className="flex items-start gap-3 flex-1">
            {caregiver.profilePhoto ? (
              <img
                src={caregiver.profilePhoto}
                alt={caregiver.fullName}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                {caregiver.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                {caregiver.fullName}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {caregiver.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-dark-400">
                  ({caregiver.totalReviews})
                </span>
                {caregiver.isVerified && (
                  <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={onRemove}
            disabled={isRemoving}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRemoving ? (
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            )}
          </button>
        </div>

        {/* Bio */}
        {caregiver.bio && (
          <p className="text-sm text-gray-600 dark:text-dark-400 line-clamp-2 mb-4">
            {caregiver.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Award className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-gray-700 dark:text-dark-300">
              {caregiver.experience} years
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-gray-700 dark:text-dark-300">
              KES {caregiver.hourlyRate}/hr
            </span>
          </div>
        </div>

        {/* Skills */}
        {caregiver.skills && caregiver.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {caregiver.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg"
              >
                {skill}
              </span>
            ))}
            {caregiver.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-dark-400 text-xs font-medium rounded-lg">
                +{caregiver.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Availability Badge */}
        {caregiver.isAvailable && (
          <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Available Now</span>
          </div>
        )}

        {/* View Profile Button */}
        <Button
          onClick={onViewProfile}
          className="w-full"
          variant="primary"
        >
          View Profile
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

// Loading State
function LoadingState() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-800 p-6 animate-pulse"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-dark-800 rounded-xl" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 dark:bg-dark-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-dark-800 rounded w-1/2" />
            </div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-dark-800 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-dark-800 rounded w-5/6 mb-4" />
          <div className="h-10 bg-gray-200 dark:bg-dark-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// Empty State
function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-6">
        <Heart className="w-12 h-12 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No Favorites Yet
      </h2>
      <p className="text-gray-600 dark:text-dark-400 text-center max-w-md mb-8">
        Start adding caregivers to your favorites to quickly access them later and
        keep track of your preferred care providers.
      </p>
      <Button onClick={onBrowse} variant="primary" size="lg">
        <Search className="w-5 h-5 mr-2" />
        Browse Caregivers
      </Button>
    </div>
  );
}

// Error State
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-6">
        <Heart className="w-12 h-12 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Failed to Load Favorites
      </h2>
      <p className="text-gray-600 dark:text-dark-400 text-center max-w-md mb-8">
        {error}
      </p>
      <Button onClick={onRetry} variant="primary" size="lg">
        <RefreshCw className="w-5 h-5 mr-2" />
        Try Again
      </Button>
    </div>
  );
}
