import React, { useState } from 'react';
import { Star, Heart, MapPin, Clock, DollarSign, Navigation, Car, Zap } from 'lucide-react';
interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  availability: 'available' | 'reserved' | 'occupied';
  type: 'street' | 'garage' | 'lot';
  distance: string;
  walkTime: string;
  image: string;
  features: string[];
  isFavorite: boolean;
}
interface ParkingListProps {
  searchQuery: string;
  filters: {
    priceRange: [number, number];
    availability: string;
    type: string;
  };
  showNearbyOnly?: boolean;
}
const ParkingList: React.FC<ParkingListProps> = ({
  searchQuery,
  filters,
  showNearbyOnly = false
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2', '5', '8']));
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  // Parcări din București
  const parkingSpots: ParkingSpot[] = [{
    id: '1',
    name: 'Parcare Piața Victoriei',
    address: 'Piața Victoriei nr. 1, București',
    price: 8,
    rating: 4.2,
    reviews: 128,
    availability: 'available',
    type: 'garage',
    distance: '0.3 km',
    walkTime: '4 min',
    image: '/api/placeholder/120/80',
    features: ['Acoperit', 'Securitate', '24/7'],
    isFavorite: false
  }, {
    id: '2',
    name: 'Parcare Herastrau',
    address: 'Șoseaua Nordului nr. 7-9, București',
    price: 5,
    rating: 4.5,
    reviews: 89,
    availability: 'available',
    type: 'street',
    distance: '0.8 km',
    walkTime: '10 min',
    image: '/api/placeholder/120/80',
    features: ['La Nivel', 'Cu Plată'],
    isFavorite: true
  }, {
    id: '3',
    name: 'Garaj Centrul Vechi',
    address: 'Strada Lipscani nr. 15, București',
    price: 12,
    rating: 4.0,
    reviews: 156,
    availability: 'reserved',
    type: 'garage',
    distance: '1.2 km',
    walkTime: '15 min',
    image: '/api/placeholder/120/80',
    features: ['Aer Liber', 'Supraveghere'],
    isFavorite: false
  }, {
    id: '4',
    name: 'Parcare Romana',
    address: 'Piața Romană nr. 6, București',
    price: 10,
    rating: 4.3,
    reviews: 94,
    availability: 'available',
    type: 'garage',
    distance: '0.9 km',
    walkTime: '12 min',
    image: '/api/placeholder/120/80',
    features: ['Acoperit', 'Încărcare EV', 'Valet'],
    isFavorite: true
  }, {
    id: '5',
    name: 'Parcare Unirii',
    address: 'Piața Unirii nr. 1, București',
    price: 9,
    rating: 4.1,
    reviews: 67,
    availability: 'available',
    type: 'lot',
    distance: '0.7 km',
    walkTime: '9 min',
    image: '/api/placeholder/120/80',
    features: ['Aer Liber', 'Securitate'],
    isFavorite: true
  }, {
    id: '6',
    name: 'Garaj Cismigiu',
    address: 'Bulevardul Regina Elisabeta nr. 38, București',
    price: 11,
    rating: 4.4,
    reviews: 112,
    availability: 'available',
    type: 'garage',
    distance: '0.6 km',
    walkTime: '8 min',
    image: '/api/placeholder/120/80',
    features: ['Acoperit', 'Accesibil', '24/7'],
    isFavorite: false
  }, {
    id: '7',
    name: 'Parcare Obor',
    address: 'Calea Obor nr. 10, București',
    price: 7,
    rating: 4.0,
    reviews: 85,
    availability: 'available',
    type: 'street',
    distance: '1.1 km',
    walkTime: '14 min',
    image: '/api/placeholder/120/80',
    features: ['Stradal', 'Cu Plată'],
    isFavorite: false
  }, {
    id: '8',
    name: 'Parcare Floreasca',
    address: 'Șoseaua Floreasca nr. 169A, București',
    price: 8,
    rating: 4.2,
    reviews: 73,
    availability: 'available',
    type: 'garage',
    distance: '1.3 km',
    walkTime: '16 min',
    image: '/api/placeholder/120/80',
    features: ['Acoperit', 'Securitate', 'Încărcare EV'],
    isFavorite: false
  }];

  // Filter and sort spots
  const filteredAndSortedSpots = parkingSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = spot.price >= filters.priceRange[0] && spot.price <= filters.priceRange[1];
    const matchesAvailability = filters.availability === 'all' || spot.availability === filters.availability;
    const matchesType = filters.type === 'all' || spot.type === filters.type;

    // When showing nearby only, filter to spots within 1km and available
    if (showNearbyOnly) {
      const distance = parseFloat(spot.distance);
      return matchesSearch && matchesPrice && matchesAvailability && matchesType && distance <= 1.0 && spot.availability === 'available';
    }
    return matchesSearch && matchesPrice && matchesAvailability && matchesType;
  }).sort((a, b) => {
    // When showing nearby only, always sort by distance first
    if (showNearbyOnly) {
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
      default:
        return parseFloat(a.distance) - parseFloat(b.distance);
    }
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
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'reserved':
        return 'text-yellow-600 bg-yellow-50';
      case 'occupied':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Disponibil';
      case 'reserved':
        return 'Rezervat';
      case 'occupied':
        return 'Ocupat';
      default:
        return 'Necunoscut';
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'garage':
        return <Car size={14} />;
      case 'lot':
        return <MapPin size={14} />;
      case 'street':
        return <Navigation size={14} />;
      default:
        return <MapPin size={14} />;
    }
  };
  const getTypeText = (type: string) => {
    switch (type) {
      case 'garage':
        return 'Garaj';
      case 'lot':
        return 'Parcare';
      case 'street':
        return 'Stradal';
      default:
        return 'Necunoscut';
    }
  };
  return <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            {showNearbyOnly ? `Locuri Apropiate (${filteredAndSortedSpots.length})` : `Parcări Disponibile (${filteredAndSortedSpots.length})`}
          </h2>
          {!showNearbyOnly && <select value={sortBy} onChange={e => setSortBy(e.target.value as 'distance' | 'price' | 'rating')} className="px-3 py-1 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="distance">Sortează după Distanță</option>
              <option value="price">Sortează după Preț</option>
              <option value="rating">Sortează după Rating</option>
            </select>}
        </div>
        
        {showNearbyOnly && <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-2">
              Locuri de parcare disponibile în raza de 1km, sortate după distanță
            </p>
            <button onClick={() => {
          window.dispatchEvent(new CustomEvent('showNearbyParking', {
            detail: {
              show: false
            }
          }));
        }} className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              ← Înapoi la toate parcările
            </button>
          </div>}
        
        {searchQuery && <p className="text-sm text-muted-foreground">
            Rezultate pentru &quot;{searchQuery}&quot;
          </p>}
      </div>

      {/* Parking List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {filteredAndSortedSpots.map(spot => <div key={spot.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Parking Image */}
                <div className="w-24 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car size={24} className="text-muted-foreground" />
                </div>

                {/* Parking Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground truncate">{spot.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{spot.address}</p>
                    </div>
                    <button onClick={() => toggleFavorite(spot.id)} className={`p-1 rounded transition-colors ${favorites.has(spot.id) ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`} aria-label={favorites.has(spot.id) ? 'Elimină din favorite' : 'Adaugă la favorite'}>
                      <Heart size={18} fill={favorites.has(spot.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" fill="currentColor" />
                      <span className="text-sm font-medium">{spot.rating}</span>
                      <span className="text-sm text-muted-foreground">({spot.reviews})</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(spot.availability)}`}>
                      {getAvailabilityText(spot.availability)}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs">
                      {getTypeIcon(spot.type)}
                      <span>{getTypeText(spot.type)}</span>
                    </div>
                    {spot.features.slice(0, 2).map((feature, index) => <span key={index} className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                        {feature}
                      </span>)}
                    {spot.features.includes('Încărcare EV') && <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                        <Zap size={12} />
                        <span>EV</span>
                      </div>}
                  </div>

                  {/* Price and Distance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-semibold text-foreground">{spot.price} RON/oră</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={14} />
                        <span className="text-sm">{spot.distance}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock size={14} />
                        <span className="text-sm">{spot.walkTime} mers</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border border-border rounded text-sm hover:bg-accent transition-colors">
                        Direcții
                      </button>
                      <button className={`px-3 py-1 rounded text-sm transition-colors ${spot.availability === 'available' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`} disabled={spot.availability !== 'available'}>
                        {spot.availability === 'available' ? 'Rezervă' : 'Indisponibil'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}

          {filteredAndSortedSpots.length === 0 && <div className="text-center py-8">
              <MapPin size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {showNearbyOnly ? 'Nu s-au găsit locuri apropiate' : 'Nu s-au găsit locuri de parcare'}
              </h3>
              <p className="text-muted-foreground">
                {showNearbyOnly ? 'Nu există locuri de parcare disponibile în raza de 1km de poziția ta actuală.' : 'Încearcă să ajustezi criteriile de căutare sau filtrele pentru a găsi parcări disponibile.'}
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
export default ParkingList;