"use client";

import { useState, useEffect } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  caregiverId: string;
  initialIsFavorite?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  caregiverId,
  initialIsFavorite = false,
  size = 'md',
  variant = 'icon',
  onToggle,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch favorite status on mount
  useEffect(() => {
    fetchFavoriteStatus();
  }, [caregiverId]);

  const fetchFavoriteStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${caregiverId}/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.data?.isFavorite || false);
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
    }
  };

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${caregiverId}/toggle`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      const data = await response.json();
      const newIsFavorite = data.data?.isFavorite || false;
      setIsFavorite(newIsFavorite);
      onToggle?.(newIsFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        disabled={isLoading}
        className={`${sizeClasses[size]} rounded-full bg-white dark:bg-dark-900 border-2 ${
          isFavorite
            ? 'border-red-500'
            : 'border-gray-300 dark:border-dark-700'
        } flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <RefreshCw
            className={`${iconSizes[size]} text-gray-400 animate-spin`}
          />
        ) : (
          <Heart
            className={`${iconSizes[size]} ${
              isFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 dark:text-dark-500'
            } transition-colors`}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${
        isFavorite
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          : 'border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-700 dark:text-dark-300'
      } hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
    >
      {isLoading ? (
        <>
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500' : ''
            }`}
          />
          <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
        </>
      )}
    </motion.button>
  );
}

// Compact variant for use in lists
export function FavoriteIconButton({
  caregiverId,
  initialIsFavorite = false,
  onToggle,
}: Omit<FavoriteButtonProps, 'size' | 'variant'>) {
  return (
    <FavoriteButton
      caregiverId={caregiverId}
      initialIsFavorite={initialIsFavorite}
      size="sm"
      variant="icon"
      onToggle={onToggle}
    />
  );
}

// Full button variant with text
export function FavoriteTextButton({
  caregiverId,
  initialIsFavorite = false,
  onToggle,
}: Omit<FavoriteButtonProps, 'size' | 'variant'>) {
  return (
    <FavoriteButton
      caregiverId={caregiverId}
      initialIsFavorite={initialIsFavorite}
      size="md"
      variant="button"
      onToggle={onToggle}
    />
  );
}
