"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Car, Building, ParkingSquare, Layers } from 'lucide-react';
import { ParkingService, type SearchResult } from '@/lib/parkingService';
import { toast } from 'sonner';

interface ParkingSearchBarProps {
  onLocationSelect?: (location: SearchResult) => void;
  placeholder?: string;
  className?: string;
  showResults?: boolean;
  maxResults?: number;
}

export default function ParkingSearchBar({
  onLocationSelect,
  placeholder = "Caută parcare...",
  className = "",
  showResults = true,
  maxResults = 10
}: ParkingSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for parking locations
  const searchParkingLocations = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await ParkingService.searchParkingLocations(term, maxResults);
      if (result.success && result.data) {
        setSearchResults(result.data);
        setShowDropdown(result.data.length > 0);
        setSelectedIndex(-1);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
        if (result.error) {
          console.error('Search error:', result.error);
        }
      }
    } catch (error) {
      console.error('Error searching parking locations:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchParkingLocations(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, maxResults]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleLocationSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: SearchResult) => {
    setSearchTerm(location.name);
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    toast.success(`Parcare selectată: ${location.name}`);
  };

  // Get parking type icon
  const getParkingTypeIcon = (type: string) => {
    switch (type) {
      case 'garage':
        return <Building size={16} className="text-blue-500" />;
      case 'underground':
        return <Layers size={16} className="text-purple-500" />;
      case 'lot':
        return <ParkingSquare size={16} className="text-green-500" />;
      case 'street':
        return <Car size={16} className="text-orange-500" />;
      default:
        return <MapPin size={16} className="text-gray-500" />;
    }
  };

  // Get parking type label
  const getParkingTypeLabel = (type: string) => {
    switch (type) {
      case 'garage':
        return 'Garaj';
      case 'underground':
        return 'Subteran';
      case 'lot':
        return 'Parcare deschisă';
      case 'street':
        return 'Stradală';
      default:
        return type;
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div
              key={result.id}
              className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                index === selectedIndex ? 'bg-accent' : ''
              } ${index < searchResults.length - 1 ? 'border-b border-border' : ''}`}
              onClick={() => handleLocationSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getParkingTypeIcon(result.parking_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">
                      {result.name}
                    </h4>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {getParkingTypeLabel(result.parking_type)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {result.address}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{result.city}</span>
                    {result.district && <span>• {result.district}</span>}
                    {result.price_per_hour && (
                      <span className="text-green-600 font-medium">
                        {result.is_free ? 'Gratuit' : `${result.price_per_hour} RON/h`}
                      </span>
                    )}
                    {result.available_spots !== undefined && result.total_spots && (
                      <span className="text-blue-600">
                        {result.available_spots}/{result.total_spots} locuri
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showDropdown && showResults && searchTerm.trim() && !isSearching && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 p-4">
          <div className="text-center text-muted-foreground">
            <MapPin size={24} className="mx-auto mb-2 text-muted-foreground/50" />
            <p>Nu s-au găsit parcări pentru "{searchTerm}"</p>
            <p className="text-sm">Încearcă să modifici termenul de căutare</p>
          </div>
        </div>
      )}
    </div>
  );
} 