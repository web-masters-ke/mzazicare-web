"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { loadGoogleMapsScript } from '@/utils/geocoding';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, latitude?: number, longitude?: number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Enter address...',
  className = '',
  required = false,
  error,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initAutocomplete = async () => {
      if (!inputRef.current) return;

      setIsLoading(true);
      try {
        await loadGoogleMapsScript();

        // Initialize autocomplete
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'ke' }, // Restrict to Kenya
        });

        autocompleteRef.current = autocomplete;

        // Listen for place selection
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (place.geometry && place.geometry.location) {
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const address = place.formatted_address || place.name;

            onChange(address, latitude, longitude);
          } else if (place.name) {
            // User selected a place without geometry, just use the name
            onChange(place.name);
          }
        });
      } catch (error) {
        console.error('Failed to initialize Google Places Autocomplete:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAutocomplete();
  }, []);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleManualChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-dark-200 dark:border-dark-700 focus:ring-primary-500'
          } bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 ${className}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 animate-spin" />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <p className="mt-1 text-xs text-dark-500 dark:text-dark-400">
        Start typing to search for an address
      </p>
    </div>
  );
}
