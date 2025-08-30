import { supabase } from '@/lib/supabase';

export interface ParkingSpot {
  id: string;
  parking_location_id: string;
  spot_number: string;
  status: 'available' | 'reserved' | 'occupied';
  last_status_change: string;
  last_reported_by?: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParkingLocationWithStats {
  id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  parking_type?: 'street' | 'garage' | 'lot' | 'underground';
  total_spots: number;
  available_spots: number;
  reserved_spots: number;
  occupied_spots: number;
  price_per_hour?: number;
  is_free?: boolean;
  is_24h?: boolean;
  description?: string;
  amenities?: string[];
  created_at: string;
  updated_at: string;
}

export interface ParkingSpotStatusHistory {
  id: string;
  parking_spot_id: string;
  user_id?: string;
  old_status: string;
  new_status: string;
  change_reason?: string;
  notes?: string;
  created_at: string;
}

export class ParkingSpotService {
  /**
   * Raportează un loc liber (funcția "raporteaza loc liber")
   */
  static async reportFreeParkingSpot(
    parkingLocationId: string,
    spotNumber: string,
    userId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Raportare loc liber pentru:', { parkingLocationId, spotNumber, userId });
      
      // Încearcă să raportezi locul liber prin metoda simplă
      const result = await this.reportFreeParkingSpotSimple(
        parkingLocationId,
        spotNumber,
        userId,
        notes
      );

      // Dacă raportarea a reușit, emite evenimentul de actualizare
      if (result.success) {
        console.log('Loc liber raportat cu succes, emite evenimentul de actualizare');
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('parkingStatsUpdated', {
            detail: {
              parkingLocationId,
              message: 'Parking spot reported successfully',
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

      return result;

    } catch (error) {
      console.error('Eroare la raportarea locului liber:', error);
      return { success: false, error: 'Eroare neașteptată în serviciu' };
    }
  }

  /**
   * Metodă simplă pentru raportarea locului liber
   */
  private static async reportFreeParkingSpotSimple(
    parkingLocationId: string,
    spotNumber: string,
    userId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Folosind metoda simplă pentru raportarea locului liber');
      
      // Încearcă să găsești locul existent
      const { data: existingSpot, error: findError } = await supabase
        .from('parking_spots')
        .select('id, status')
        .eq('parking_location_id', parkingLocationId)
        .eq('spot_number', spotNumber)
        .single();

      if (findError) {
        console.log('Locul nu a fost găsit, încearcă să-l creezi:', findError);
        
        // Dacă locul nu există, încearcă să-l creezi
        const { error: createError } = await supabase
          .from('parking_spots')
          .insert({
            parking_location_id: parkingLocationId,
            spot_number: spotNumber,
            status: 'available',
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_status_change: new Date().toISOString(),
            last_reported_by: userId
          });

        if (createError) {
          console.error('Eroare la crearea locului:', createError);
          return { success: false, error: 'Nu se poate crea locul de parcare' };
        }

        console.log('Loc nou creat cu succes');
        return { success: true };
      }

      // Dacă locul există, actualizează-l
      if (existingSpot) {
        console.log('Actualizează locul existent:', existingSpot.id);
        
        const { error: updateError } = await supabase
          .from('parking_spots')
          .update({
            status: 'available',
            last_status_change: new Date().toISOString(),
            last_reported_by: userId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSpot.id);

        if (updateError) {
          console.error('Eroare la actualizarea locului:', updateError);
          return { success: false, error: 'Nu se poate actualiza locul de parcare' };
        }

        console.log('Loc actualizat cu succes');
        return { success: true };
      }

      return { success: false, error: 'Locul nu a putut fi găsit sau actualizat' };

    } catch (error) {
      console.error('Eroare în metoda simplă:', error);
      return { success: false, error: 'Eroare la procesarea locului de parcare' };
    }
  }

  /**
   * Actualizează statusul unui loc de parcare
   */
  static async updateParkingSpotStatus(
    spotId: string,
    newStatus: 'available' | 'reserved' | 'occupied',
    userId: string,
    changeReason: string = 'user_report',
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('update_parking_spot_status', {
        spot_id: spotId,
        new_status: newStatus,
        user_id: userId,
        change_reason: changeReason,
        notes: notes || null
      });

      if (error) {
        console.error('Error updating parking spot status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateParkingSpotStatus:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține statisticile în timp real pentru o locație de parcare
   */
  static async getParkingLocationStats(locationId: string): Promise<{
    total_spots: number;
    available_spots: number;
    reserved_spots: number;
    occupied_spots: number;
  } | null> {
    try {
      console.log('Calculating parking stats for location:', locationId);
      
      // Încearcă să obții statisticile direct din tabela parking_spots
      try {
        const { data: spotsData, error: spotsError } = await supabase
          .from('parking_spots')
          .select('status')
          .eq('parking_location_id', locationId);

        if (spotsError) {
          console.log('Could not access parking_spots table:', spotsError);
          throw spotsError;
        }

        if (spotsData && spotsData.length > 0) {
          // Calculează statisticile din datele obținute
          const totalSpots = spotsData.length;
          const availableSpots = spotsData.filter(spot => spot.status === 'available').length;
          const reservedSpots = spotsData.filter(spot => spot.status === 'reserved').length;
          const occupiedSpots = spotsData.filter(spot => spot.status === 'occupied').length;

          const stats = {
            total_spots: totalSpots,
            available_spots: availableSpots,
            reserved_spots: reservedSpots,
            occupied_spots: occupiedSpots
          };

          console.log('Calculated stats from parking_spots table:', stats);
          return stats;
        }
      } catch (tableAccessError) {
        console.log('Table access failed, trying alternative method:', tableAccessError);
      }

      // Metodă alternativă: încearcă să obții statisticile din parking_locations
      try {
        const { data: locationData, error: locationError } = await supabase
          .from('parking_locations')
          .select('total_spots, available_spots, reserved_spots, occupied_spots')
          .eq('id', locationId)
          .single();

        if (locationError) {
          console.log('Could not access parking_locations table:', locationError);
          throw locationError;
        }

        if (locationData) {
          const stats = {
            total_spots: locationData.total_spots || 0,
            available_spots: locationData.available_spots || 0,
            reserved_spots: locationData.reserved_spots || 0,
            occupied_spots: locationData.occupied_spots || 0
          };

          console.log('Got stats from parking_locations table:', stats);
          return stats;
        }
      } catch (locationAccessError) {
        console.log('Location table access also failed:', locationAccessError);
      }

      // Dacă ambele metode eșuează, returnează statistici implicite
      console.log('Both methods failed, returning default stats');
      return {
        total_spots: 0,
        available_spots: 0,
        reserved_spots: 0,
        occupied_spots: 0
      };

    } catch (error) {
      console.error('Error in getParkingLocationStats:', error);
      // Returnează statistici implicite în loc de null pentru a evita erorile
      return {
        total_spots: 0,
        available_spots: 0,
        reserved_spots: 0,
        occupied_spots: 0
      };
    }
  }

  /**
   * Caută locuri de parcare după status
   */
  static async searchParkingSpotsByStatus(
    locationId: string,
    status: 'available' | 'reserved' | 'occupied'
  ): Promise<ParkingSpot[]> {
    try {
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('parking_location_id', locationId)
        .eq('status', status)
        .order('spot_number');

      if (error) {
        console.error('Error searching parking spots by status:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchParkingSpotsByStatus:', error);
      return [];
    }
  }

  /**
   * Obține locurile premium pentru o locație
   */
  static async getPremiumParkingSpots(locationId: string): Promise<ParkingSpot[]> {
    try {
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('parking_location_id', locationId)
        .eq('is_premium', true)
        .order('spot_number');

      if (error) {
        console.error('Error fetching premium parking spots:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPremiumParkingSpots:', error);
      return [];
    }
  }

  /**
   * Obține locurile disponibile pentru o locație
   */
  static async getAvailableParkingSpots(locationId: string): Promise<ParkingSpot[]> {
    return this.searchParkingSpotsByStatus(locationId, 'available');
  }

  /**
   * Obține locurile rezervate pentru o locație
   */
  static async getReservedParkingSpots(locationId: string): Promise<ParkingSpot[]> {
    return this.searchParkingSpotsByStatus(locationId, 'reserved');
  }

  /**
   * Obține locurile ocupate pentru o locație
   */
  static async getOccupiedParkingSpots(locationId: string): Promise<ParkingSpot[]> {
    return this.searchParkingSpotsByStatus(locationId, 'occupied');
  }

  /**
   * Creează un loc nou de parcare
   */
  static async createParkingSpot(
    parkingLocationId: string,
    spotNumber: string,
    status: 'available' | 'reserved' | 'occupied' = 'available',
    isPremium: boolean = false
  ): Promise<{ success: boolean; error?: string; spot?: ParkingSpot }> {
    try {
      const { data, error } = await supabase
        .from('parking_spots')
        .insert({
          parking_location_id: parkingLocationId,
          spot_number: spotNumber,
          status,
          is_premium: isPremium
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating parking spot:', error);
        return { success: false, error: error.message };
      }

      return { success: true, spot: data };
    } catch (error) {
      console.error('Error in createParkingSpot:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Șterge un loc de parcare
   */
  static async deleteParkingSpot(spotId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('parking_spots')
        .delete()
        .eq('id', spotId);

      if (error) {
        console.error('Error deleting parking spot:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteParkingSpot:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Testează accesul la tabelele de parcare pentru a diagnostica problemele
   */
  static async testTableAccess(): Promise<{
    parking_spots: boolean;
    parking_locations: boolean;
    parking_spot_status_history: boolean;
    errors: string[];
  }> {
    const results = {
      parking_spots: false,
      parking_locations: false,
      parking_spot_status_history: false,
      errors: [] as string[]
    };

    console.log('Testing table access...');

    // Testează accesul la parking_locations
    try {
      const { data: locationsData, error: locationsError } = await supabase
        .from('parking_locations')
        .select('id, name')
        .limit(1);

      if (locationsError) {
        console.log('parking_locations access error:', locationsError);
        results.errors.push(`parking_locations: ${locationsError.message}`);
      } else {
        console.log('parking_locations access: OK');
        results.parking_locations = true;
      }
    } catch (locationsException) {
      console.log('parking_locations exception:', locationsException);
      results.errors.push(`parking_locations exception: ${String(locationsException)}`);
    }

    // Testează accesul la parking_spots
    try {
      const { data: spotsData, error: spotsError } = await supabase
        .from('parking_spots')
        .select('id, spot_number')
        .limit(1);

      if (spotsError) {
        console.log('parking_spots access error:', spotsError);
        results.errors.push(`parking_spots: ${spotsError.message}`);
      } else {
        console.log('parking_spots access: OK');
        results.parking_spots = true;
      }
    } catch (spotsException) {
      console.log('parking_spots exception:', spotsException);
      results.errors.push(`parking_spots exception: ${String(spotsException)}`);
    }

    // Testează accesul la parking_spot_status_history
    try {
      const { data: historyData, error: historyError } = await supabase
        .from('parking_spot_status_history')
        .select('id')
        .limit(1);

      if (historyError) {
        console.log('parking_spot_status_history access error:', historyError);
        results.errors.push(`parking_spot_status_history: ${historyError.message}`);
      } else {
        console.log('parking_spot_status_history access: OK');
        results.parking_spot_status_history = true;
      }
    } catch (historyException) {
      console.log('parking_spot_status_history exception:', historyException);
      results.errors.push(`parking_spot_status_history exception: ${String(historyException)}`);
    }

    console.log('Table access test results:', results);
    return results;
  }
} 