import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/supabase';

export interface ActivityItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  action_type: 'parking_reported' | 'community_update' | 'parking_reserved' | 'alert_created' | 'chat_message';
  location: string;
  details?: string;
  created_at: string;
  metadata?: any;
}

export interface CreateActivityData {
  user_id: string;
  action_type: ActivityItem['action_type'];
  location: string;
  details?: string;
  metadata?: any;
}

class ActivityService {
  private supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

  async createActivity(data: CreateActivityData): Promise<{ success: boolean; data?: ActivityItem; error?: string }> {
    try {
      const { data: activity, error } = await this.supabase
        .from('user_activities')
        .insert([{
          user_id: data.user_id,
          action_type: data.action_type,
          location: data.location,
          details: data.details,
          metadata: data.metadata
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating activity:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: activity };
    } catch (error) {
      console.error('Error creating activity:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  async getRecentActivities(limit: number = 10): Promise<{ success: boolean; data?: ActivityItem[]; error?: string }> {
    try {
      console.log('🔍 ActivityService: Încerc să încarc activitățile recente...');
      
      // Simplificat - fără JOIN complex
      const { data: activities, error } = await this.supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ ActivityService: Eroare Supabase completă:', JSON.stringify(error, null, 2));
        console.error('❌ ActivityService: Cod eroare:', error.code);
        console.error('❌ ActivityService: Mesaj eroare:', error.message);
        console.error('❌ ActivityService: Detalii:', error.details);
        console.error('❌ ActivityService: Hint:', error.hint);
        return { success: false, error: error.message || 'Eroare Supabase necunoscută' };
      }

      console.log('✅ ActivityService: Activități încărcate cu succes:', activities?.length || 0);

      // Transform data - fără user_profiles
      const transformedActivities = activities?.map(activity => ({
        ...activity,
        user_name: 'Utilizator', // Placeholder - va fi înlocuit când avem user_profiles
        user_avatar: undefined
      })) || [];

      return { success: true, data: transformedActivities };
    } catch (error) {
      console.error('❌ ActivityService: Eroare neașteptată:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  async getUserActivities(userId: string, limit: number = 20): Promise<{ success: boolean; data?: ActivityItem[]; error?: string }> {
    try {
      const { data: activities, error } = await this.supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user activities:', error);
        return { success: false, error: error.message };
      }

      // Transform data - fără user_profiles
      const transformedActivities = activities?.map(activity => ({
        ...activity,
        user_name: 'Utilizator', // Placeholder
        user_avatar: undefined
      })) || [];

      return { success: true, data: transformedActivities };
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  // Helper methods for specific activity types
  async reportParkingActivity(userId: string, location: string, details?: string): Promise<{ success: boolean; error?: string }> {
    return this.createActivity({
      user_id: userId,
      action_type: 'parking_reported',
      location,
      details
    });
  }

  async communityUpdateActivity(userId: string, location: string, details?: string): Promise<{ success: boolean; error?: string }> {
    return this.createActivity({
      user_id: userId,
      action_type: 'community_update',
      location,
      details
    });
  }

  async parkingReservedActivity(userId: string, location: string, details?: string): Promise<{ success: boolean; error?: string }> {
    return this.createActivity({
      user_id: userId,
      action_type: 'parking_reserved',
      location,
      details
    });
  }

  async alertCreatedActivity(userId: string, location: string, details?: string): Promise<{ success: boolean; error?: string }> {
    return this.createActivity({
      user_id: userId,
      action_type: 'alert_created',
      location,
      details
    });
  }

  async chatMessageActivity(userId: string, location: string, details?: string): Promise<{ success: boolean; error?: string }> {
    return this.createActivity({
      user_id: userId,
      action_type: 'chat_message',
      location,
      details
    });
  }
}

export const activityService = new ActivityService();
export default activityService; 