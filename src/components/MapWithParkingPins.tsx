'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Zap, Clock, DollarSign, Star, Heart, Car } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';
import { googleMapsLoader as loader } from '@/lib/googleMapsLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ParkingSpotService } from '@/lib/parkingSpotService';
import { ParkingService } from '@/lib/parkingService';

interface ParkingLocationWithStats {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  total_spots: number;
  available_spots: number;
  reserved_spots: number;
  occupied_spots: number;
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
  const [selectedSpot, setSelectedSpot] = useState<ParkingLocationWithStats | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [parkingLocations, setParkingLocations] = useState<ParkingLocationWithStats[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const directionsRendererRef = useRef<any>(null);

  const { user } = useAuth?.() || { user: null } as any;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    console.log('🚀 MapWithParkingPins component mounted');
    
    // Add global debug function for testing
    (window as any).debugGoogleMaps = () => {
      console.log('🔍 Debug Google Maps API:');
      console.log('📍 window.google:', window.google);
      console.log('📍 window.google.maps:', window.google?.maps);
      console.log('📍 window.google.maps.Map:', window.google?.maps?.Map);
      console.log('📍 window.google.maps.Marker:', window.google?.maps?.Marker);
      console.log('📍 mapRef.current:', mapRef.current);
      console.log('📍 mapInstanceRef.current:', mapInstanceRef.current);
      console.log('📍 parkingLocations:', parkingLocations);
    };
    
    // Add function to check database parking locations
    (window as any).checkDatabaseParkings = async () => {
      console.log('🔍 Checking database parking locations...');
      try {
        const result = await ParkingService.getAllParkingLocations();
        if (result.success && result.data) {
          console.log('✅ Database parking locations:', result.data);
          console.log('📍 Total locations:', result.data.length);
          result.data.forEach((location, index) => {
            console.log(`📍 Location ${index + 1}:`, {
              id: location.id,
              name: location.name,
              address: location.address,
              city: location.city,
              district: location.district,
              coordinates: location.latitude && location.longitude ? 
                `${location.latitude}, ${location.longitude}` : 'Missing coordinates'
            });
          });
        } else {
          console.log('❌ No database parking locations found');
        }
      } catch (error) {
        console.error('❌ Error checking database:', error);
      }
    };
    
    return () => {
      setIsMounted(false);
      console.log('🔌 MapWithParkingPins component unmounting');
      delete (window as any).debugGoogleMaps;
      delete (window as any).checkDatabaseParkings;
    };
  }, []);


  // Funcție pentru încărcarea datelor de parcare din baza de date
  const loadParkingData = async () => {
    try {
      console.log('📊 Loading parking data from database...');
      
      // Încearcă să obțin datele din baza de date
      const result = await ParkingService.getAllParkingLocations();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Found parking locations in database:', result.data.length);
        
        // Convertește datele din baza de date la formatul necesar
        const dbParkingLocations = result.data.map(location => ({
          id: location.id,
          name: location.name,
          address: location.address,
          latitude: location.latitude || 44.4268, // Fallback la București dacă nu sunt coordonatele
          longitude: location.longitude || 26.1025,
          total_spots: location.total_spots || 10,
          available_spots: location.available_spots || 5,
          reserved_spots: 2, // Valori implicite pentru moment
          occupied_spots: 3
        }));
        
        console.log('📍 Database parking locations:', dbParkingLocations);
        setParkingLocations(dbParkingLocations);
        
        // If map is already loaded, update markers
        if (mapInstanceRef.current) {
          console.log('🔄 Map already loaded, updating markers...');
          updateMarkers();
        }
      } else {
        console.log('⚠️ No parking locations in database, using fallback data');
        console.log('📍 Fallback parkingSpots data:', parkingSpots);
        
        if (!parkingSpots || parkingSpots.length === 0) {
          console.warn('⚠️ No fallback parking spots data available');
          setParkingLocations([]);
          return;
        }
        
        // Validate parking spots data
        const validSpots = parkingSpots.filter(spot => {
          const isValid = spot && 
            typeof spot.latitude === 'number' && 
            typeof spot.longitude === 'number' &&
            !isNaN(spot.latitude) && 
            !isNaN(spot.longitude);
          
          if (!isValid) {
            console.warn('⚠️ Invalid parking spot data:', spot);
          }
          
          return isValid;
        });
        
        console.log('✅ Valid fallback parking spots:', validSpots.length);
        setParkingLocations(validSpots);
        
        // If map is already loaded, update markers
        if (mapInstanceRef.current) {
          console.log('🔄 Map already loaded, updating markers...');
          updateMarkers();
        }
      }
    } catch (error) {
      console.error('❌ Error in loadParkingData:', error);
      console.log('🔄 Falling back to static data...');
      
      // Fallback la datele statice în caz de eroare
      if (parkingSpots && parkingSpots.length > 0) {
        setParkingLocations(parkingSpots);
      } else {
        setParkingLocations([]);
      }
    }
  };

  // Funcție pentru raportarea unui loc liber
  const handleReportFreeSpot = async (parkingLocationId: string, spotNumber: string) => {
    if (!user?.id) {
      alert('Trebuie să fii autentificat pentru a raporta un loc liber.');
      return;
    }

    try {
      const result = await ParkingSpotService.reportFreeParkingSpot(
        parkingLocationId,
        spotNumber,
        user.id,
        'Raportat de utilizator'
      );

      if (result.success) {
        // Reîncarcă datele pentru a actualiza statisticile
        await loadParkingData();
        alert('Loc liber raportat cu succes!');
      } else {
        alert(`Eroare la raportarea locului: ${result.error}`);
      }
    } catch (error) {
      console.error('Error reporting free spot:', error);
      alert('Eroare la raportarea locului liber.');
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
        { lat: selectedSpot.latitude, lng: selectedSpot.longitude }
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
      const startMarker = new (window as any).google.maps.Marker({
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
      
      const endMarker = new (window as any).google.maps.Marker({
        position: { lat: selectedSpot.latitude, lng: selectedSpot.longitude },
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
      bounds.extend({ lat: selectedSpot.latitude, lng: selectedSpot.longitude });
      
      // Center and zoom the map
      mapInstanceRef.current.fitBounds(bounds);
      mapInstanceRef.current.setZoom(Math.min(mapInstanceRef.current.getZoom(), 15));
      
      // Add some padding to the bounds
      const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
        window.google.maps.event.removeListener(listener);
        const currentBounds = mapInstanceRef.current.getBounds();
        if (currentBounds) {
          currentBounds.extend(userLocation);
          currentBounds.extend({ lat: selectedSpot.latitude, lng: selectedSpot.longitude });
          mapInstanceRef.current.fitBounds(currentBounds);
        }
      });
      
      // Calculate and display distance
      const distance = calculateDistance(userLocation, { lat: selectedSpot.latitude, lng: selectedSpot.longitude });
      
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
  const parkingSpots: ParkingLocationWithStats[] = [{
    id: '1',
    name: 'Parcare 1',
    address: 'Strada 1, București',
    latitude: 44.4268,
    longitude: 26.1025,
    total_spots: 10,
    available_spots: 5,
    reserved_spots: 2,
    occupied_spots: 3
  }, {
    id: '2',
    name: 'Parcare 2',
    address: 'Strada 2, București',
    latitude: 44.4300,
    longitude: 26.1100,
    total_spots: 15,
    available_spots: 8,
    reserved_spots: 3,
    occupied_spots: 4
  }, {
    id: '3',
    name: 'Parcare 3',
    address: 'Strada 3, București',
    latitude: 44.4200,
    longitude: 26.1200,
    total_spots: 20,
    available_spots: 12,
    reserved_spots: 5,
    occupied_spots: 3
  }, {
    id: '4',
    name: 'Parcare 4',
    address: 'Strada 4, București',
    latitude: 44.4250,
    longitude: 26.1300,
    total_spots: 10,
    available_spots: 7,
    reserved_spots: 2,
    occupied_spots: 1
  }, {
    id: '5',
    name: 'Parcare 5',
    address: 'Strada 5, București',
    latitude: 44.4270,
    longitude: 26.1400,
    total_spots: 15,
    available_spots: 10,
    reserved_spots: 3,
    occupied_spots: 2
  }, {
    id: '6',
    name: 'Parcare 6',
    address: 'Strada 6, București',
    latitude: 44.4280,
    longitude: 26.1500,
    total_spots: 20,
    available_spots: 15,
    reserved_spots: 4,
    occupied_spots: 1
  }, {
    id: '7',
    name: 'Parcare 7',
    address: 'Strada 7, București',
    latitude: 44.4290,
    longitude: 26.1600,
    total_spots: 10,
    available_spots: 6,
    reserved_spots: 2,
    occupied_spots: 2
  }, {
    id: '8',
    name: 'Parcare 8',
    address: 'Strada 8, București',
    latitude: 44.4300,
    longitude: 26.1700,
    total_spots: 15,
    available_spots: 9,
    reserved_spots: 3,
    occupied_spots: 3
  }, {
    id: '9',
    name: 'Parcare 9',
    address: 'Strada 9, București',
    latitude: 44.4310,
    longitude: 26.1800,
    total_spots: 20,
    available_spots: 13,
    reserved_spots: 5,
    occupied_spots: 2
  }, {
    id: '10',
    name: 'Parcare 10',
    address: 'Strada 10, București',
    latitude: 44.4320,
    longitude: 26.1900,
    total_spots: 10,
    available_spots: 7,
    reserved_spots: 2,
    occupied_spots: 1
  }, {
    id: '11',
    name: 'Parcare 11',
    address: 'Strada 11, București',
    latitude: 44.4330,
    longitude: 26.2000,
    total_spots: 15,
    available_spots: 10,
    reserved_spots: 3,
    occupied_spots: 2
  }, {
    id: '12',
    name: 'Parcare 12',
    address: 'Strada 12, București',
    latitude: 44.4340,
    longitude: 26.2100,
    total_spots: 20,
    available_spots: 15,
    reserved_spots: 4,
    occupied_spots: 1
  }, {
    id: '13',
    name: 'Parcare 13',
    address: 'Strada 13, București',
    latitude: 44.4350,
    longitude: 26.2200,
    total_spots: 10,
    available_spots: 6,
    reserved_spots: 2,
    occupied_spots: 2
  }, {
    id: '14',
    name: 'Parcare 14',
    address: 'Strada 14, București',
    latitude: 44.4360,
    longitude: 26.2300,
    total_spots: 15,
    available_spots: 9,
    reserved_spots: 3,
    occupied_spots: 3
  }, {
    id: '15',
    name: 'Parcare 15',
    address: 'Strada 15, București',
    latitude: 44.4370,
    longitude: 26.2400,
    total_spots: 20,
    available_spots: 13,
    reserved_spots: 5,
    occupied_spots: 2
  }, {
    id: '16',
    name: 'Parcare 16',
    address: 'Strada 16, București',
    latitude: 44.4380,
    longitude: 26.2500,
    total_spots: 10,
    available_spots: 7,
    reserved_spots: 2,
    occupied_spots: 1
  }, {
    id: '17',
    name: 'Parcare 17',
    address: 'Strada 17, București',
    latitude: 44.4390,
    longitude: 26.2600,
    total_spots: 15,
    available_spots: 10,
    reserved_spots: 3,
    occupied_spots: 2
  }, {
    id: '18',
    name: 'Parcare 18',
    address: 'Strada 18, București',
    latitude: 44.4400,
    longitude: 26.2700,
    total_spots: 20,
    available_spots: 15,
    reserved_spots: 4,
    occupied_spots: 1
  }, {
    id: '19',
    name: 'Parcare 19',
    address: 'Strada 19, București',
    latitude: 44.4410,
    longitude: 26.2800,
    total_spots: 10,
    available_spots: 6,
    reserved_spots: 2,
    occupied_spots: 2
  }, {
    id: '20',
    name: 'Parcare 20',
    address: 'Strada 20, București',
    latitude: 44.4420,
    longitude: 26.2900,
    total_spots: 15,
    available_spots: 9,
    reserved_spots: 3,
    occupied_spots: 3
  }, {
    id: '21',
    name: 'Parcare 21',
    address: 'Strada 21, București',
    latitude: 44.4430,
    longitude: 26.3000,
    total_spots: 20,
    available_spots: 13,
    reserved_spots: 5,
    occupied_spots: 2
  }, {
    id: '22',
    name: 'Parcare 22',
    address: 'Strada 22, București',
    latitude: 44.4440,
    longitude: 26.3100,
    total_spots: 10,
    available_spots: 7,
    reserved_spots: 2,
    occupied_spots: 1
  }, {
    id: '23',
    name: 'Parcare 23',
    address: 'Strada 23, București',
    latitude: 44.4450,
    longitude: 26.3200,
    total_spots: 15,
    available_spots: 10,
    reserved_spots: 3,
    occupied_spots: 2
  }, {
    id: '24',
    name: 'Parcare 24',
    address: 'Strada 24, București',
    latitude: 44.4460,
    longitude: 26.3300,
    total_spots: 20,
    available_spots: 15,
    reserved_spots: 4,
    occupied_spots: 1
  }, {
    id: '25',
    name: 'Parcare 25',
    address: 'Strada 25, București',
    latitude: 44.4470,
    longitude: 26.3400,
    total_spots: 10,
    available_spots: 6,
    reserved_spots: 2,
    occupied_spots: 2
  }, {
    id: '26',
    name: 'Parcare 26',
    address: 'Strada 26, București',
    latitude: 44.4480,
    longitude: 26.3500,
    total_spots: 15,
    available_spots: 9,
    reserved_spots: 3,
    occupied_spots: 3
  }, {
    id: '27',
    name: 'Parcare 27',
    address: 'Strada 27, București',
    latitude: 44.4490,
    longitude: 26.3600,
    total_spots: 20,
    available_spots: 13,
    reserved_spots: 5,
    occupied_spots: 2
  }, {
    id: '28',
    name: 'Parcare 28',
    address: 'Strada 28, București',
    latitude: 44.4500,
    longitude: 26.3700,
    total_spots: 10,
    available_spots: 7,
    reserved_spots: 2,
    occupied_spots: 1
  }, {
    id: '29',
    name: 'Parcare 29',
    address: 'Strada 29, București',
    latitude: 44.4510,
    longitude: 26.3800,
    total_spots: 15,
    available_spots: 10,
    reserved_spots: 3,
    occupied_spots: 2
  }, {
    id: '30',
    name: 'Parcare 30',
    address: 'Strada 30, București',
    latitude: 44.4520,
    longitude: 26.3900,
    total_spots: 20,
    available_spots: 15,
    reserved_spots: 4,
    occupied_spots: 1
  }];

  // Helper functions pentru proprietățile derivate
  const getAvailabilityStatus = (location: ParkingLocationWithStats) => {
    if (location.available_spots > 0) return 'available';
    if (location.reserved_spots > 0) return 'reserved';
    return 'occupied';
  };

  const getLocationType = (location: ParkingLocationWithStats) => {
    // Determină tipul locației bazat pe nume sau adresă
    if (location.name.toLowerCase().includes('garaj') || location.name.toLowerCase().includes('garage')) {
      return 'garage';
    } else if (location.name.toLowerCase().includes('parcare') || location.name.toLowerCase().includes('parking')) {
      return 'lot';
    } else {
      return 'street';
    }
  };

  const getLocationPrice = (location: ParkingLocationWithStats) => {
    // Preț implicit bazat pe tipul locației
    const type = getLocationType(location);
    switch (type) {
      case 'garage':
        return 12;
      case 'lot':
        return 8;
      default:
        return 6;
    }
  };

  const getLocationRating = (location: ParkingLocationWithStats) => {
    // Rating implicit bazat pe disponibilitate
    if (location.available_spots > location.total_spots * 0.5) {
      return 4.5;
    } else if (location.available_spots > 0) {
      return 4.0;
    } else {
      return 3.5;
    }
  };

  const getLocationAvailability = (location: ParkingLocationWithStats) => {
    return getAvailabilityStatus(location);
  };

  const getLocationDistance = (_location: ParkingLocationWithStats) => {
    // Distanță implicită (în km)
    return '0.5 km';
  };

  const getLocationPriceText = (location: ParkingLocationWithStats) => {
    return `${getLocationPrice(location)} RON/ora`;
  };

  const getLocationRatingText = (location: ParkingLocationWithStats) => {
    return `${getLocationRating(location)}/5`;
  };

  const getLocationTypeText = (location: ParkingLocationWithStats) => {
    const type = getLocationType(location);
    switch (type) {
      case 'garage':
        return 'Garaj';
      case 'lot':
        return 'Parcare';
      default:
        return 'Stradă';
    }
  };

  // Filtrează locurile de parcare în funcție de query și filtre
  const _filteredSpots = parkingLocations.filter(spot => {
    const matchesSearch = searchQuery ? 
      (spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || spot.address.toLowerCase().includes(searchQuery.toLowerCase())) : 
      true;
    
    const matchesAvailability = filters.availability === 'all' || 
      getLocationAvailability(spot) === filters.availability;
    
    const matchesType = filters.type === 'all' || 
      getLocationType(spot) === filters.type;
    
    const matchesPrice = getLocationPrice(spot) >= filters.priceRange[0] && 
      getLocationPrice(spot) <= filters.priceRange[1];
    
    return matchesSearch && matchesAvailability && matchesType && matchesPrice;
  });

  // Get available spots for bottom section
  const availableSpots = parkingLocations.filter(spot => getLocationAvailability(spot) === 'available').slice(0, 6);

  const toggleFavorite = (spotId: string) => {
    // This function is now handled by the context
    console.log('Toggle favorite for spot:', spotId);
  };

  const handleAddToFavorites = async (spot: ParkingLocationWithStats) => {
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
          parking_type: getLocationType(spot),
          price: getLocationPrice(spot),
          rating: getLocationRating(spot)
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

  const handleSpotSelection = (spot: ParkingLocationWithStats) => {
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
    if (!isMounted) return;
    
    if (!GOOGLE_MAPS_API_KEY) {
      setMapError('Google Maps API key is missing');
      return;
    }

    let isMountedInEffect = true;
    let isLoading = false;

    const loadAndInit = async () => {
      if (isLoading) {
        console.log('⚠️ Google Maps API loading already in progress, skipping...');
        return;
      }
      
      try {
        isLoading = true;
        const startTime = Date.now();
        console.log('🔄 Starting Google Maps API loading process...');
        console.log('🔧 Loader state:', {
          apiKey: GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Missing',
          loader: loader
        });
        
        // If already available, just init
        if (window.google && window.google.maps && window.google.maps.Map) {
          console.log('✅ Google Maps API already loaded, initializing map...');
          if (isMountedInEffect && isMounted) {
            initializeMap();
          }
          return;
        }
        
        console.log('🔄 Loading Google Maps API...');
        console.log('🔑 API Key:', GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');
        console.log('🌐 Network status:', navigator.onLine ? 'Online' : 'Offline');
        console.log('⏰ Start time:', new Date().toISOString());
        
        // Check if we can reach Google's servers
        try {
          const response = await fetch('https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY);
          console.log('🌐 Google Maps API endpoint test:', response.status, response.statusText);
        } catch (networkError) {
          console.warn('⚠️ Network test failed:', networkError);
        }
        
        try {
          await loader.load();
          const loadTime = Date.now() - startTime;
          console.log(`✅ Google Maps API loaded successfully in ${loadTime}ms`);
        } catch (loadError) {
          console.error('❌ Loader.load() failed:', loadError);
          throw loadError;
        }
        
        // Test if the API is actually accessible
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not accessible after loading');
        }
        
        console.log('🔍 Testing Google Maps API accessibility...');
        console.log('📍 window.google:', window.google);
        console.log('📍 window.google.maps:', window.google.maps);
        console.log('📍 window.google.maps.Map:', window.google.maps.Map);
        
        if (!window.google.maps.Map) {
          throw new Error('Google Maps Map constructor not available after loading');
        }
        
        // Try to create a simple test instance to verify the API works
        try {
          console.log('🧪 Testing Google Maps API with a simple test...');
          const testDiv = document.createElement('div');
          testDiv.style.display = 'none';
          testDiv.style.width = '100px';
          testDiv.style.height = '100px';
          document.body.appendChild(testDiv);
          
          console.log('🧪 Test div created:', testDiv);
          console.log('🧪 Google Maps Map constructor:', window.google.maps.Map);
          
          const testMap = new window.google.maps.Map(testDiv, {
            center: { lat: 0, lng: 0 },
            zoom: 1
          });
          
          console.log('✅ Test map created successfully:', testMap);
          console.log('🧪 Test map created with properties:', {
            center: { lat: 0, lng: 0 },
            zoom: 1
          });
          
          document.body.removeChild(testDiv);
          console.log('🧪 Test div removed');
          
          // Test marker creation as well
          try {
            console.log('🧪 Testing marker creation...');
            const testMarker = new window.google.maps.Marker({
              position: { lat: 0, lng: 0 },
              map: testMap,
              title: 'Test Marker'
            });
            console.log('✅ Test marker created successfully:', testMarker);
          } catch (markerTestError) {
            console.error('❌ Test marker creation failed:', markerTestError);
            throw new Error(`Google Maps Marker test failed: ${markerTestError instanceof Error ? markerTestError.message : String(markerTestError)}`);
          }
        } catch (testError) {
          console.error('❌ Test map creation failed:', testError);
          console.error('❌ Test error details:', {
            name: testError instanceof Error ? testError.name : 'Unknown',
            message: testError instanceof Error ? testError.message : String(testError),
            stack: testError instanceof Error ? testError.stack : 'No stack trace'
          });
          throw new Error(`Google Maps API test failed: ${testError instanceof Error ? testError.message : String(testError)}`);
        }
        
        // If we get here, the API is working, so initialize the map
        console.log('✅ Google Maps API verified and working, initializing map...');
        if (isMountedInEffect && isMounted) {
          setMapLoaded(true);
          initializeMap();
        }
        
      } catch (e) {
        if (!isMountedInEffect || !isMounted) return;
        
        const msg = e instanceof Error ? e.message : String(e);
        console.error('Failed to load Google Maps API:', msg);
        console.error('Full error object:', e);
        
        // Try to provide more specific error information
        if (msg.includes('network') || msg.includes('fetch')) {
          setMapError('Network error: Unable to reach Google Maps API. Please check your internet connection.');
        } else if (msg.includes('API key') || msg.includes('key')) {
          setMapError('API key error: Invalid or missing Google Maps API key. Please check your configuration.');
        } else if (msg.includes('quota') || msg.includes('limit')) {
          setMapError('API quota exceeded: Google Maps API usage limit reached. Please try again later.');
        } else {
          setMapError(`Failed to load Google Maps API: ${msg}`);
        }
      } finally {
        isLoading = false;
      }
    };

    loadAndInit();

    return () => {
      isMountedInEffect = false;
    };
  }, [isMounted]);

  // Initialize map when API is loaded
  useEffect(() => {
    if (!isMounted) return;
    
    if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
      console.log('🔄 Map loaded effect triggered, initializing map...');
      initializeMap();
    }
  }, [mapLoaded, isMounted]);

  // Update markers when parking locations change
  useEffect(() => {
    if (!isMounted) return;
    
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [parkingLocations, isMounted]);

  // Load parking data when component mounts
  useEffect(() => {
    if (!isMounted) return;
    
    console.log('🚀 Component mounted, loading parking data...');
    // Delay loading parking data to ensure Google Maps API is loaded first
    setTimeout(() => {
      if (isMounted) {
        loadParkingData();
      }
    }, 1000); // Wait 1 second for Google Maps API to load
  }, [isMounted]);

  // Listen for parking statistics updates
  useEffect(() => {
    const handleParkingStatsUpdated = (event: CustomEvent) => {
      console.log('Parking update event received:', event.detail);
      
      // Reîmprospătează datele pentru a actualiza contoarele
      // Aceasta va actualiza automat toate statisticile și contoarele
      loadParkingData();
    };

    // Adaugă event listener pentru actualizarea datelor de parcare
    window.addEventListener('parkingStatsUpdated', handleParkingStatsUpdated as EventListener);

    // Cleanup la unmount
    return () => {
      window.removeEventListener('parkingStatsUpdated', handleParkingStatsUpdated as EventListener);
    };
  }, []);

  // Toggle map type function
  const toggleMapType = () => {
    console.log('Toggle map type clicked');
    // Implementează logica pentru schimbarea tipului hărții
  };

  const initializeMap = async () => {
    console.log('🗺️ initializeMap called');
    console.log('📍 mapRef.current:', mapRef.current);
    console.log('📍 window.google:', (window as any).google);
    console.log('📍 window.google.maps:', (window as any).google?.maps);
    console.log('📍 window.google.maps.Map:', (window as any).google?.maps?.Map);
    console.log('📍 window.google.maps.Marker:', (window as any).google?.maps?.Marker);
    console.log('📍 window.google.maps.Size:', (window as any).google?.maps?.Size);
    console.log('📍 window.google.maps.Point:', (window as any).google?.maps?.Point);
    
    if (!mapRef.current) {
      console.log('❌ Missing mapRef');
      return;
    }
    
    if (!(window as any).google) {
      console.log('❌ Google object not available');
      return;
    }
    
    if (!(window as any).google.maps) {
      console.log('❌ Google Maps not available');
      return;
    }
    
    if (!(window as any).google.maps.Map) {
      console.log('❌ Google Maps Map constructor not available');
      setMapError('Google Maps Map constructor not available');
      return;
    }

    try {
      const bucharest = { lat: 44.4268, lng: 26.1025 };
      console.log('📍 Creating map centered on:', bucharest);

      const map = new (window as any).google.maps.Map(mapRef.current, {
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

      console.log('✅ Map created:', map);
      mapInstanceRef.current = map;
      
      console.log('🔄 Calling updateMarkers...');
      updateMarkers();
    } catch (error) {
      console.error('❌ Error creating map:', error);
      setMapError(`Failed to create map: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const updateMarkers = async () => {
    console.log('🔄 updateMarkers called');
    console.log('📍 mapInstanceRef.current:', mapInstanceRef.current);
    console.log('📍 parkingLocations:', parkingLocations);
    
    if (!mapInstanceRef.current) {
      console.log('❌ No map instance');
      return;
    }

    if (!parkingLocations || parkingLocations.length === 0) {
      console.log('⚠️ No parking locations to display');
      return;
    }

    try {
      // Clear existing markers
      console.log('🗑️ Clearing existing markers:', markersRef.current.length);
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      console.log('➕ Adding new markers for', parkingLocations.length, 'locations');
      parkingLocations.forEach((spot, index) => {
        try {
          console.log(`📍 Creating marker ${index + 1}:`, {
            name: spot.name,
            lat: spot.latitude,
            lng: spot.longitude,
            availability: getLocationAvailability(spot),
            iconUrl: getMarkerIcon(getLocationAvailability(spot))
          });
          
          const marker = new (window as any).google.maps.Marker({
            position: { lat: spot.latitude, lng: spot.longitude },
            map: mapInstanceRef.current,
            title: spot.name,
            icon: {
              url: getMarkerIcon(getLocationAvailability(spot)),
              scaledSize: new (window as any).google.maps.Size(32, 32),
              anchor: new (window as any).google.maps.Point(16, 32)
            }
          });

          marker.addListener('click', () => {
            setSelectedSpot(spot);
          });

          markersRef.current.push(marker);
          console.log(`✅ Marker ${index + 1} created and added to map`);
        } catch (markerError) {
          console.error(`❌ Error creating marker ${index + 1}:`, markerError);
        }
      });
      
      console.log('🎯 Total markers created:', markersRef.current.length);
    } catch (error) {
      console.error('❌ Error in updateMarkers:', error);
    }
  };



  const getMarkerIcon = (status: string) => {
    const iconPath = (() => {
      switch (status) {
        case 'available':
          return '/markers/available.svg';
        case 'reserved':
          return '/markers/reserved.svg';
        case 'occupied':
          return '/markers/occupied.svg';
        default:
          return '/markers/default.svg';
      }
    })();
    
    console.log(`🎯 Marker icon for status '${status}': ${iconPath}`);
    return iconPath;
  };

  // Test marker icon accessibility
  useEffect(() => {
    if (!isMounted) return;
    
    const testMarkerIcons = async () => {
      const statuses = ['available', 'reserved', 'occupied', 'default'];
      for (const status of statuses) {
        const iconPath = getMarkerIcon(status);
        try {
          const response = await fetch(iconPath);
          console.log(`🎯 Marker icon ${status}: ${response.ok ? '✅ Accessible' : '❌ Not accessible'} (${response.status})`);
        } catch (error) {
          console.error(`🎯 Marker icon ${status} fetch error:`, error);
        }
      }
    };
    
    testMarkerIcons();
  }, [isMounted]);

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
                    {getTypeIcon(getLocationType(spot))}
                    <span className="text-xs text-muted-foreground">{getLocationTypeText(spot)}</span>
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
                    <span className="text-sm font-medium">{getLocationPriceText(spot)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500" />
                    <span className="text-xs">{getLocationRatingText(spot)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{getLocationDistance(spot)}</span>
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
        <div className="absolute top-4 right-4 z-10 space-y-2">
          <button 
            onClick={toggleMapType} 
            className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            title="Schimbă tipul hărții"
          >
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
                <span className="font-medium">{getLocationPriceText(selectedSpot)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500" />
                <span>{getLocationRatingText(selectedSpot)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm">{getLocationDistance(selectedSpot)}</span>
              </div>
            </div>
            
            {/* Parking Spot Availability Counter */}
            <div className="flex items-center justify-between mb-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-xs font-medium">Disponibil</span>
                  <span className="text-sm font-bold text-green-600">
                    {(() => {
                      const location = parkingLocations.find(loc => loc.name === selectedSpot.name);
                      return location ? location.available_spots : 0;
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                  <span className="text-xs font-medium">Rezervat</span>
                  <span className="text-sm font-bold text-yellow-600">
                    {(() => {
                      const location = parkingLocations.find(loc => loc.name === selectedSpot.name);
                      return location ? location.reserved_spots : 0;
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-xs font-medium">Ocupat</span>
                  <span className="text-sm font-bold text-red-600">
                    {(() => {
                      const location = parkingLocations.find(loc => loc.name === selectedSpot.name);
                      return location ? location.occupied_spots : 0;
                    })()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mb-3">
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

            {/* Raportează Loc Liber Button */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const location = parkingLocations.find(loc => loc.name === selectedSpot.name);
                  if (location) {
                    // Pentru simplitate, raportăm locul A1 ca fiind liber
                    handleReportFreeSpot(location.id, 'A1');
                  }
                }}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Raportează Loc Liber
              </button>
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
                  {getTypeIcon(getLocationType(spot))}
                  <span className="text-xs text-muted-foreground">{getLocationTypeText(spot)}</span>
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
                  <span className="text-sm font-medium">{getLocationPriceText(spot)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" />
                  <span className="text-xs">{getLocationRatingText(spot)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mt-1">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{getLocationDistance(spot)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapWithParkingPins;