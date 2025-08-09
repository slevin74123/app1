import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Zap, Clock, DollarSign, Star, Heart, Car, Search, X } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleMapsAutocomplete } from './GoogleMapsAutocomplete';

// Declarare globală pentru window._freeSpotMarkers (trebuie să fie la top-level, înainte de orice import)
declare global {
  interface Window {
    _freeSpotMarkers?: unknown[];
  }
}

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
  locuri_disponibile?: number;
  locuri_indisponibile?: number;
  locuri_total?: number;
}

interface MapWithParkingPinsProps {
  filters: {
    priceRange: [number, number];
    availability: string;
    type: string;
  };
  searchQuery?: string;
}

interface FreeSpotReport {
  lat?: number;
  lng?: number;
  description?: string;
  created_at?: string;
}

// Google Maps types

const MapWithParkingPins: React.FC<MapWithParkingPinsProps> = ({
  filters,
  searchQuery: searchQueryProp,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2', '5', '8']));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { user } = useAuth();
  const [reserving, setReserving] = useState(false);
  // Pinuri temporare pentru locuri libere raportate de utilizatori
  const [freeSpotReports, setFreeSpotReports] = useState<FreeSpotReport[]>([]);
  const [searchQueryState, setSearchQueryState] = useState('');
  const searchQuery = searchQueryProp !== undefined ? searchQueryProp : searchQueryState;
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Elimină handleSearchChange și orice referință la ea

  const handleSelectAddress = (
    address: string,
    lat?: number,
    lng?: number
  ) => {
    if (searchQueryProp === undefined) {
      setSearchQueryState(address);
    }
    if (lat && lng) {
      setSelectedLocation({ lat, lng });
    }
  };

  const clearSearch = () => {
    if (searchQueryProp === undefined) {
      setSearchQueryState('');
    }
    setSelectedLocation(null);
  };

  // Mut initializeMap și updateMarkers deasupra useEffect-urilor care le folosesc
  const loadGoogleMapsScript = useCallback((apiKey: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      return Promise.resolve();
    }
    if (googleMapsScriptLoadingPromise.current) {
      return googleMapsScriptLoadingPromise.current;
    }
    googleMapsScriptLoadingPromise.current = new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };
      document.head.appendChild(script);
    });
    return googleMapsScriptLoadingPromise.current;
  }, []);

  // Definirea updateMarkers trebuie să fie înainte de initializeMap
  const filteredSpots = parkingSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = spot.price >= filters.priceRange[0] && spot.price <= filters.priceRange[1];
    const matchesAvailability = filters.availability === 'all' || spot.availability === filters.availability;
    const matchesType = filters.type === 'all' || spot.type === filters.type;
    return matchesSearch && matchesPrice && matchesAvailability && matchesType;
  });



  const toggleFavorite = (spotId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(spotId)) {
        newFavorites.delete(spotId);
      } else {
        newFavorites.add(spotId);
      }
      return newFavorites;
    });
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
        return <></>; // fragment React gol, nu {}
    }
  };

  const handleReserve = async () => {
    if (!selectedSpot || !user) return;
    setReserving(true);
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000); // +1h
    const { error } = await supabase.from('reservations').insert({
      user_id: user.id,
      spot_id: selectedSpot.id,
      start_time: now.toISOString(),
      end_time: end.toISOString(),
      status: 'active'
    });
    if (!error) {
      // Update spot status in DB
      const { error: updateError } = await supabase.from('parking_spots').update({ availability: 'reserved' }).eq('id', selectedSpot.id);
      if (!updateError) {
        // Update local state
        setParkingSpots(prev => prev.map(spot => spot.id === selectedSpot.id ? { ...spot, availability: 'reserved' } : spot));
      }
    }
    setReserving(false);
  };

  // Funcție pentru încărcarea parcărilor
  const fetchParkingSpots = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    
    // Fetch din parking_spots (tabela originală)
    const { data: parkingSpotsData, error: parkingSpotsError } = await supabase
      .from('parking_spots')
      .select('*');
    
    // Fetch din parcari_raportate (tabela nouă)
    const { data: reportedParkingsData, error: reportedParkingsError } = await supabase
      .from('parcari_raportate')
      .select('*');
    
    if (parkingSpotsError || reportedParkingsError) {
      setFetchError('Eroare la încărcarea parcărilor.');
      setParkingSpots([]);
    } else {
      // Combină datele din ambele tabele
      const allParkingSpots: ParkingSpot[] = [
        // Convertește parking_spots la formatul așteptat
        ...(parkingSpotsData || []).map(spot => ({
          id: spot.id,
          name: spot.name || 'Parcare',
          address: spot.address || 'Adresă necunoscută',
          lat: spot.latitude || spot.lat || 0,
          lng: spot.longitude || spot.lng || 0,
          price: 8, // Preț default
          rating: 4.0, // Rating default
          availability: spot.is_available ? 'available' as const : 'occupied' as const,
          type: 'street' as const,
          distance: '0.5 km', // Distanță default
          locuri_disponibile: spot.is_available ? 5 : 0,
          locuri_indisponibile: spot.is_available ? 0 : 5,
          locuri_total: 5
        })),
        // Convertește parcari_raportate la formatul așteptat
        ...(reportedParkingsData || []).map(parking => ({
          id: `reported-${parking.id}`,
          name: parking.nume,
          address: parking.adresa,
          lat: parking.lat,
          lng: parking.lng,
          price: parking.pret_pe_ora,
          rating: parking.rating,
          availability: parking.disponibilitate ? 'available' as const : 'occupied' as const,
          type: parking.garaj ? 'garage' as const : 'street' as const,
          distance: `${parking.distanta_km} km`,
          locuri_disponibile: parking.locuri_disponibile !== undefined ? parking.locuri_disponibile : (parking.disponibilitate ? 5 : 0),
          locuri_indisponibile: parking.locuri_indisponibile !== undefined ? parking.locuri_indisponibile : (parking.disponibilitate ? 0 : 5),
          locuri_total: parking.locuri_total !== undefined ? parking.locuri_total : 5
        }))
      ];
      
      console.log(`📊 Parcări încărcate: ${allParkingSpots.length} total`);
      console.log(`   - Din parking_spots: ${parkingSpotsData?.length || 0}`);
      console.log(`   - Din parcari_raportate: ${reportedParkingsData?.length || 0}`);
      setParkingSpots(allParkingSpots);
    }
    setLoading(false);
  }, []);

  // Încarcă parcările la mount
  useEffect(() => {
    fetchParkingSpots();
  }, [fetchParkingSpots]);

  // Get available spots for bottom section
  const availableSpots = filteredSpots.filter(spot => spot.availability === 'available').slice(0, 6);

  // Load Google Maps API script - doar la mount
  const googleMapsScriptLoadingPromise = useRef<Promise<void> | null>(null);
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapError('Google Maps API key is missing');
      return;
    }
    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(() => {
        setMapLoaded(true);
      })
      .catch(() => {
        setMapError('Failed to load Google Maps API');
      });
  }, [loadGoogleMapsScript]);

  // Înlocuiesc efectul de inițializare a hărții cu polling robust
  useEffect(() => {
    if (!mapLoaded || !window.google) return;
    
    // Dacă harta deja există, nu o re-initializează
    if (mapInstanceRef.current) return;
    
    let interval: NodeJS.Timeout | null = null;
    let retryCount = 0;
    const maxRetries = 100; // 10 secunde max
    
    function tryInitMap() {
      if (!mapRef.current) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('Map container not available after max retries');
          setLoading(false); // Set loading to false even if map fails
          return;
        }
        return;
      }
      
      const rect = mapRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('Map container has zero dimensions after max retries');
          setLoading(false); // Set loading to false even if map fails
          return;
        }
        return;
      }
      
      try {
        const bucharest = { lat: 44.4268, lng: 26.1025 };
        const map = new window.google.maps.Map(mapRef.current, {
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
        console.log('✅ Map initialized successfully');
        setLoading(false); // Set loading to false when map is ready
        
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('Failed to initialize map after max retries');
          setLoading(false); // Set loading to false even if map fails
        }
      }
    }
    
    // Încearcă imediat, apoi la fiecare 100ms până reușește
    tryInitMap();
    if (!mapInstanceRef.current) {
      interval = setInterval(tryInitMap, 100);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, [mapLoaded]);

  // Adaug un timeout de siguranță pentru loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Loading timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 15000); // 15 secunde timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Funcție pentru a verifica și repara harta dacă dispare
  const ensureMapVisible = useCallback(() => {
    if (mapInstanceRef.current && mapRef.current) {
      // Forțează re-render-ul hărții dacă este necesar
      const map = mapInstanceRef.current as google.maps.Map;
      window.google.maps.event.trigger(map, 'resize');
      
      // Verifică dacă harta este vizibilă
      const rect = mapRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('Map container has zero dimensions, attempting to restore...');
        // Forțează reflow
        mapRef.current.style.display = 'none';
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.style.display = 'block';
            window.google.maps.event.trigger(map, 'resize');
          }
        }, 10);
      }
    }
  }, []);

  // Update markers doar când harta e gata și filteredSpots se schimbă
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    
    // Asigură-te că harta este vizibilă înainte de a actualiza markerii
    ensureMapVisible();
    
    // Șterge markerii existenți
    (markersRef.current as unknown[]).forEach((marker: unknown) => (marker as { setMap: (map: unknown) => void }).setMap(null));
    markersRef.current = [];
    
    filteredSpots.forEach(spot => {
      const marker = new window.google.maps.Marker({
        position: { lat: spot.lat, lng: spot.lng },
        map: mapInstanceRef.current,
        title: spot.name
      });
      marker.addListener('click', () => {
        setSelectedSpot(spot);
      });
      
      // Adaugă tooltip cu informații despre parcare
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 280px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              ${spot.name}
            </h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              ${spot.address}
            </p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #059669; font-weight: 600;">
                ${spot.price} RON/oră
              </span>
              <span style="color: ${spot.availability === 'available' ? '#059669' : '#dc2626'}; font-weight: 600;">
                ${spot.availability === 'available' ? 'Disponibil' : 'Ocupat'}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #6b7280;">
              <span>⭐ ${spot.rating}</span>
              <span>📍 ${spot.distance}</span>
            </div>
                              <div style="border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="color: #059669;">🟢 Locuri libere:</span>
                      <span style="font-weight: 600;">${spot.locuri_disponibile !== undefined ? spot.locuri_disponibile : (spot.availability === 'available' ? 5 : 0)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="color: #dc2626;">🔴 Locuri ocupate:</span>
                      <span style="font-weight: 600;">${spot.locuri_indisponibile !== undefined ? spot.locuri_indisponibile : (spot.availability === 'available' ? 0 : 5)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #6b7280;">📊 Total locuri:</span>
                      <span style="font-weight: 600;">${spot.locuri_total !== undefined ? spot.locuri_total : 5}</span>
                    </div>
                  </div>
          </div>
        `
      });
      
      marker.addListener('mouseover', () => {
        infoWindow.open(mapInstanceRef.current as google.maps.Map, marker as google.maps.Marker);
      });
      
      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
      (markersRef.current as unknown[]).push(marker);
    });
  }, [filteredSpots, mapLoaded, ensureMapVisible]);

  // Ascultă evenimentul custom pentru raportare parcare
  useEffect(() => {
    function handleParkingReported() {
      console.log('🔄 Parking reported, refreshing data...');
      // Reîncarcă parcările pentru a include noua parcare raportată
      fetchParkingSpots();
      
      // După un scurt delay, verifică și repară harta dacă este necesar
      setTimeout(() => {
        ensureMapVisible();
      }, 500);
    }
    
    function handleFreeSpotReported(e: CustomEvent<unknown>) {
      setFreeSpotReports((prev) => [...prev, (e as CustomEvent<FreeSpotReport>).detail as FreeSpotReport]);
    }
    
    window.addEventListener('parking-reported', handleParkingReported as EventListener);
    window.addEventListener('free-spot-reported', handleFreeSpotReported as EventListener);
    
    return () => {
      window.removeEventListener('parking-reported', handleParkingReported as EventListener);
      window.removeEventListener('free-spot-reported', handleFreeSpotReported as EventListener);
    };
  }, [fetchParkingSpots, ensureMapVisible]);

  // Adaugă pinuri verzi pentru rapoarte de loc liber
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    // Șterge markerii existenți pentru rapoarte
    if (window._freeSpotMarkers) {
      (window._freeSpotMarkers as unknown[]).forEach((m) => (m as { setMap: (map: unknown) => void }).setMap(null));
      window._freeSpotMarkers = [];
    }
    freeSpotReports.forEach((report) => {
      // Dacă ai lat/lng în raport, folosește-le. Altfel, folosește un fallback (ex: centru București)
      const lat = report.lat || 44.4268;
      const lng = report.lng || 26.1025;
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current as google.maps.Map,
        title: 'Loc liber raportat',
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        },
        zIndex: 9999
      });
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style='font-size:14px;max-width:220px;'><b>Loc liber raportat</b><br/>${report.description || ''}<br/><span style='color:#888;font-size:12px;'>${report.created_at ? new Date(report.created_at).toLocaleString() : ''}</span></div>`
      });
      marker.addListener('mouseover', () => infoWindow.open(mapInstanceRef.current as google.maps.Map, marker as google.maps.Marker));
      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
      if (window._freeSpotMarkers) window._freeSpotMarkers.push(marker);
    });
    // Opțional: șterge pinurile după 5 minute
    if (freeSpotReports.length > 0) {
      setTimeout(() => setFreeSpotReports([]), 5 * 60 * 1000);
      // Nu e nevoie de cleanup pentru timeout local
    }
  }, [freeSpotReports, mapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !selectedLocation) return;

    // Center map on selected location and place a marker
    const map = mapInstanceRef.current as unknown;
    const position = { lat: selectedLocation.lat, lng: selectedLocation.lng };

    (map as google.maps.Map).setCenter(position);
    (map as google.maps.Map).setZoom(15);

    new window.google.maps.Marker({
      position,
      map,
      title: "Selected Location",
    });
  }, [selectedLocation]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-[70%] relative bg-muted/20 overflow-hidden">
        {mapError ? (
          <div className="h-full flex items-center justify-center bg-muted/20">
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
        ) : (
          <>
            <div
              ref={mapRef}
              className="w-full h-full"
            />
            {loading && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-foreground">Se încarcă harta...</span>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Navigation size={20} className="text-foreground" />
              </button>
              <button className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Zap size={20} className="text-foreground" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="h-[30%] bg-card border-t border-border p-4 flex flex-col">
        <div className="pb-4 border-b border-border mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <GoogleMapsAutocomplete
              onSelect={handleSelectAddress}
              placeholder="Caută o adresă..."
              className="w-full"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
            </button>
            )}
          </div>
          </div>
          
        {fetchError ? (
          <div className="text-red-500 text-center mt-4">{fetchError}</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Parcări Disponibile</h3>
              <span className="text-sm text-muted-foreground">{availableSpots.length} locuri</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto h-full">
              {availableSpots.map((spot) => (
                <div 
                  key={spot.id} 
                  className="bg-background border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSpot(spot)}
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
                        className={favorites.has(spot.id) ? 'fill-red-500 text-red-500' : ''} 
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
          </>
        )}
          </div>
          
      {selectedSpot && (
        <div className="absolute inset-0 bg-black/40 z-20" onClick={() => setSelectedSpot(null)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-card p-6 rounded-t-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">{selectedSpot.name}</h3>
            <p className="text-muted-foreground mb-4">{selectedSpot.address}</p>
            {/* ... other details ... */}
            <button className="w-full mt-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors" onClick={handleReserve} disabled={reserving}>
              {reserving ? 'Se rezervă...' : 'Rezervă Acum'}
            </button>
          </div>
        </div>
      )}
      </div>
  );
};

export default MapWithParkingPins;