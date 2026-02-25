"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { useElderly } from '@/hooks/useElderly';
import { Button, Spinner } from '@/components/ui';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { motion } from 'framer-motion';
import { CreateElderlyRequest } from '@/types/models';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  MapPin,
  RefreshCw,
} from 'lucide-react';

function EditElderlyContent() {
  const router = useRouter();
  const params = useParams();
  const elderlyId = params.id as string;
  const { currentElderly, isLoading, fetchElderlyById, updateElderly } = useElderly();

  const [formData, setFormData] = useState<CreateElderlyRequest>({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    latitude: undefined,
    longitude: undefined,
    locationNotes: '',
    medicalConditions: '',
    medications: '',
    mobilityNotes: '',
    specialInstructions: '',
  });

  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);

  useEffect(() => {
    if (elderlyId) {
      fetchElderlyById(elderlyId);
    }
  }, [elderlyId]);

  useEffect(() => {
    if (currentElderly) {
      // Format date for input (YYYY-MM-DD)
      let formattedDate = '';
      if (currentElderly.dateOfBirth) {
        const date = new Date(currentElderly.dateOfBirth);
        formattedDate = date.toISOString().split('T')[0];
      }

      setFormData({
        fullName: currentElderly.fullName || '',
        dateOfBirth: formattedDate,
        gender: currentElderly.gender || 'male',
        address: currentElderly.address || '',
        latitude: currentElderly.latitude,
        longitude: currentElderly.longitude,
        locationNotes: currentElderly.locationNotes || '',
        medicalConditions: currentElderly.medicalConditions || '',
        medications: currentElderly.medications || '',
        mobilityNotes: currentElderly.mobilityNotes || '',
        specialInstructions: currentElderly.specialInstructions || '',
      });
    }
  }, [currentElderly]);

  const handleRefreshCoordinates = async () => {
    if (!formData.address) {
      toast.error('Please enter an address first');
      return;
    }

    setIsGeocodingAddress(true);
    toast.loading('Getting coordinates for this address...', { id: 'geocode' });

    try {
      const { geocodeAddress } = await import('@/utils/geocoding');
      const result = await geocodeAddress(formData.address);

      if (result) {
        setFormData({
          ...formData,
          latitude: result.latitude,
          longitude: result.longitude,
        });
        toast.success(`Location found! Lat: ${result.latitude.toFixed(6)}, Lng: ${result.longitude.toFixed(6)}`, { id: 'geocode' });
      } else {
        toast.error('Could not find coordinates for this address. Please try a more specific address.', { id: 'geocode' });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to get coordinates', { id: 'geocode' });
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.address) {
      toast.error('Please fill in required fields (Full Name and Address)');
      return;
    }

    // If coordinates are not set, try to geocode the address
    if (!formData.latitude || !formData.longitude) {
      toast.loading('Getting location coordinates...', { id: 'geocode' });
      const { geocodeAddress } = await import('@/utils/geocoding');
      const result = await geocodeAddress(formData.address);

      if (result) {
        formData.latitude = result.latitude;
        formData.longitude = result.longitude;
        toast.success('Location found!', { id: 'geocode' });
      } else {
        toast.dismiss('geocode');
        toast.error('Could not find coordinates for this address. Please try a more specific address.');
        return;
      }
    }

    try {
      await updateElderly(elderlyId, formData);
      toast.success('Profile updated successfully!', { icon: '✅' });
      setTimeout(() => {
        router.push('/dashboard/elderly');
      }, 500);
    } catch (error) {
      console.error('Failed to update elderly profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (!currentElderly || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950">
        <DashboardNav />
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <DashboardNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back
        </Button>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-100 dark:border-dark-800">
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              Edit Elderly Profile
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">
              Update profile information for {currentElderly?.fullName}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Location Information
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                      Address *
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshCoordinates}
                      disabled={isGeocodingAddress || !formData.address}
                      leftIcon={<RefreshCw className={`w-4 h-4 ${isGeocodingAddress ? 'animate-spin' : ''}`} />}
                    >
                      {isGeocodingAddress ? 'Getting...' : 'Refresh Coordinates'}
                    </Button>
                  </div>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(address, latitude, longitude) => {
                      setFormData({
                        ...formData,
                        address,
                        latitude,
                        longitude,
                      });
                    }}
                    placeholder="Start typing to search for address..."
                    required
                  />
                  {formData.latitude && formData.longitude && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Location Notes
                  </label>
                  <textarea
                    value={formData.locationNotes}
                    onChange={(e) => setFormData({ ...formData, locationNotes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Near Senteu Plaza, kilimani"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Medical Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., HBP, Diabetes, Heart condition"
                    maxLength={2000}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 2000 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Metformin 500mg twice daily, Aspirin 81mg daily"
                    maxLength={2000}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Care Information */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Care Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Mobility Notes
                  </label>
                  <textarea
                    value={formData.mobilityNotes}
                    onChange={(e) => setFormData({ ...formData, mobilityNotes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Uses wheelchair, Needs walker, Fully mobile"
                    maxLength={500}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 500 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Any special care instructions, preferences, or important notes for caregivers"
                    maxLength={2000}
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Max 2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="w-5 h-5" />}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function EditElderlyPage() {
  return (
    <ProtectedRoute>
      <EditElderlyContent />
    </ProtectedRoute>
  );
}
