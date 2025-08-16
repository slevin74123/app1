import { supabase } from '@/lib/supabase';
import { ParkingSyncService } from './parkingSyncService';

export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  postal_code?: string;
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

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  parking_type: string;
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

export class ParkingService {
  /**
   * Caută parcare după termenul de search
   */
  static async searchParkingLocations(
    searchTerm: string,
    limit: number = 10
  ): Promise<{ success: boolean; error?: string; data?: SearchResult[] }> {
    try {
      if (!searchTerm.trim()) {
        return { success: true, data: [] };
      }

      // Încearcă să sincronizeze parcările de pe hartă dacă baza de date este goală
      const { data: existingParkings } = await supabase
        .from('parking_locations')
        .select('id')
        .limit(1);

      if (!existingParkings || existingParkings.length === 0) {
        console.log('Baza de date este goală, sincronizez parcările de pe hartă...');
        await ParkingSyncService.syncMapParkingsWithDatabase();
      }

      // Fallback la query direct dacă RPC-ul nu există
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .or(`name.ilike.%${searchTerm.trim()}%,address.ilike.%${searchTerm.trim()}%,city.ilike.%${searchTerm.trim()}%,district.ilike.%${searchTerm.trim()}%`)
        .order('name', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error searching parking locations:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in searchParkingLocations:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține toate locațiile de parcare
   */
  static async getAllParkingLocations(): Promise<{ success: boolean; error?: string; data?: ParkingLocation[] }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching parking locations:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getAllParkingLocations:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține o locație de parcare după ID
   */
  static async getParkingLocationById(
    id: string
  ): Promise<{ success: boolean; error?: string; data?: ParkingLocation }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching parking location:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getParkingLocationById:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține parcare după nume
   */
  static async getParkingLocationByName(
    name: string
  ): Promise<{ success: boolean; error?: string; data?: ParkingLocation }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        console.error('Error fetching parking location by name:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getParkingLocationByName:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Creează o nouă locație de parcare
   */
  static async createParkingLocation(
    parkingData: Omit<ParkingLocation, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; error?: string; data?: ParkingLocation }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .insert(parkingData)
        .select()
        .single();

      if (error) {
        console.error('Error creating parking location:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in createParkingLocation:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Actualizează o locație de parcare
   */
  static async updateParkingLocation(
    id: string,
    updates: Partial<Omit<ParkingLocation, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('parking_locations')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating parking location:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateParkingLocation:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Șterge o locație de parcare
   */
  static async deleteParkingLocation(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('parking_locations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting parking location:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteParkingLocation:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține parcare după tip
   */
  static async getParkingLocationsByType(
    parkingType: string
  ): Promise<{ success: boolean; error?: string; data?: ParkingLocation[] }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .eq('parking_type', parkingType)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching parking locations by type:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getParkingLocationsByType:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține parcare după oraș
   */
  static async getParkingLocationsByCity(
    city: string
  ): Promise<{ success: boolean; error?: string; data?: ParkingLocation[] }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .eq('city', city)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching parking locations by city:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getParkingLocationsByCity:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Verifică dacă o parcare există
   */
  static async checkParkingLocationExists(
    name: string,
    address: string
  ): Promise<{ success: boolean; error?: string; exists: boolean }> {
    try {
      const { data, error } = await supabase
        .from('parking_locations')
        .select('id')
        .or(`name.eq.${name},address.eq.${address}`)
        .limit(1);

      if (error) {
        console.error('Error checking parking location existence:', error);
        return { success: false, error: error.message, exists: false };
      }

      return { success: true, exists: (data && data.length > 0) };
    } catch (error) {
      console.error('Error in checkParkingLocationExists:', error);
      return { success: false, error: 'Eroare neașteptată', exists: false };
    }
  }
} 