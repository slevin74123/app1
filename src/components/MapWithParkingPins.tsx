import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Zap, Clock, DollarSign, Star } from 'lucide-react';
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
const MapWithParkingPins: React.FC<MapWithParkingPinsProps> = ({
  searchQuery,
  filters
}) => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [userLocation, setUserLocation] = useState({
    lat: 44.4268,
    lng: 26.1025
  });

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
    name: 'Parcare Baneasa',
    address: 'Șoseaua Bucuresti-Ploiești nr. 42D, București',
    lat: 44.5086,
    lng: 26.0822,
    price: 10,
    rating: 4.3,
    availability: 'reserved',
    type: 'street',
    distance: '0.8 km'
  }, {
    id: '17',
    name: 'Parcare Cotroceni',
    address: 'Bulevardul Geniului nr. 1, București',
    lat: 44.4267,
    lng: 26.0647,
    price: 8,
    rating: 4.0,
    availability: 'available',
    type: 'lot',
    distance: '0.7 km'
  }, {
    id: '18',
    name: 'Garaj Gara de Nord',
    address: 'Piața Gării de Nord nr. 1-3, București',
    lat: 44.4472,
    lng: 26.0736,
    price: 13,
    rating: 4.2,
    availability: 'available',
    type: 'garage',
    distance: '0.5 km'
  }, {
    id: '19',
    name: 'Parcare Militari',
    address: 'Drumul Taberei nr. 34, București',
    lat: 44.4267,
    lng: 26.0469,
    price: 10,
    rating: 3.9,
    availability: 'available',
    type: 'street',
    distance: '0.6 km'
  }, {
    id: '20',
    name: 'Parcare Pipera',
    address: 'Șoseaua Pipera nr. 42, București',
    lat: 44.4847,
    lng: 26.1264,
    price: 12,
    rating: 4.4,
    availability: 'occupied',
    type: 'garage',
    distance: '1.4 km'
  }, {
    id: '21',
    name: 'Parcare Titan',
    address: 'Bulevardul Nicolae Grigorescu nr. 19, București',
    lat: 44.4267,
    lng: 26.1742,
    price: 9,
    rating: 4.1,
    availability: 'available',
    type: 'street',
    distance: '1.6 km'
  }, {
    id: '22',
    name: 'Garaj Basarab',
    address: 'Calea Griviței nr. 403, București',
    lat: 44.4472,
    lng: 26.0647,
    price: 11,
    rating: 4.3,
    availability: 'available',
    type: 'garage',
    distance: '1.3 km'
  }, {
    id: '23',
    name: 'Parcare Pantelimon',
    address: 'Șoseaua Pantelimon nr. 243, București',
    lat: 44.4513,
    lng: 26.1742,
    price: 13,
    rating: 4.5,
    availability: 'reserved',
    type: 'lot',
    distance: '1.0 km'
  }, {
    id: '24',
    name: 'Parcare Colentina',
    address: 'Șoseaua Colentina nr. 2, București',
    lat: 44.4675,
    lng: 26.1503,
    price: 12,
    rating: 4.0,
    availability: 'available',
    type: 'garage',
    distance: '0.7 km'
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
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = spot.price >= filters.priceRange[0] && spot.price <= filters.priceRange[1];
    const matchesAvailability = filters.availability === 'all' || spot.availability === filters.availability;
    const matchesType = filters.type === 'all' || spot.type === filters.type;
    return matchesSearch && matchesPrice && matchesAvailability && matchesType;
  });
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
  return <div className="h-full relative bg-muted/20 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="text-muted-foreground">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Navigation size={20} className="text-foreground" />
        </button>
        <button className="p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Zap size={20} className="text-foreground" />
        </button>
      </div>

      {/* Parking Pins */}
      <div className="absolute inset-0 scale-50 origin-center">
        {filteredSpots.map((spot, index) => {
        // Normalize coordinates for Bucharest area (44.35-44.55 lat, 26.0-26.2 lng)
        const x = (spot.lng - 26.0) / 0.2 * 100; // Normalize longitude to percentage
        const y = (44.55 - spot.lat) / 0.2 * 100; // Normalize latitude to percentage (inverted for screen coordinates)

        return <button key={spot.id} onClick={() => setSelectedSpot(spot)} className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 ${getAvailabilityBg(spot.availability)}`} style={{
          left: `${Math.max(5, Math.min(95, x))}%`,
          top: `${Math.max(5, Math.min(95, y))}%`,
          zIndex: selectedSpot?.id === spot.id ? 20 : 10
        }} aria-label={`${spot.name} - ${spot.price} RON/oră`}>
              <MapPin size={20} className={getAvailabilityColor(spot.availability)} />
            </button>;
      })}
      </div>

      {/* Selected Spot Popup */}
      {selectedSpot && <div className="absolute bottom-4 left-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 z-30 max-w-sm mx-auto">
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
          
          <div className="flex gap-2">
            <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
              Rezervă Acum
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Direcții
            </button>
          </div>
        </div>}

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
    </div>;
};
export default MapWithParkingPins;