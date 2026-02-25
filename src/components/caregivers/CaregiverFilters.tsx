"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  Star,
  DollarSign,
  Award,
  Users,
  CheckCircle,
  Zap,
  Shield,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui';

export interface CaregiverFilterParams {
  query?: string;
  category?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  minExperience?: number;
  isOnline?: boolean;
  isAvailable?: boolean;
  isVerified?: boolean;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  sortBy?: 'rating' | 'price' | 'experience' | 'distance' | 'recent';
  sortOrder?: 'asc' | 'desc';
}

interface CaregiverFiltersProps {
  filters: CaregiverFilterParams;
  onFiltersChange: (filters: CaregiverFilterParams) => void;
  onClose?: () => void;
}

export function CaregiverFilters({
  filters,
  onFiltersChange,
  onClose,
}: CaregiverFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CaregiverFilterParams>(filters);

  const updateFilter = (key: keyof CaregiverFilterParams, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const clearedFilters: CaregiverFilterParams = {
      query: filters.query, // Preserve search query
      category: filters.category, // Preserve category
      sortBy: 'rating',
      sortOrder: 'desc',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) =>
      value !== undefined &&
      value !== null &&
      key !== 'query' &&
      key !== 'category' &&
      key !== 'sortBy' &&
      key !== 'sortOrder'
  ).length;

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Filters & Sort
              </h3>
              {activeFiltersCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-dark-400">
                  {activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
            >
              Clear All
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto">
        {/* Sort Section */}
        <div>
          <FilterSectionHeader
            icon={<ArrowUpDown className="w-4 h-4" />}
            title="Sort By"
          />
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { value: 'rating', label: 'Rating' },
              { value: 'price', label: 'Price' },
              { value: 'experience', label: 'Experience' },
              { value: 'recent', label: 'Recent' },
            ].map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={localFilters.sortBy === option.value}
                onClick={() => updateFilter('sortBy', option.value)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ].map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={localFilters.sortOrder === option.value}
                onClick={() => updateFilter('sortOrder', option.value)}
                variant="outline"
              />
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <FilterSectionHeader
            icon={<Star className="w-4 h-4" />}
            title="Minimum Rating"
          />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  updateFilter(
                    'minRating',
                    localFilters.minRating === rating ? undefined : rating
                  )
                }
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                  localFilters.minRating === rating
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    localFilters.minRating === rating
                      ? 'fill-primary-500 text-primary-500'
                      : 'text-yellow-400'
                  }`}
                />
                <span className="text-sm font-medium">{rating}+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <FilterSectionHeader
            icon={<DollarSign className="w-4 h-4" />}
            title="Price Range (KES/hr)"
          />
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) =>
                updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-gray-500 dark:text-dark-400">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) =>
                updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Experience */}
        <div>
          <FilterSectionHeader
            icon={<Award className="w-4 h-4" />}
            title="Minimum Experience"
          />
          <div className="flex flex-wrap gap-2">
            {[1, 3, 5, 10].map((years) => (
              <FilterChip
                key={years}
                label={`${years}+ years`}
                selected={localFilters.minExperience === years}
                onClick={() =>
                  updateFilter(
                    'minExperience',
                    localFilters.minExperience === years ? undefined : years
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Gender Preference */}
        <div>
          <FilterSectionHeader
            icon={<Users className="w-4 h-4" />}
            title="Gender Preference"
          />
          <div className="flex gap-2">
            {[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
            ].map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={localFilters.gender === option.value}
                onClick={() =>
                  updateFilter(
                    'gender',
                    localFilters.gender === option.value ? undefined : option.value
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <FilterSectionHeader
            icon={<CheckCircle className="w-4 h-4" />}
            title="Status"
          />
          <div className="space-y-3">
            <FilterToggle
              icon={<Zap className="w-4 h-4" />}
              label="Online Now"
              checked={localFilters.isOnline}
              onChange={(checked) => updateFilter('isOnline', checked ? true : undefined)}
            />
            <FilterToggle
              icon={<CheckCircle className="w-4 h-4" />}
              label="Available for Booking"
              checked={localFilters.isAvailable}
              onChange={(checked) => updateFilter('isAvailable', checked ? true : undefined)}
            />
            <FilterToggle
              icon={<Shield className="w-4 h-4" />}
              label="Verified Only"
              checked={localFilters.isVerified}
              onChange={(checked) => updateFilter('isVerified', checked ? true : undefined)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-dark-800 bg-gray-50 dark:bg-dark-800/50">
        <Button onClick={applyFilters} className="w-full" size="lg">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

// Filter Section Header
function FilterSectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-primary-600 dark:text-primary-400">{icon}</div>
      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
    </div>
  );
}

// Filter Chip
function FilterChip({
  label,
  selected,
  onClick,
  variant = 'solid',
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'solid' | 'outline';
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        selected
          ? variant === 'solid'
            ? 'bg-primary-500 text-white'
            : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-2 border-primary-500'
          : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-700'
      }`}
    >
      {label}
    </motion.button>
  );
}

// Filter Toggle
function FilterToggle({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2">
        <div className="text-gray-600 dark:text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
      </div>
      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 dark:border-dark-700 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
      />
    </label>
  );
}

// Compact filter badge for showing active filters
export function FilterBadge({
  filters,
  onRemove,
}: {
  filters: CaregiverFilterParams;
  onRemove: () => void;
}) {
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) =>
      value !== undefined &&
      value !== null &&
      key !== 'query' &&
      key !== 'category' &&
      key !== 'sortBy' &&
      key !== 'sortOrder'
  ).length;

  if (activeFiltersCount === 0) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={onRemove}
      className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span>{activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}</span>
      <X className="w-4 h-4" />
    </motion.button>
  );
}
