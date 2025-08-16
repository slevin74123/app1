"use client";

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import ParkingSearchBar from './ParkingSearchBar';
import { type SearchResult } from '@/lib/parkingService';
import { toast } from 'sonner';

export default function MainSearchBar() {
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);

  const handleLocationSelect = (location: SearchResult) => {
    setSelectedLocation(location);
    toast.success(`Parcare selectată: ${location.name}`);
    
    // Aici poți adăuga logica pentru a afișa parcarea pe hartă
    // sau pentru a naviga către acea locație
  };

  return (
    <div className="w-full bg-background border-t border-border">
      {/* Main Search Bar Section */}
      <div className="w-full p-4 space-y-3">
        {/* Search Input Field */}
        <div className="w-full">
          <ParkingSearchBar
            placeholder="Caută parcare, zonă sau destinație..."
            onLocationSelect={handleLocationSelect}
            className="w-full"
            maxResults={12}
          />
        </div>
      </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <MapPin size={20} className="text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {selectedLocation.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedLocation.address}, {selectedLocation.city}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedLocation.is_free 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedLocation.is_free ? 'Gratuit' : `${selectedLocation.price_per_hour} RON/h`}
                </span>
                {selectedLocation.available_spots !== undefined && selectedLocation.total_spots && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    {selectedLocation.available_spots}/{selectedLocation.total_spots} locuri
                  </span>
                )}
              </div>
            </div>
          </div>
        )}


    </div>
  );
} 