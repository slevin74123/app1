export interface Database {
  public: {
    Tables: {
      parking_locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          total_spots: number;
          available_spots: number;
          reserved_spots: number;
          occupied_spots: number;
          price_per_hour: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          total_spots: number;
          available_spots: number;
          reserved_spots: number;
          occupied_spots: number;
          price_per_hour: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          total_spots?: number;
          available_spots?: number;
          reserved_spots?: number;
          occupied_spots?: number;
          price_per_hour?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      parking_notifications: {
        Row: {
          id: string;
          user_id: string;
          parking_location_id: string;
          parking_name: string;
          duration: number;
          max_price: number;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          parking_location_id: string;
          parking_name: string;
          duration: number;
          max_price: number;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          parking_location_id?: string;
          parking_name?: string;
          duration?: number;
          max_price?: number;
          created_at?: string;
          is_active?: boolean;
        };
      };
    };
  };
}

export type ParkingLocation = Database['public']['Tables']['parking_locations']['Row'];
export type ParkingLocationInsert = Database['public']['Tables']['parking_locations']['Insert'];
export type ParkingLocationUpdate = Database['public']['Tables']['parking_locations']['Update'];

export type ParkingNotification = Database['public']['Tables']['parking_notifications']['Row'];
export type ParkingNotificationInsert = Database['public']['Tables']['parking_notifications']['Insert'];
export type ParkingNotificationUpdate = Database['public']['Tables']['parking_notifications']['Update']; 