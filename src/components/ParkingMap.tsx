"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Search, Filter, X, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { motion, AnimatePresence } from 'framer-motion';

// Add Google Maps types at the top of the file
interface GoogleMapsMap {
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
}

interface GoogleMapsMarker {
  setMap: (map: GoogleMapsMap | null) => void;
  addListener: (event: string, callback: () => void) => void;
}

interface GoogleMapsInfoWindow {
  setContent: (content: string) => void;
  open: (map: GoogleMapsMap, marker: GoogleMapsMarker) => void;
}

interface GoogleMapsAPI {
  maps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map: new (element: HTMLElement, options: any) => GoogleMapsMap;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Marker: new (options: any) => GoogleMapsMarker;
    InfoWindow: new () => GoogleMapsInfoWindow;
    SymbolPath: {
      CIRCLE: number;
    };
    Animation: {
      DROP: number;
    };
  };
}

declare global {
  interface Window {
    google: GoogleMapsAPI;
  }
}

interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  freeSpaces: number;
  totalSpaces: number;
  price: number;
  status: 'free' | 'occupied' | 'temporary';
  zone: string;
  street: string;
  operatingHours: string;
  lastUpdated: string;
}

interface Zone {
  id: string;
  name: string;
}

interface Street {
  id: string;
  name: string;
}

interface ParkingMapProps {
  className?: string;
}

const mockZones: Zone[] = [
  { id: "1", name: "Centrul Vechi" },
  { id: "2", name: "Piața Unirii" },
  { id: "3", name: "Calea Victoriei" },
  { id: "4", name: "Herăstrău" },
  { id: "5", name: "Băneasa" }
];

const mockStreets: Street[] = [
  { id: "1", name: "Strada Lipscani" },
  { id: "2", name: "Bulevardul Magheru" },
  { id: "3", name: "Strada Franceză" },
  { id: "4", name: "Calea Dorobanți" },
  { id: "5", name: "Strada Amzei" },
  { id: "6", name: "Bulevardul Unirii" },
  { id: "7", name: "Strada Smârdan" }
];

const mockParkingLocations: ParkingLocation[] = [
  {
    id: "1",
    name: "Parcare Centrul Vechi",
    address: "Strada Lipscani 15",
    lat: 44.4268,
    lng: 26.1025,
    freeSpaces: 12,
    totalSpaces: 50,
    price: 5,
    status: "free",
    zone: "Centrul Vechi",
    street: "Strada Lipscani",
    operatingHours: "08:00 - 22:00",
    lastUpdated: "Acum 2 minute"
  },
  {
    id: "2",
    name: "Parcare Piața Unirii",
    address: "Piața Unirii 1",
    lat: 44.4267,
    lng: 26.1030,
    freeSpaces: 0,
    totalSpaces: 30,
    price: 8,
    status: "occupied",
    zone: "Piața Unirii",
    street: "Bulevardul Unirii",
    operatingHours: "24/7",
    lastUpdated: "Acum 1 minut"
  },
  {
    id: "3",
    name: "Parcare Magheru",
    address: "Bulevardul Magheru 25",
    lat: 44.4270,
    lng: 26.1020,
    freeSpaces: 8,
    totalSpaces: 25,
    price: 6,
    status: "free",
    zone: "Calea Victoriei",
    street: "Bulevardul Magheru",
    operatingHours: "07:00 - 23:00",
    lastUpdated: "Acum 5 minute"
  },
  {
    id: "4",
    name: "Parcare Franceză",
    address: "Strada Franceză 10",
    lat: 44.4265,
    lng: 26.1035,
    freeSpaces: 15,
    totalSpaces: 40,
    price: 4,
    status: "free",
    zone: "Centrul Vechi",
    street: "Strada Franceză",
    operatingHours: "09:00 - 21:00",
    lastUpdated: "Acum 3 minute"
  },
  {
    id: "5",
    name: "Parcare Amzei",
    address: "Strada Amzei 5",
    lat: 44.4272,
    lng: 26.1015,
    freeSpaces: 2,
    totalSpaces: 35,
    price: 7,
    status: "temporary",
    zone: "Calea Victoriei",
    street: "Strada Amzei",
    operatingHours: "08:00 - 20:00",
    lastUpdated: "Acum 1 minut"
  },
  {
    id: "6",
    name: "Parcare Herăstrău",
    address: "Șoseaua Nordului 1",
    lat: 44.4700,
    lng: 26.0800,
    freeSpaces: 25,
    totalSpaces: 80,
    price: 3,
    status: "free",
    zone: "Herăstrău",
    street: "Șoseaua Nordului",
    operatingHours: "06:00 - 24:00",
    lastUpdated: "Acum 10 minute"
  },
  {
    id: "7",
    name: "Parcare Băneasa",
    address: "Șoseaua București-Ploiești 1",
    lat: 44.5200,
    lng: 26.0800,
    freeSpaces: 0,
    totalSpaces: 60,
    price: 4,
    status: "occupied",
    zone: "Băneasa",
    street: "Șoseaua București-Ploiești",
    operatingHours: "24/7",
    lastUpdated: "Acum 2 minute"
  }
];

export default function ParkingMap({ className }: ParkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // Using any types for Google Maps API integration - this is the most practical approach
  // as the Google Maps types are complex and the API is loaded dynamically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoWindowRef = useRef<any>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedStreets, setSelectedStreets] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [parkingLocations, setParkingLocations] = useState<ParkingLocation[]>(mockParkingLocations);


  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'your-api-key-here',
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 44.4268, lng: 26.1025 }, // Bucharest center
            zoom: 14,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ],
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false
          });

          mapInstanceRef.current = map;
          infoWindowRef.current = new google.maps.InfoWindow();
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Create custom markers with colored pins
  const createCustomMarker = useCallback((parking: ParkingLocation) => {
    if (!mapInstanceRef.current) return null;

    const getMarkerColor = (status: string) => {
      switch (status) {
        case 'free': return '#22c55e'; // Green
        case 'occupied': return '#ef4444'; // Red
        case 'temporary': return '#eab308'; // Yellow
        default: return '#6b7280'; // Gray
      }
    };

    const getMarkerIcon = (status: string) => {
      const color = getMarkerColor(status);
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        path: (window as any).google?.maps?.SymbolPath?.CIRCLE || 0,
        fillColor: color,
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8
      };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marker = new (window as any).google.maps.Marker({
      position: { lat: parking.lat, lng: parking.lng },
      map: mapInstanceRef.current,
      title: parking.name,
      icon: getMarkerIcon(parking.status),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      animation: (window as any).google?.maps?.Animation?.DROP
    });

    // Create info window content
    const infoContent = `
      <div style="padding: 12px; max-width: 250px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
          ${parking.name}
        </h3>
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          ${parking.address}
        </p>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #059669; font-weight: 600;">
            ${parking.freeSpaces}/${parking.totalSpaces} locuri libere
          </span>
          <span style="color: #dc2626; font-weight: 600;">
            ${parking.price} RON/oră
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
          <span>${parking.operatingHours}</span>
          <span>${parking.lastUpdated}</span>
        </div>
      </div>
    `;

    marker.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    });

    return marker;
  }, []);

  // Update markers on map
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Filter parking locations
    const filteredLocations = parkingLocations.filter(parking => {
      const matchesSearch = searchQuery === "" || 
        parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parking.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesZone = selectedZones.length === 0 || 
        selectedZones.includes(parking.zone);
      
      const matchesStreet = selectedStreets.length === 0 || 
        selectedStreets.includes(parking.street);
      
      const matchesPrice = parking.price >= priceRange[0] && 
        parking.price <= priceRange[1];

      return matchesSearch && matchesZone && matchesStreet && matchesPrice;
    });

    // Create new markers
    filteredLocations.forEach(parking => {
      const marker = createCustomMarker(parking);
      if (marker) {
        markersRef.current.push(marker);
      }
    });
  }, [isMapLoaded, parkingLocations, searchQuery, selectedZones, selectedStreets, priceRange, createCustomMarker]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setParkingLocations(prev => prev.map(parking => ({
        ...parking,
        freeSpaces: Math.max(0, parking.freeSpaces + Math.floor(Math.random() * 3) - 1),
        lastUpdated: "Acum 1 minut"
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleZoneChange = (zoneName: string, checked: boolean) => {
    if (checked) {
      setSelectedZones(prev => [...prev, zoneName]);
    } else {
      setSelectedZones(prev => prev.filter(z => z !== zoneName));
    }
  };

  const handleStreetChange = (streetName: string, checked: boolean) => {
    if (checked) {
      setSelectedStreets(prev => [...prev, streetName]);
    } else {
      setSelectedStreets(prev => prev.filter(s => s !== streetName));
    }
  };

  const clearFilters = () => {
    setSelectedZones([]);
    setSelectedStreets([]);
    setSearchQuery("");
    setPriceRange([0, 20]);
  };

  const getStatusCount = (status: string) => {
    return parkingLocations.filter(p => p.status === status).length;
  };

  return (
    <div className={`h-full flex ${className}`}>
      {/* Filters Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtre</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                  Căutare
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Caută după adresă..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preț per oră (RON)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-20"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20])}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Zones */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Zone
                </Label>
                <div className="space-y-2">
                  {mockZones.map((zone) => (
                    <div key={zone.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`zone-${zone.id}`}
                        checked={selectedZones.includes(zone.name)}
                        onCheckedChange={(checked) => 
                          handleZoneChange(zone.name, checked as boolean)
                        }
                      />
                      <Label htmlFor={`zone-${zone.id}`} className="text-sm text-gray-600">
                        {zone.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streets */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Străzi
                </Label>
                <div className="space-y-2">
                  {mockStreets.map((street) => (
                    <div key={street.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`street-${street.id}`}
                        checked={selectedStreets.includes(street.name)}
                        onCheckedChange={(checked) => 
                          handleStreetChange(street.name, checked as boolean)
                        }
                      />
                      <Label htmlFor={`street-${street.id}`} className="text-sm text-gray-600">
                        {street.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Șterge filtrele
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Map */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Toggle Filters Button */}
        {!isFilterOpen && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="absolute top-4 left-4 z-10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtre
          </Button>
        )}

        {/* Legend */}
        <Card className="absolute top-4 right-4 z-10 w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Legendă</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Loc liber ({getStatusCount('free')})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">Ocupat ({getStatusCount('occupied')})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">Temporar indisponibil ({getStatusCount('temporary')})</span>
            </div>
          </CardContent>
        </Card>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Total parcări: {parkingLocations.length}
                  </span>
                  <span className="text-green-600">
                    Libere: {parkingLocations.reduce((sum, p) => sum + p.freeSpaces, 0)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Actualizat: Acum 1 minut
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 