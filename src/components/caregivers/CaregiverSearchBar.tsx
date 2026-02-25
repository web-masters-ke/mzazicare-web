"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface SearchSuggestion {
  type: 'caregiver' | 'location' | 'category' | 'recent';
  text: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface CaregiverSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

export function CaregiverSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search caregivers by name, skills, or location...',
  showSuggestions = true,
}: CaregiverSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isFocused && value.length === 0 && showSuggestions) {
      const recentSearches = getRecentSearches();
      const popularSearches: SearchSuggestion[] = [
        {
          type: 'category',
          text: 'Companionship',
          subtitle: 'Popular service',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          type: 'category',
          text: 'Health Monitoring',
          subtitle: 'Popular service',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          type: 'location',
          text: 'Nairobi CBD',
          subtitle: 'Location',
          icon: <MapPin className="w-4 h-4" />,
        },
      ];

      setSuggestions([...recentSearches, ...popularSearches]);
    } else if (value.length > 0 && showSuggestions) {
      // Generate suggestions based on input
      generateSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, [value, isFocused, showSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateSuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Category suggestions
    const categories = [
      'Companionship',
      'Health Monitoring',
      'Home Check-In',
      'Errands',
      'Emergency Response',
      'Cleaning',
    ];
    categories
      .filter((cat) => cat.toLowerCase().includes(lowerQuery))
      .forEach((cat) => {
        newSuggestions.push({
          type: 'category',
          text: cat,
          subtitle: 'Service category',
          icon: <Search className="w-4 h-4" />,
        });
      });

    // Location suggestions
    const locations = [
      'Nairobi CBD',
      'Westlands',
      'Karen',
      'Kilimani',
      'Parklands',
      'Lavington',
    ];
    locations
      .filter((loc) => loc.toLowerCase().includes(lowerQuery))
      .forEach((loc) => {
        newSuggestions.push({
          type: 'location',
          text: loc,
          subtitle: 'Location',
          icon: <MapPin className="w-4 h-4" />,
        });
      });

    setSuggestions(newSuggestions.slice(0, 6));
  };

  const getRecentSearches = (): SearchSuggestion[] => {
    try {
      const recent = localStorage.getItem('recentSearches');
      if (recent) {
        const searches = JSON.parse(recent) as string[];
        return searches.slice(0, 3).map((search) => ({
          type: 'recent',
          text: search,
          subtitle: 'Recent search',
          icon: <Clock className="w-4 h-4" />,
        }));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
    return [];
  };

  const saveRecentSearch = (query: string) => {
    try {
      const recent = localStorage.getItem('recentSearches');
      let searches: string[] = recent ? JSON.parse(recent) : [];

      // Remove if already exists
      searches = searches.filter((s) => s !== query);

      // Add to beginning
      searches.unshift(query);

      // Keep only last 10
      searches = searches.slice(0, 10);

      localStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      saveRecentSearch(value.trim());
      onSearch();
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    saveRecentSearch(suggestion.text);
    setIsFocused(false);
    onSearch();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center bg-white dark:bg-dark-900 border-2 rounded-2xl transition-all overflow-hidden ${
            isFocused
              ? 'border-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/20'
              : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'
          }`}
        >
          {/* Search Icon */}
          <div className="pl-5 pr-3">
            <Search className="w-5 h-5 text-gray-400 dark:text-dark-500" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="flex-1 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-500 focus:outline-none text-base"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-dark-500" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Search Button */}
          <button
            type="submit"
            className="px-6 py-3 m-1 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            Search
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-2xl shadow-lg overflow-hidden z-50"
          >
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors text-left"
                >
                  {suggestion.icon && (
                    <div className="text-gray-400 dark:text-dark-500">
                      {suggestion.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {suggestion.text}
                    </p>
                    {suggestion.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-dark-500">
                        {suggestion.subtitle}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-dark-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact search bar variant
export function CompactSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
}: Omit<CaregiverSearchBarProps, 'showSuggestions'>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-dark-600 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/20 transition-all">
        <div className="pl-3 pr-2">
          <Search className="w-4 h-4 text-gray-400 dark:text-dark-500" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 py-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-500 focus:outline-none text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-800 rounded transition-colors mr-1"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-dark-500" />
          </button>
        )}
      </div>
    </form>
  );
}
