/**
 * Google Maps Geocoding utilities
 */

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface ReverseGeocodeResult {
  formatted: string;
  street?: string;
  neighborhood?: string;
  sublocality?: string;
  locality?: string;
  country?: string;
}

/**
 * Geocode an address to get coordinates
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    console.warn('Geocoding failed:', data.status);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get detailed address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      // Find the best result with street address
      const streetResult = data.results.find((result: any) => {
        const types = result.types || [];
        return types.includes('street_address') || types.includes('route') || types.includes('premise');
      });

      // Find neighborhood
      const neighborhoodResult = data.results.find((result: any) => {
        const types = result.types || [];
        return types.includes('neighborhood');
      });

      // Get all components from all results
      const allComponents = data.results.flatMap((r: any) => r.address_components || []);

      // Extract address parts
      const street = allComponents.find((c: any) => c.types.includes('route'))?.long_name;
      const neighborhood = allComponents.find((c: any) => c.types.includes('neighborhood'))?.long_name;
      const sublocality = allComponents.find((c: any) => c.types.includes('sublocality'))?.long_name;
      const locality = allComponents.find((c: any) => c.types.includes('locality'))?.long_name;
      const country = allComponents.find((c: any) => c.types.includes('country'))?.long_name;

      // Build formatted address
      const parts = [street, neighborhood, sublocality, locality, country].filter(Boolean);
      const formatted = parts.join(', ') || data.results[0].formatted_address;

      return {
        formatted,
        street,
        neighborhood,
        sublocality,
        locality,
        country,
      };
    }

    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Load Google Maps Places Autocomplete script
 */
export function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));

    document.head.appendChild(script);
  });
}

// Type declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}
