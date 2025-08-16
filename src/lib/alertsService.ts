import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/supabase';

export interface ParkingAlert {
  id: string;
  user_id: string;
  parking_name: string;
  location: string;
  duration_minutes: number;
  max_price_per_hour: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertData {
  user_id: string;
  parking_name: string;
  location: string;
  duration_minutes: number;
  max_price_per_hour: number;
}

class AlertsService {
  private supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

  async createAlert(data: CreateAlertData): Promise<{ success: boolean; data?: ParkingAlert; error?: string }> {
    try {
      const { data: alert, error } = await this.supabase
        .from('parking_alerts')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating alert:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: alert };
    } catch (error) {
      console.error('Error creating alert:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  async getUserAlerts(userId: string): Promise<{ success: boolean; data?: ParkingAlert[]; error?: string }> {
    try {
      console.log('🔍 AlertsService: Încerc să încarc alertele pentru utilizatorul:', userId);
      
      const { data: alerts, error } = await this.supabase
        .from('parking_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ AlertsService: Eroare Supabase completă:', JSON.stringify(error, null, 2));
        console.error('❌ AlertsService: Cod eroare:', error.code);
        console.error('❌ AlertsService: Mesaj eroare:', error.message);
        console.error('❌ AlertsService: Detalii:', error.details);
        console.error('❌ AlertsService: Hint:', error.hint);
        return { success: false, error: error.message || 'Eroare Supabase necunoscută' };
      }

      console.log('✅ AlertsService: Alerte încărcate cu succes:', alerts?.length || 0);
      return { success: true, data: alerts };
    } catch (error) {
      console.error('❌ AlertsService: Eroare neașteptată:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  async updateAlertStatus(alertId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('parking_alerts')
        .update({ is_active: isActive })
        .eq('id', alertId);

      if (error) {
        console.error('Error updating alert status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating alert status:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  async deleteAlert(alertId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('parking_alerts')
        .delete()
        .eq('id', alertId);

      if (error) {
        console.error('Error deleting alert:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting alert:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  async getActiveAlertsCount(userId: string): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const { count, error } = await this.supabase
        .from('parking_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Error counting active alerts:', error);
        return { success: false, error: error.message };
      }

      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Error counting active alerts:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }
}

export const alertsService = new AlertsService();
export default alertsService; 