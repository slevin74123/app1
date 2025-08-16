import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/supabase';

export interface ParkingNotification {
  id: string;
  user_id: string;
  parking_location_id: string;
  parking_name: string;
  duration: number; // în minute
  max_price: number; // în RON/oră
  created_at: string;
  is_active: boolean;
}

export interface NotificationMatch {
  notification_id: string;
  parking_location_id: string;
  parking_name: string;
  user_id: string;
  duration: number;
  max_price: number;
  spot_reported_at: string;
}

export class NotificationService {
  // Singleton pattern pentru a evita multiplele instanțe GoTrueClient
  private static supabaseClient: ReturnType<typeof createClient> | null = null;
  
  private static getSupabaseClient() {
    if (!this.supabaseClient) {
      this.supabaseClient = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
    }
    return this.supabaseClient;
  }

  // Creează o notificare pentru un utilizator care caută parcare
  static async createParkingNotification(
    userId: string,
    parkingLocationId: string,
    parkingName: string,
    duration: number,
    maxPrice: number
  ): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      
      const { data, error } = await supabase
        .from('parking_notifications')
        .insert({
          user_id: userId,
          parking_location_id: parkingLocationId,
          parking_name: parkingName,
          duration: duration,
          max_price: maxPrice,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, id: data.id as string };
    } catch (error) {
      console.error('Error creating parking notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Verifică dacă un loc liber raportat se potrivește cu notificările active
  static async checkNotificationMatches(
    parkingLocationId: string,
    reportedPrice: number
  ): Promise<{ success: boolean; matches?: NotificationMatch[]; error?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      
      const { data, error } = await supabase
        .from('parking_notifications')
        .select(`
          id,
          user_id,
          parking_location_id,
          parking_name,
          duration,
          max_price,
          created_at
        `)
        .eq('parking_location_id', parkingLocationId)
        .eq('is_active', true)
        .lte('max_price', reportedPrice);

      if (error) throw error;

      const matches: NotificationMatch[] = (data || []).map(notification => ({
        notification_id: notification.id as string,
        parking_location_id: notification.parking_location_id as string,
        parking_name: notification.parking_name as string,
        user_id: notification.user_id as string,
        duration: notification.duration as number,
        max_price: notification.max_price as number,
        spot_reported_at: new Date().toISOString()
      }));

      return { success: true, matches };
    } catch (error) {
      console.error('Error checking notification matches:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Marchează o notificare ca inactivă după ce a fost procesată
  static async deactivateNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      
      const { error } = await supabase
        .from('parking_notifications')
        .update({ is_active: false })
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deactivating notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Obține toate notificările active pentru un utilizator
  static async getUserActiveNotifications(userId: string): Promise<{ success: boolean; notifications?: ParkingNotification[]; error?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      
      const { data, error } = await supabase
        .from('parking_notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notifications: ParkingNotification[] = (data || []).map(item => ({
        id: item.id as string,
        user_id: item.user_id as string,
        parking_location_id: item.parking_location_id as string,
        parking_name: item.parking_name as string,
        duration: item.duration as number,
        max_price: item.max_price as number,
        created_at: item.created_at as string,
        is_active: item.is_active as boolean
      }));

      return { success: true, notifications };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Șterge o notificare
  static async deleteNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      
      const { error } = await supabase
        .from('parking_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Dezactivează o notificare (marchează ca inactivă)
  static async deactivateParkingNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = this.getSupabaseClient();
      
      const { error } = await supabase
        .from('parking_notifications')
        .update({ is_active: false })
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deactivating notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
} 