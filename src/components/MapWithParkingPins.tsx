import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Zap, Clock, DollarSign, Star, Heart, Car } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Declarare globală pentru window._freeSpotMarkers (trebuie să fie la top-level, înainte de orice import)
declare global {
  interface Window {
    _freeSpotMarkers?: any[];
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
}

interface MapWithParkingPinsProps {
  searchQuery: string;
  filters: {
    priceRange: [number, number];
    availability: string;
    type: string;
  };
}

// Google Maps types

const MapWithParkingPins: React.FC<MapWithParkingPinsProps> = ({
  searchQuery,
  filters
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
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  // Pinuri temporare pentru locuri libere raportate de utilizatori
  const [freeSpotReports, setFreeSpotReports] = useState<any[]>([]);

  // Mut initializeMap și updateMarkers deasupra useEffect-urilor care le folosesc
  const loadGoogleMapsScript = useCallback((apiKey: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, script: 'already loaded', windowGoogle: true }));
      return Promise.resolve();
    }
    if (googleMapsScriptLoadingPromise.current) {
      setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, script: 'promise exists' }));
      return googleMapsScriptLoadingPromise.current;
    }
    googleMapsScriptLoadingPromise.current = new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
        setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, script: 'script tag exists' }));
        resolve();
        return;
      }
      setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, script: 'injecting script' }));
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, script: 'loaded', windowGoogle: !!window.google }));
        resolve();
      };
      script.onerror = () => {
        setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, script: 'error' }));
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
    setReservationError(null);
    setReservationSuccess(false);
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
    if (error) {
      setReservationError('Eroare la rezervare: ' + error.message);
    } else {
      setReservationSuccess(true);
      setSelectedSpot(null);
    }
  };

  useEffect(() => {
    async function fetchParkingSpots() {
      setLoading(true);
      setFetchError(null);
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*');
      if (error) {
        setFetchError('Eroare la încărcarea parcărilor.');
        setParkingSpots([]);
      } else {
        setParkingSpots(data || []);
      }
      setLoading(false);
    }
    fetchParkingSpots();
  }, []);

  // Get available spots for bottom section
  const availableSpots = filteredSpots.filter(spot => spot.availability === 'available').slice(0, 6);

  // Load Google Maps API script - doar la mount
  const googleMapsScriptLoadingPromise = useRef<Promise<void> | null>(null);
  useEffect(() => {
    setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, apiKey: GOOGLE_MAPS_API_KEY }));
    if (!GOOGLE_MAPS_API_KEY) {
      setMapError('Google Maps API key is missing');
      setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, error: 'API key missing' }));
      return;
    }
    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(() => {
        setMapLoaded(true);
        setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, mapLoaded: true, windowGoogle: !!window.google }));
      })
      .catch((err) => {
        setMapError('Failed to load Google Maps API');
        setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, error: err?.message || 'Failed to load' }));
      });
  }, [loadGoogleMapsScript]);

  // Înlocuiesc efectul de inițializare a hărții cu polling robust
  useEffect(() => {
    if (!mapLoaded || !window.google) return;
    let interval: NodeJS.Timeout | null = null;
    let tried = 0;
    function tryInitMap() {
      tried++;
      if (!mapRef.current) {
        setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, mapRefNull: true, mapRefTries: tried }));
        return;
      }
      const rect = mapRef.current.getBoundingClientRect();
      setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, mapRefRect: rect, mapRefTries: tried }));
      if (rect.width === 0 || rect.height === 0) {
        setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, mapRefZero: true, mapRefTries: tried }));
        return;
      }
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
      setDebugInfo((prev: Record<string, unknown>) => ({ ...prev, mapInstance: true, mapRefTries: tried }));
      if (interval) clearInterval(interval);
    }
    // Încearcă imediat, apoi la fiecare 100ms până reușește
    tryInitMap();
    if (!mapInstanceRef.current) {
      interval = setInterval(tryInitMap, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mapLoaded]);

  // Update markers doar când harta e gata și filteredSpots se schimbă
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    // Șterge markerii existenți
    (markersRef.current as unknown[]).forEach((marker: unknown) => (marker as { setMap: (map: unknown) => void }).setMap(null));
    markersRef.current = [];
    filteredSpots.forEach(spot => {
      const marker = new window.google.maps.Marker({
        position: { lat: spot.lat, lng: spot.lng },
        map: mapInstanceRef.current,
        title: spot.name,
        icon: {
          url: getMarkerIcon(spot.availability),
          // @ts-expect-error Google Maps types only available at runtime
          scaledSize: typeof window !== 'undefined' && window.google && window.google.maps ? new window.google.maps.Size(32, 32) : undefined,
          // @ts-expect-error Google Maps types only available at runtime
          anchor: typeof window !== 'undefined' && window.google && window.google.maps ? new window.google.maps.Point(16, 32) : undefined
        }
      });
      marker.addListener('click', () => {
        setSelectedSpot(spot);
      });
      (markersRef.current as unknown[]).push(marker);
    });
  }, [filteredSpots, mapLoaded]);

  // Ascultă evenimentul custom pentru raportare loc liber
  useEffect(() => {
    function handleFreeSpotReported(e: any) {
      setFreeSpotReports((prev) => [...prev, e.detail]);
      // Opțional: poți face și fetch la DB pentru a sincroniza toate rapoartele
    }
    window.addEventListener('free-spot-reported', handleFreeSpotReported);
    return () => window.removeEventListener('free-spot-reported', handleFreeSpotReported);
  }, []);

  // Adaugă pinuri verzi pentru rapoarte de loc liber
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    // Șterge markerii existenți pentru rapoarte
    if (window._freeSpotMarkers) {
      window._freeSpotMarkers.forEach((m: any) => m.setMap(null));
      window._freeSpotMarkers = [];
    }
    freeSpotReports.forEach((report) => {
      // Dacă ai lat/lng în raport, folosește-le. Altfel, folosește un fallback (ex: centru București)
      const lat = report.lat || 44.4268;
      const lng = report.lng || 26.1025;
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: 'Loc liber raportat',
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
          // @ts-expect-error Google Maps types only available at runtime
          scaledSize: new window.google.maps.Size(32, 32)
        },
        zIndex: 9999
      });
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style='font-size:14px;max-width:220px;'><b>Loc liber raportat</b><br/>${report.description || ''}<br/><span style='color:#888;font-size:12px;'>${report.created_at ? new Date(report.created_at).toLocaleString() : ''}</span></div>`
      });
      marker.addListener('mouseover', () => infoWindow.open(mapInstanceRef.current as any, marker));
      marker.addListener('mouseout', () => {
        // @ts-expect-error Google Maps InfoWindow close exists at runtime
        infoWindow.close();
      });
      if (window._freeSpotMarkers) window._freeSpotMarkers.push(marker);
    });
    // Opțional: șterge pinurile după 5 minute
    if (freeSpotReports.length > 0) {
      const timeout = setTimeout(() => setFreeSpotReports([]), 5 * 60 * 1000);
      // Nu e nevoie de cleanup pentru timeout local
      return undefined;
    }
  }, [freeSpotReports, mapLoaded]);

  return (
    <>
      {/* Debugging Overlay */}
      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1000, background: 'rgba(255,255,255,0.95)', color: '#222', fontSize: 12, borderRadius: 8, padding: 8, boxShadow: '0 2px 8px #0001' }}>
        <div><b>Google Maps Debug</b></div>
        <div>API Key: {GOOGLE_MAPS_API_KEY ? (GOOGLE_MAPS_API_KEY.slice(0, 8) + '...') : 'N/A'}</div>
        <div>Script: {typeof debugInfo.script === 'string' ? debugInfo.script : '-'}</div>
        <div>window.google: {String(debugInfo.windowGoogle)}</div>
        <div>mapLoaded: {String(mapLoaded)}</div>
        <div>mapRef: {String(!!mapRef.current)}</div>
        <div>mapInstance: {String(!!mapInstanceRef.current)}</div>
        <div>error: {mapError || '-'}</div>
        <div>mapRefRect: {debugInfo.mapRefRect ? JSON.stringify(debugInfo.mapRefRect) : '-'}</div>
        <div>mapRefZero: {String(debugInfo.mapRefZero)}</div>
        <div>mapRefNull: {String(debugInfo.mapRefNull)}</div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">Se încarcă parcările...</div>
      ) : fetchError ? (
        <div className="text-red-500 text-center mt-4">{fetchError}</div>
      ) : mapError ? (
        <div className="h-full flex flex-col">
          <div className="h-[70%] flex items-center justify-center bg-muted/20">
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
          <div className="h-[30%] bg-card border-t border-border p-4">
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
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Map Section - Reduced by 30% */}
          <div className="h-[70%] relative bg-muted/20 overflow-hidden">
            {/* Google Maps Container */}
            <div
              ref={mapRef}
              className="w-full h-full min-h-[300px] min-w-[200px] border border-dashed border-blue-300"
              style={{ width: '100%', height: '100%', minHeight: 300, minWidth: 200 }}
            />
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
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
                <div className="flex gap-2 mt-2">
                  <button
                    className={`flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors ${reserving || selectedSpot.availability !== 'available' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleReserve}
                    disabled={reserving || selectedSpot.availability !== 'available'}
                  >
                    {reserving ? 'Se rezervă...' : 'Rezervă Acum'}
                  </button>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                    Direcții
                  </button>
                </div>
                {reservationError && <div className="text-red-500 text-sm mt-2">{reservationError}</div>}
                {reservationSuccess && <div className="text-green-600 text-sm mt-2">Rezervare efectuată cu succes!</div>}
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
          <div className="h-[30%] bg-card border-t border-border p-4">
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
          </div>
        </div>
      )}
    </>
  );
};

export default MapWithParkingPins;