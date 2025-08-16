import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface FavoriteParking {
  id: string;
  parking_spot_id: string;
  parking_name: string;
  parking_address: string;
  parking_type: 'garage' | 'street' | 'lot';
  price: number;
  rating: number;
  added_at: string;
}

export interface ParkingHistory {
  id: string;
  parking_spot_id: string;
  parking_name: string;
  parking_address: string;
  parking_type: 'garage' | 'street' | 'lot';
  price: number;
  rating: number;
  status: 'active' | 'completed' | 'cancelled' | 'favorite';
  start_time?: string;
  end_time?: string;
  duration_hours?: number;
  total_cost?: number;
  created_at: string;
  updated_at: string;
}

export class FavoritesService {
  /**
   * Adaugă o parcare la favorite
   */
  static async addToFavorites(
    user: User,
    parkingData: {
      parking_spot_id: string;
      parking_name: string;
      parking_address: string;
      parking_type: 'garage' | 'street' | 'lot';
      price: number;
      rating: number;
    }
  ): Promise<{ success: boolean; error?: string; data?: FavoriteParking }> {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          ...parkingData
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding to favorites:', error);
        return { success: false, error: error.message };
      }

      // Adaugă și în istoricul parcarilor
      await this.addToParkingHistory(user, {
        ...parkingData,
        status: 'favorite'
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error in addToFavorites:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Elimină o parcare din favorite
   */
  static async removeFromFavorites(
    user: User,
    parkingSpotId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('parking_spot_id', parkingSpotId);

      if (error) {
        console.error('Error removing from favorites:', error);
        return { success: false, error: error.message };
      }

      // Actualizează statusul în istoricul parcarilor
      await this.updateParkingHistoryStatus(user, parkingSpotId, 'cancelled');

      return { success: true };
    } catch (error) {
      console.error('Error in removeFromFavorites:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține toate favoritele unui utilizator
   */
  static async getUserFavorites(user: User): Promise<{ success: boolean; error?: string; data?: FavoriteParking[] }> {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getUserFavorites:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Verifică dacă o parcare este în favorite
   */
  static async isFavorite(
    user: User,
    parkingSpotId: string
  ): Promise<{ success: boolean; error?: string; isFavorite: boolean }> {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('parking_spot_id', parkingSpotId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking favorite status:', error);
        return { success: false, error: error.message, isFavorite: false };
      }

      return { success: true, isFavorite: !!data };
    } catch (error) {
      console.error('Error in isFavorite:', error);
      return { success: false, error: 'Eroare neașteptată', isFavorite: false };
    }
  }

  /**
   * Adaugă o parcare în istoricul parcarilor
   */
  static async addToParkingHistory(
    user: User,
    parkingData: {
      parking_spot_id: string;
      parking_name: string;
      parking_address: string;
      parking_type: 'garage' | 'street' | 'lot';
      price: number;
      rating: number;
      status: 'active' | 'completed' | 'cancelled' | 'favorite';
      start_time?: string;
      end_time?: string;
      duration_hours?: number;
      total_cost?: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_parking_history')
        .insert({
          user_id: user.id,
          ...parkingData
        });

      if (error) {
        console.error('Error adding to parking history:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in addToParkingHistory:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Actualizează statusul unei înregistrări din istoricul parcarilor
   */
  static async updateParkingHistoryStatus(
    user: User,
    parkingSpotId: string,
    status: 'active' | 'completed' | 'cancelled' | 'favorite'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_parking_history')
        .update({ status })
        .eq('user_id', user.id)
        .eq('parking_spot_id', parkingSpotId);

      if (error) {
        console.error('Error updating parking history status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateParkingHistoryStatus:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține istoricul parcarilor unui utilizator
   */
  static async getUserParkingHistory(
    user: User,
    status?: 'active' | 'completed' | 'cancelled' | 'favorite'
  ): Promise<{ success: boolean; error?: string; data?: ParkingHistory[] }> {
    try {
      let query = supabase
        .from('user_parking_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching parking history:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getUserParkingHistory:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Sincronizează favoritele cu localStorage (pentru migrare)
   */
  static async syncWithLocalStorage(user: User): Promise<{ success: boolean; error?: string; syncedCount: number }> {
    try {
      const localFavorites = localStorage.getItem('myParkings');
      if (!localFavorites) {
        return { success: true, syncedCount: 0 };
      }

      const favorites = JSON.parse(localFavorites);
      let syncedCount = 0;

      for (const favorite of favorites) {
        if (favorite.status === 'favorite') {
          const result = await this.addToFavorites(user, {
            parking_spot_id: favorite.id,
            parking_name: favorite.name,
            parking_address: favorite.address,
            parking_type: favorite.type,
            price: favorite.price || 0,
            rating: favorite.rating || 4.0
          });

          if (result.success) {
            syncedCount++;
          }
        }
      }

      // Șterge localStorage după sincronizare
      localStorage.removeItem('myParkings');

      return { success: true, syncedCount };
    } catch (error) {
      console.error('Error in syncWithLocalStorage:', error);
      return { success: false, error: 'Eroare neașteptată', syncedCount: 0 };
    }
  }
} 