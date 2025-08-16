import { supabase } from '@/lib/supabase';

// Interfața pentru parcările de pe hartă
export interface MapParkingSpot {
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

// Interfața pentru parcările din baza de date
export interface DatabaseParkingLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  parking_type: 'street' | 'garage' | 'lot' | 'underground';
  total_spots?: number;
  available_spots?: number;
  price_per_hour?: number;
  is_free: boolean;
  is_24h: boolean;
  description?: string;
  amenities?: string[];
  created_at: string;
  updated_at: string;
}

export class ParkingSyncService {
  /**
   * Sincronizează parcările de pe hartă cu baza de date
   */
  static async syncMapParkingsWithDatabase(): Promise<{ success: boolean; error?: string; count?: number }> {
    try {
      // Parcările de pe hartă (din MapWithParkingPins)
      const mapParkings: MapParkingSpot[] = [
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        }
      ];

      let insertedCount = 0;

      // Sincronizează fiecare parcare
      for (const parking of mapParkings) {
        try {
          // Verifică dacă parcarea există deja
          const { data: existingParking } = await supabase
            .from('parking_locations')
            .select('id')
            .eq('name', parking.name)
            .single();

          if (!existingParking) {
            // Inserează parcarea nouă
            const { error: insertError } = await supabase
              .from('parking_locations')
              .insert({
                name: parking.name,
                address: parking.address,
                city: 'București',
                district: this.extractDistrictFromAddress(parking.address),
                latitude: parking.lat,
                longitude: parking.lng,
                parking_type: parking.type,
                total_spots: this.estimateTotalSpots(parking.type),
                available_spots: parking.availability === 'available' ? this.estimateTotalSpots(parking.type) : 0,
                price_per_hour: parking.price,
                is_free: false,
                is_24h: this.is24HourParking(parking.type),
                description: `${parking.type === 'garage' ? 'Garaj' : parking.type === 'lot' ? 'Parcare deschisă' : 'Parcare stradală'} cu ${parking.rating}/5 rating`,
                amenities: this.getAmenitiesForType(parking.type)
              });

            if (!insertError) {
              insertedCount++;
            } else {
              console.error(`Error inserting parking ${parking.name}:`, insertError);
            }
          }
        } catch (error) {
          console.error(`Error processing parking ${parking.name}:`, error);
        }
      }

      return { success: true, count: insertedCount };
    } catch (error) {
      console.error('Error in syncMapParkingsWithDatabase:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Extrage sectorul din adresă
   */
  private static extractDistrictFromAddress(address: string): string {
    if (address.includes('Centru') || address.includes('Lipscani') || address.includes('Victoriei') || address.includes('Unirii')) {
      return 'Centru';
    } else if (address.includes('Herastrau') || address.includes('Floreasca') || address.includes('Colentina')) {
      return 'Herăstrău';
    } else if (address.includes('Titan') || address.includes('Tei')) {
      return 'Titan';
    } else if (address.includes('Militari')) {
      return 'Militari';
    } else if (address.includes('Drumul Taberei') || address.includes('Berceni')) {
      return 'Drumul Taberei';
    } else if (address.includes('Gara de Nord') || address.includes('Basarab')) {
      return 'Gara de Nord';
    } else if (address.includes('Vitan') || address.includes('Dristor') || address.includes('Pantelimon')) {
      return 'Vitan';
    } else if (address.includes('Aviatorilor') || address.includes('Dorobanti')) {
      return 'Aviatorilor';
    } else if (address.includes('Stefan cel Mare') || address.includes('Iancului') || address.includes('Mosilor')) {
      return 'Stefan cel Mare';
    } else if (address.includes('Eroilor') || address.includes('Muncii')) {
      return 'Eroilor';
    } else if (address.includes('Amzei') || address.includes('Cismigiu') || address.includes('Universitate') || address.includes('Romana')) {
      return 'Centru';
    } else if (address.includes('Obor') || address.includes('Sudului')) {
      return 'Obor';
    }
    return 'Centru';
  }

  /**
   * Estimează numărul total de locuri în funcție de tipul de parcare
   */
  private static estimateTotalSpots(type: string): number {
    switch (type) {
      case 'garage':
        return Math.floor(Math.random() * 200) + 100; // 100-300 locuri
      case 'lot':
        return Math.floor(Math.random() * 100) + 50;  // 50-150 locuri
      case 'street':
        return Math.floor(Math.random() * 50) + 20;   // 20-70 locuri
      default:
        return 50;
    }
  }

  /**
   * Determină dacă parcarea este 24/7
   */
  private static is24HourParking(type: string): boolean {
    return type === 'garage' || type === 'lot';
  }

  /**
   * Obține facilitățile pentru tipul de parcare
   */
  private static getAmenitiesForType(type: string): string[] {
    const baseAmenities = ['lighting'];
    
    switch (type) {
      case 'garage':
        return [...baseAmenities, 'covered', 'security', 'disabled_access'];
      case 'lot':
        return [...baseAmenities, 'security'];
      case 'street':
        return baseAmenities;
      default:
        return baseAmenities;
    }
  }

  /**
   * Obține toate parcările sincronizate pentru search
   */
  static async getAllMapParkings(): Promise<{ success: boolean; error?: string; data?: DatabaseParkingLocation[] }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching map parkings:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getAllMapParkings:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }
} 