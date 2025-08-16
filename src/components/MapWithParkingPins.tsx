'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Zap, Clock, DollarSign, Star, Heart, Car } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';
import { googleMapsLoader as loader } from '@/lib/googleMapsLoader';
import { getApiConfig } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { registerAndSubscribePush } from '@/lib/pushClient';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  availability: 'available' | 'reserved' | 'occupied';
  type: 'street' | 'garage' | 'lot';
  distance: string;
}

interface MapWithParkingPinsProps {
  searchQuery: string;
  filters: {
    priceRange: [number, number];
    availability: string;
    type: string;
  };
}

// Google Maps types are defined in ParkingMap.tsx



const MapWithParkingPins: React.FC<MapWithParkingPinsProps> = ({
  searchQuery,
  filters
}) => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const directionsRendererRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);

  const { user } = useAuth?.() || { user: null } as any;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleEnableAlerts = async () => {
    const publicKey = (getApiConfig('PUSH_NOTIFICATIONS') as { VAPID_PUBLIC_KEY: string }).VAPID_PUBLIC_KEY;
    if (!user?.id) {
      alert('Trebuie să fii autentificat pentru a primi notificări.');
      return;
    }
    const ok = await registerAndSubscribePush(user.id, publicKey);
    if (ok) {
      // Save simple preference placeholder via Supabase if desired
      console.log('Push subscription saved');
    } else {
      console.log('Push subscription failed or denied');
    }
  };

  const handleGetDirections = () => {
    if (!selectedSpot || !mapInstanceRef.current) return;
    
    setIsLoadingDirections(true);
    
    // Try to get user's actual location, fallback to center of Bucharest
    const getUserLocation = (callback: (location: { lat: number; lng: number }) => void) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            callback({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log('Geolocation error:', error);
            // Fallback to center of Bucharest
            callback({ lat: 44.4268, lng: 26.1025 });
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        // Fallback to center of Bucharest
        callback({ lat: 44.4268, lng: 26.1025 });
      }
    };
    
        getUserLocation((userLocation) => {
      // Create a simple route visualization using a polyline
      const routePath = [
        { lat: userLocation.lat, lng: userLocation.lng },
        { lat: selectedSpot.lat, lng: selectedSpot.lng }
      ];
      
      // Create a polyline for the route
      const routePolyline = new window.google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstanceRef.current
      });
      
      // Store the polyline reference to remove it later
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
      directionsRendererRef.current = routePolyline;
      
      // Create markers for start and end points
      const startMarker = new window.google.maps.Marker({
        position: userLocation,
        map: mapInstanceRef.current,
        title: 'Pornire',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      });
      
      const endMarker = new window.google.maps.Marker({
        position: { lat: selectedSpot.lat, lng: selectedSpot.lng },
        map: mapInstanceRef.current,
        title: selectedSpot.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      });
      
      // Store markers to remove them later
      if (!markersRef.current) markersRef.current = [];
      markersRef.current.push(startMarker, endMarker);
      
      // Calculate bounds to center the map
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(userLocation);
      bounds.extend({ lat: selectedSpot.lat, lng: selectedSpot.lng });
      
      // Center and zoom the map
      mapInstanceRef.current.fitBounds(bounds);
      mapInstanceRef.current.setZoom(Math.min(mapInstanceRef.current.getZoom(), 15));
      
      // Add some padding to the bounds
      const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
        window.google.maps.event.removeListener(listener);
        const currentBounds = mapInstanceRef.current.getBounds();
        if (currentBounds) {
          currentBounds.extend(userLocation);
          currentBounds.extend({ lat: selectedSpot.lat, lng: selectedSpot.lng });
          mapInstanceRef.current.fitBounds(currentBounds);
        }
      });
      
      // Calculate and display distance
      const distance = calculateDistance(userLocation, { lat: selectedSpot.lat, lng: selectedSpot.lng });
      
      setIsLoadingDirections(false);
      setDirections({ route: true, distance }); // Include distance in the directions state
    });
  };

  // Helper function to calculate distance between two points (Haversine formula)
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): string => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    } else {
      return `${distance.toFixed(1)} km`;
    }
  };

  const clearDirections = () => {
    // Remove the route polyline
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    
    // Remove the route markers
    if (markersRef.current) {
      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current = [];
    }
    
    setDirections(null);
  };

  // Parcări din București - 30 de locații distribuite uniform
  const parkingSpots: ParkingSpot[] = [{
    id: '1',
    name: 'Parcare Piața Victoriei',
    address: 'Piața Victoriei nr. 1, București',
    lat: 44.4518,
    lng: 26.0853,
    price: 8,
    rating: 4.2,
    availability: 'available',
    type: 'garage',
    distance: '0.3 km'
  }, {
    id: '2',
    name: 'Parcare Herastrau',
    address: 'Șoseaua Nordului nr. 7-9, București',
    lat: 44.4769,
    lng: 26.0822,
    price: 5,
    rating: 4.5,
    availability: 'available',
    type: 'street',
    distance: '0.8 km'
  }, {
    id: '3',
    name: 'Garaj Centrul Vechi',
    address: 'Strada Lipscani nr. 15, București',
    lat: 44.4307,
    lng: 26.1014,
    price: 12,
    rating: 4.0,
    availability: 'reserved',
    type: 'garage',
    distance: '1.2 km'
  }, {
    id: '4',
    name: 'Parcare Universitate',
    address: 'Bulevardul Regina Elisabeta nr. 4-12, București',
    lat: 44.4355,
    lng: 26.1027,
    price: 6,
    rating: 3.8,
    availability: 'available',
    type: 'street',
    distance: '1.5 km'
  }, {
    id: '5',
    name: 'Parcare Romana',
    address: 'Piața Romană nr. 6, București',
    lat: 44.4506,
    lng: 26.0969,
    price: 10,
    rating: 4.3,
    availability: 'available',
    type: 'garage',
    distance: '0.9 km'
  }, {
    id: '6',
    name: 'Parcare Amzei',
    address: 'Bulevardul Magheru nr. 28-30, București',
    lat: 44.4472,
    lng: 26.0914,
    price: 4,
    rating: 3.9,
    availability: 'occupied',
    type: 'street',
    distance: '1.1 km'
  }, {
    id: '7',
    name: 'Parcare Unirii',
    address: 'Piața Unirii nr. 1, București',
    lat: 44.4267,
    lng: 26.1025,
    price: 9,
    rating: 4.1,
    availability: 'available',
    type: 'lot',
    distance: '0.7 km'
  }, {
    id: '8',
    name: 'Garaj Cismigiu',
    address: 'Bulevardul Regina Elisabeta nr. 38, București',
    lat: 44.4364,
    lng: 26.0936,
    price: 11,
    rating: 4.4,
    availability: 'available',
    type: 'garage',
    distance: '0.6 km'
  }, {
    id: '9',
    name: 'Parcare Obor',
    address: 'Calea Obor nr. 10, București',
    lat: 44.4513,
    lng: 26.1264,
    price: 7,
    rating: 4.0,
    availability: 'reserved',
    type: 'street',
    distance: '0.5 km'
  }, {
    id: '10',
    name: 'Parcare Floreasca',
    address: 'Șoseaua Floreasca nr. 169A, București',
    lat: 44.4847,
    lng: 26.1025,
    price: 8,
    rating: 4.2,
    availability: 'available',
    type: 'garage',
    distance: '0.4 km'
  }, {
    id: '11',
    name: 'Parcare Vitan',
    address: 'Calea Vitan nr. 55-59, București',
    lat: 44.4086,
    lng: 26.1264,
    price: 5,
    rating: 3.7,
    availability: 'available',
    type: 'street',
    distance: '1.3 km'
  }, {
    id: '12',
    name: 'Garaj Aviatorilor',
    address: 'Bulevardul Aviatorilor nr. 40, București',
    lat: 44.4675,
    lng: 26.0822,
    price: 14,
    rating: 4.6,
    availability: 'available',
    type: 'garage',
    distance: '1.0 km'
  }, {
    id: '13',
    name: 'Parcare Dristor',
    address: 'Calea Dudești nr. 121, București',
    lat: 44.4086,
    lng: 26.1503,
    price: 6,
    rating: 3.5,
    availability: 'occupied',
    type: 'lot',
    distance: '1.2 km'
  }, {
    id: '14',
    name: 'Parcare Calea Victoriei',
    address: 'Calea Victoriei nr. 120, București',
    lat: 44.4364,
    lng: 26.0969,
    price: 7,
    rating: 3.8,
    availability: 'available',
    type: 'street',
    distance: '1.1 km'
  }, {
    id: '15',
    name: 'Garaj Dorobanti',
    address: 'Calea Dorobanți nr. 239, București',
    lat: 44.4675,
    lng: 26.1025,
    price: 9,
    rating: 4.1,
    availability: 'available',
    type: 'garage',
    distance: '1.0 km'
  }, {
    id: '16',
    name: 'Parcare Titan',
    address: 'Bulevardul Iuliu Maniu nr. 59, București',
    lat: 44.4513,
    lng: 26.1264,
    price: 8,
    rating: 4.0,
    availability: 'available',
    type: 'street',
    distance: '0.8 km'
  }, {
    id: '17',
    name: 'Garaj Militari',
    address: 'Bulevardul Militari nr. 160, București',
    lat: 44.4675,
    lng: 26.0469,
    price: 10,
    rating: 4.3,
    availability: 'available',
    type: 'garage',
    distance: '0.9 km'
  }, {
    id: '18',
    name: 'Parcare Berceni',
    address: 'Calea Berceni nr. 45, București',
    lat: 44.4086,
    lng: 26.1503,
    price: 6,
    rating: 3.6,
    availability: 'reserved',
    type: 'lot',
    distance: '1.1 km'
  }, {
    id: '19',
    name: 'Parcare Pantelimon',
    address: 'Șoseaua Pantelimon nr. 60, București',
    lat: 44.4513,
    lng: 26.1503,
    price: 7,
    rating: 3.9,
    availability: 'available',
    type: 'street',
    distance: '0.7 km'
  }, {
    id: '20',
    name: 'Garaj Colentina',
    address: 'Bulevardul Colentina nr. 15, București',
    lat: 44.4847,
    lng: 26.1264,
    price: 9,
    rating: 4.2,
    availability: 'available',
    type: 'garage',
    distance: '0.6 km'
  }, {
    id: '21',
    name: 'Parcare Stefan cel Mare',
    address: 'Bulevardul Ștefan cel Mare nr. 25, București',
    lat: 44.4513,
    lng: 26.0914,
    price: 8,
    rating: 4.1,
    availability: 'available',
    type: 'street',
    distance: '0.5 km'
  }, {
    id: '22',
    name: 'Parcare Basarab',
    address: 'Piața Basarab nr. 1, București',
    lat: 44.4267,
    lng: 26.0736,
    price: 11,
    rating: 4.4,
    availability: 'occupied',
    type: 'lot',
    distance: '0.8 km'
  }, {
    id: '23',
    name: 'Garaj Gara de Nord',
    address: 'Piața Gara de Nord nr. 1, București',
    lat: 44.4364,
    lng: 26.0736,
    price: 12,
    rating: 4.0,
    availability: 'available',
    type: 'garage',
    distance: '0.4 km'
  }, {
    id: '24',
    name: 'Parcare Piata Sudului',
    address: 'Piața Sudului nr. 1, București',
    lat: 44.4086,
    lng: 26.1264,
    price: 7,
    rating: 3.8,
    availability: 'available',
    type: 'street',
    distance: '0.9 km'
  }, {
    id: '25',
    name: 'Parcare Drumul Taberei',
    address: 'Bulevardul Timișoara nr. 26, București',
    lat: 44.4086,
    lng: 26.0469,
    price: 10,
    rating: 3.8,
    availability: 'available',
    type: 'lot',
    distance: '0.4 km'
  }, {
    id: '26',
    name: 'Parcare Tei',
    address: 'Bulevardul Ion Mihalache nr. 61, București',
    lat: 44.4847,
    lng: 26.0969,
    price: 9,
    rating: 4.1,
    availability: 'occupied',
    type: 'street',
    distance: '0.3 km'
  }, {
    id: '27',
    name: 'Garaj Muncii',
    address: 'Bulevardul Muncii nr. 12, București',
    lat: 44.4086,
    lng: 26.0914,
    price: 11,
    rating: 4.2,
    availability: 'available',
    type: 'garage',
    distance: '0.6 km'
  }, {
    id: '28',
    name: 'Parcare Iancului',
    address: 'Piața Iancului nr. 15, București',
    lat: 44.4267,
    lng: 26.1264,
    price: 8,
    rating: 3.9,
    availability: 'available',
    type: 'street',
    distance: '0.5 km'
  }, {
    id: '29',
    name: 'Parcare Mosilor',
    address: 'Calea Moșilor nr. 128, București',
    lat: 44.4364,
    lng: 26.1264,
    price: 7,
    rating: 3.7,
    availability: 'reserved',
    type: 'lot',
    distance: '0.7 km'
  }, {
    id: '30',
    name: 'Garaj Eroilor',
    address: 'Piața Eroilor nr. 1, București',
    lat: 44.4267,
    lng: 26.0736,
    price: 10,
    rating: 4.0,
    availability: 'available',
    type: 'garage',
    distance: '0.4 km'
  }];

  // Filter spots based on search and filters
  const filteredSpots = parkingSpots.filter(spot => {
    const matchesSearch = searchQuery ? 
      (spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || spot.address.toLowerCase().includes(searchQuery.toLowerCase())) : 
      true;
    
    const matchesPrice = filters?.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2 ?
      (spot.price >= filters.priceRange[0] && spot.price <= filters.priceRange[1]) : 
      true;
    
    const matchesAvailability = filters?.availability && filters.availability !== 'all' ? 
      spot.availability === filters.availability : 
      true;
    
    const matchesType = filters?.type && filters.type !== 'all' ? 
      spot.type === filters.type : 
      true;
    
    return matchesSearch && matchesPrice && matchesAvailability && matchesType;
  });

  // Get available spots for bottom section
  const availableSpots = filteredSpots.filter(spot => spot.availability === 'available').slice(0, 6);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'text-green-600';
      case 'reserved':
        return 'text-yellow-600';
      case 'occupied':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAvailabilityBg = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 border-green-300';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-300';
      case 'occupied':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const toggleFavorite = (spotId: string) => {
    // This function is now handled by the context
    console.log('Toggle favorite for spot:', spotId);
  };

  const handleAddToFavorites = async (spot: ParkingSpot | null) => {
    if (!spot || !user) {
      if (!user) {
        alert('Trebuie să fii autentificat pentru a adăuga favorite!');
      }
      return;
    }
    
    // Check current favorite status
    const isCurrentlyFavorite = isFavorite(spot.id);
    
    try {
      if (!isCurrentlyFavorite) {
        // Add to favorites using context
        const result = await addToFavorites({
          parking_spot_id: spot.id,
          parking_name: spot.name,
          parking_address: spot.address,
          parking_type: spot.type,
          price: spot.price,
          rating: spot.rating
        });

        if (result.success) {
          console.log(`Parcarea "${spot.name}" a fost adăugată la favorite în baza de date!`);
          alert(`✅ Parcarea "${spot.name}" a fost adăugată la favorite și la secțiunea "Parcările mele"!`);
        } else {
          console.error('Error adding to favorites:', result.error);
          alert(`❌ Eroare la adăugarea în favorite: ${result.error}`);
        }
      } else {
        // Remove from favorites using context
        const result = await removeFromFavorites(spot.id);

        if (result.success) {
          console.log(`Parcarea "${spot.name}" a fost eliminată din favorite!`);
          alert(`🗑️ Parcarea "${spot.name}" a fost eliminată din favorite!`);
        } else {
          console.error('Error removing from favorites:', result.error);
          alert(`❌ Eroare la eliminarea din favorite: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error in handleAddToFavorites:', error);
      alert('❌ Eroare neașteptată la gestionarea favoritelor!');
    }
  };

  const handleSpotSelection = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    // Clear any existing directions when selecting a new spot
    clearDirections();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'garage':
        return <Car size={16} className="text-blue-600" />;
      case 'street':
        return <MapPin size={16} className="text-green-600" />;
      case 'lot':
        return <Car size={16} className="text-purple-600" />;
      default:
        return <MapPin size={16} className="text-gray-600" />;
    }
  };

  // Load Google Maps API
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapError('Google Maps API key is missing');
      return;
    }

    const loadAndInit = async () => {
      try {
        // If already available, just init
        if (window.google && window.google.maps) {
          initializeMap();
          return;
        }
        await loader.load();
        setMapLoaded(true);
        initializeMap();
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('Failed to load Google Maps API:', msg);
        setMapError('Failed to load Google Maps API');
      }
    };

    loadAndInit();
  }, []);

  // Initialize map when API is loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [mapLoaded]);

  // Update markers when filtered spots change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [filteredSpots]);

  const initializeMap = async () => {
    if (!mapRef.current || !(window as any).google) return;

    // @ts-ignore - importLibrary available at runtime
    const { Map } = await (window as any).google.maps.importLibrary('maps');

    const bucharest = { lat: 44.4268, lng: 26.1025 };

    const map = new Map(mapRef.current, {
      center: bucharest,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;
    updateMarkers();
  };

  const updateMarkers = async () => {
    if (!mapInstanceRef.current) return;

    // @ts-ignore - importLibrary available at runtime
    const { Marker } = await (window as any).google.maps.importLibrary('marker');

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    filteredSpots.forEach(spot => {
      const marker = new Marker({
        position: { lat: spot.lat, lng: spot.lng },
        map: mapInstanceRef.current,
        title: spot.name,
        icon: {
          url: getMarkerIcon(spot.availability),
          // @ts-ignore - Size and Point are in advanced libs but OK at runtime
          scaledSize: new (window as any).google.maps.Size(32, 32),
          anchor: new (window as any).google.maps.Point(16, 32)
        }
      });

      marker.addListener('click', () => {
        setSelectedSpot(spot);
      });

      markersRef.current.push(marker);
    });
  };

  const getMarkerIcon = (availability: string) => {
    // Create SVG data URLs for different availability states
    const colors: Record<string, string> = {
      available: '#10B981',
      reserved: '#F59E0B',
      occupied: '#EF4444'
    };

    const color = colors[availability] || '#6B7280';
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M16 8l-4 8h8l-4-8z" fill="white"/>
      </svg>
    `)}`;
  };

  if (mapError) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[50vh] lg:h-[70%] min-h-[300px] flex items-center justify-center bg-muted/20">
          <div className="text-center p-6 bg-card border border-border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-2">Eroare Hartă</h3>
            <p className="text-muted-foreground mb-4">{mapError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reîncarcă
            </button>
          </div>
        </div>
        
        {/* Parcări Disponibile Section */}
        <div className="h-[50vh] lg:h-[30%] bg-card border-t border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Parcări Disponibile</h3>
            <span className="text-sm text-muted-foreground">{availableSpots.length} locuri</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto h-full">
            {availableSpots.map((spot) => (
              <div 
                key={spot.id} 
                className="bg-background border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSpotSelection(spot)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(spot.type)}
                    <span className="text-xs text-muted-foreground">{spot.type}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(spot.id);
                    }}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                                      <Heart 
                    size={16} 
                    className={isFavorite(spot.id) ? 'fill-red-500 text-red-500' : ''} 
                  />
                  </button>
                </div>
                
                <h4 className="font-medium text-sm text-foreground mb-1 truncate">{spot.name}</h4>
                <p className="text-xs text-muted-foreground mb-2 truncate">{spot.address}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} className="text-green-600" />
                    <span className="text-sm font-medium">{spot.price} RON</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500" />
                    <span className="text-xs">{spot.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{spot.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Section - Reduced by 30% */}
      <div className="relative bg-muted/20 overflow-hidden h-[50vh] lg:h-[70%] min-h-[300px]">
        {/* Google Maps Container */}
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow" onClick={handleEnableAlerts}>
            Activează alerte
          </button>
          <button className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Navigation size={20} className="text-foreground" />
          </button>
          <button className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Zap size={20} className="text-foreground" />
          </button>
        </div>

        {/* Selected Spot Popup */}
        {selectedSpot && (
          <div className="absolute bottom-4 left-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 z-30 max-w-sm mx-auto">
            {isLoadingDirections && (
              <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Se calculează ruta...</p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{selectedSpot.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedSpot.address}</p>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="text-muted-foreground hover:text-foreground" aria-label="Închide popup">
                ×
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <DollarSign size={16} className="text-green-600" />
                <span className="font-medium">{selectedSpot.price} RON/oră</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500" />
                <span>{selectedSpot.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm">{selectedSpot.distance}</span>
              </div>
            </div>
            
            {/* Parking Spot Availability Counter */}
            <div className="flex items-center justify-between mb-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-xs font-medium">Disponibil</span>
                  <span className="text-sm font-bold text-green-600">
                    {filteredSpots.filter(spot => spot.availability === 'available').length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                  <span className="text-xs font-medium">Rezervat</span>
                  <span className="text-sm font-bold text-yellow-600">
                    {filteredSpots.filter(spot => spot.availability === 'reserved').length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-xs font-medium">Ocupat</span>
                  <span className="text-sm font-bold text-red-600">
                    {filteredSpots.filter(spot => spot.availability === 'occupied').length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleAddToFavorites(selectedSpot)}
                className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isFavorite(selectedSpot.id) ? 'Elimină din Favorite' : 'Adaugă la Favorite'}
              </button>
              {!directions ? (
                <button 
                  onClick={handleGetDirections}
                  disabled={isLoadingDirections}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingDirections ? 'Se calculează...' : 'Direcții'}
                </button>
              ) : (
                <button 
                  onClick={clearDirections}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Șterge Ruta
                </button>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card border border-border rounded-lg p-3 shadow-sm">
          <h4 className="text-sm font-medium mb-2">Legendă</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-xs">Disponibil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span className="text-xs">Rezervat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-xs">Ocupat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parcări Disponibile Section - Bottom 30% */}
      <div className="h-[50vh] lg:h-[30%] bg-card border-t border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Parcări Disponibile</h3>
          <span className="text-sm text-muted-foreground">{availableSpots.length} locuri</span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto h-full">
          {availableSpots.map((spot) => (
            <div 
              key={spot.id} 
              className="bg-background border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSpotSelection(spot)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(spot.type)}
                  <span className="text-xs text-muted-foreground">{spot.type}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle favorite toggle here if needed
                  }}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Heart 
                    size={16} 
                    className={isFavorite(spot.id) ? 'fill-red-500 text-red-500' : ''} 
                  />
                </button>
              </div>
              
              <h4 className="font-medium text-sm text-foreground mb-1 truncate">{spot.name}</h4>
              <p className="text-xs text-muted-foreground mb-2 truncate">{spot.address}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign size={12} className="text-green-600" />
                  <span className="text-sm font-medium">{spot.price} RON</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" />
                  <span className="text-xs">{spot.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mt-1">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{spot.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapWithParkingPins;