// =====================================================
// SERVICIUL PENTRU FUNCȚIONALITĂȚILE DE PARCARE
// =====================================================

import { supabase } from '@/lib/supabase';
import { 
  ParkingSession, 
  ParkingStats, 
  ParkingSpot, 
  ParkingReservation,
  ParkingFilter,
  ParkingSort,
  CostCalculation,
  TimeRemaining,
  ApiResponse,
  PaginatedResponse
} from '@/types/parking';

// =====================================================
// 1. SESIUNI PARCARE (My Parking Sessions)
// =====================================================

export class ParkingService {
  
  // Obține toate sesiunile unui utilizator
  static async getUserSessions(userId: string): Promise<ApiResponse<ParkingSession[]>> {
    try {
      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Obține sesiunile active ale unui utilizator
  static async getActiveSessions(userId: string): Promise<ApiResponse<ParkingSession[]>> {
    try {
      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['activ', 'rezervat'])
        .order('data_inceput', { ascending: true });

      if (error) throw error;

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Creează o nouă sesiune de parcare
  static async createSession(sessionData: {
    user_id: string;
    parcare_id: string;
    data_inceput: Date;
    data_sfarsit: Date;
    cost_total: number;
    cost_pe_ora: number;
    ore_rezervate: number;
    locatie_nume: string;
    locatie_adresa: string;
    locatie_lat?: number;
    locatie_lng?: number;
  }): Promise<ApiResponse<ParkingSession | null>> {
    try {
      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Activează o sesiune rezervată
  static async activateSession(sessionId: string): Promise<ApiResponse<ParkingSession | null>> {
    try {
      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .update({ 
          status: 'activ',
          data_activare: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Oprește o sesiune activă
  static async stopSession(sessionId: string): Promise<ApiResponse<ParkingSession | null>> {
    try {
      const now = new Date();
      
      // Calculează orele utilizate
      const session = await this.getSessionById(sessionId);
      if (!session.success || !session.data) {
        throw new Error('Sesiunea nu a fost găsită');
      }

      const startTime = new Date(session.data.data_activare || session.data.data_inceput);
      const hoursUsed = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .update({ 
          status: 'finalizat',
          data_sfarsit: now.toISOString(),
          ore_utilizate: Math.max(0, hoursUsed)
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Prelungește timpul unei sesiuni
  static async extendSession(sessionId: string, additionalHours: number): Promise<ApiResponse<ParkingSession | null>> {
    try {
      const session = await this.getSessionById(sessionId);
      if (!session.success || !session.data) {
        throw new Error('Sesiunea nu a fost găsită');
      }

      const newEndTime = new Date(session.data.data_sfarsit);
      newEndTime.setHours(newEndTime.getHours() + additionalHours);

      const additionalCost = additionalHours * session.data.cost_pe_ora;

      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .update({ 
          data_sfarsit: newEndTime.toISOString(),
          ore_rezervate: session.data.ore_rezervate + additionalHours,
          cost_total: session.data.cost_total + additionalCost
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Obține o sesiune după ID
  static async getSessionById(sessionId: string): Promise<ApiResponse<ParkingSession | null>> {
    try {
      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // =====================================================
  // 2. STATISTICI UTILIZATOR
  // =====================================================

  // Obține statisticile unui utilizator
  static async getUserStats(userId: string): Promise<ApiResponse<ParkingStats | null>> {
    try {
      const { data, error } = await supabase
        .from('statistici_utilizatori')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Actualizează statisticile unui utilizator
  static async updateUserStats(userId: string, stats: Partial<ParkingStats>): Promise<ApiResponse<ParkingStats | null>> {
    try {
      const { data, error } = await supabase
        .from('statistici_utilizatori')
        .upsert({
          user_id: userId,
          ...stats,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // =====================================================
  // 3. PARCĂRI DISPONIBILE
  // =====================================================

  // Obține toate parcările disponibile
  static async getAvailableParking(
    filters?: ParkingFilter,
    sort?: ParkingSort,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<ParkingSpot>>> {
    try {
      let query = supabase
        .from('parcari_raportate')
        .select('*', { count: 'exact' });

      // Aplică filtrele
      if (filters) {
        if (filters.availability !== undefined) {
          query = query.eq('disponibilitate', filters.availability);
        }
        if (filters.maxPrice) {
          query = query.lte('pret_pe_ora', filters.maxPrice);
        }
        if (filters.minRating) {
          query = query.gte('rating', filters.minRating);
        }
        if (filters.maxDistance) {
          query = query.lte('distanta_km', filters.maxDistance);
        }
      }

      // Aplică sortarea
      if (sort) {
        const sortField = sort.field === 'distance' ? 'distanta_km' : 
                         sort.field === 'price' ? 'pret_pe_ora' :
                         sort.field === 'rating' ? 'rating' : 'disponibilitate';
        query = query.order(sortField, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('distanta_km', { ascending: true });
      }

      // Aplică paginarea
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          hasMore: (count || 0) > (page * limit)
        },
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: {
          data: [],
          total: 0,
          page,
          limit,
          hasMore: false
        },
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Obține o parcare după ID
  static async getParkingById(parkingId: string): Promise<ApiResponse<ParkingSpot | null>> {
    try {
      const { data, error } = await supabase
        .from('parcari_raportate')
        .select('*')
        .eq('id', parkingId)
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // =====================================================
  // 4. REZERVĂRI
  // =====================================================

  // Creează o rezervare
  static async createReservation(reservationData: {
    parking_id: string;
    user_id: string;
    duration: number;
    start_time: Date;
    total_cost: number;
  }): Promise<ApiResponse<ParkingReservation | null>> {
    try {
      const endTime = new Date(reservationData.start_time);
      endTime.setHours(endTime.getHours() + reservationData.duration);

      const { data, error } = await supabase
        .from('sesiuni_parcare')
        .insert([{
          user_id: reservationData.user_id,
          parcare_id: reservationData.parking_id,
          status: 'rezervat',
          data_inceput: reservationData.start_time.toISOString(),
          data_sfarsit: endTime.toISOString(),
          cost_total: reservationData.total_cost,
          cost_pe_ora: reservationData.total_cost / reservationData.duration,
          ore_rezervate: reservationData.duration,
          locatie_nume: '', // Va fi populat din parcare
          locatie_adresa: '' // Va fi populat din parcare
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        data: data as ParkingReservation,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // =====================================================
  // 5. UTILITĂȚI ȘI CALCULE
  // =====================================================

  // Calculează timpul rămas pentru o sesiune
  static calculateTimeRemaining(endTime: Date): TimeRemaining {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        formatted: 'Expirat'
      };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
      isExpired: false,
      formatted: `${hours}h ${minutes}m ${seconds}s`
    };
  }

  // Calculează costul cu reduceri
  static calculateCost(
    baseCost: number,
    hours: number,
    userLevel: 'incepator' | 'bronze' | 'argint' | 'aur' | 'platinum',
    freeHoursAvailable: number = 0
  ): CostCalculation {
    const totalBaseCost = baseCost * hours;
    
    // Aplică reducerile bazate pe nivel
    let discountPercentage = 0;
    switch (userLevel) {
      case 'bronze': discountPercentage = 5; break;
      case 'argint': discountPercentage = 10; break;
      case 'aur': discountPercentage = 15; break;
      case 'platinum': discountPercentage = 20; break;
    }

    const discount = (totalBaseCost * discountPercentage) / 100;
    
    // Aplică orele gratuite
    const freeHoursUsed = Math.min(freeHoursAvailable, hours);
    const freeHoursDiscount = freeHoursUsed * baseCost;
    
    const totalDiscount = discount + freeHoursDiscount;
    const finalCost = Math.max(0, totalBaseCost - totalDiscount);

    return {
      baseCost: totalBaseCost,
      discount: totalDiscount,
      finalCost,
      savings: totalDiscount,
      freeHoursUsed
    };
  }

  // =====================================================
  // 6. NOTIFICĂRI
  // =====================================================

  // Trimite notificare pentru sesiune care expiră
  static async sendSessionExpiryNotification(sessionId: string): Promise<void> {
    try {
      const session = await this.getSessionById(sessionId);
      if (!session.success || !session.data) return;

      const timeRemaining = this.calculateTimeRemaining(new Date(session.data.data_sfarsit));
      
      if (timeRemaining.hours <= 1 && !timeRemaining.isExpired) {
        // Trimite notificare
        console.log(`Notificare: Sesiunea ${sessionId} expiră în ${timeRemaining.formatted}`);
      }
    } catch (error) {
      console.error('Eroare la trimiterea notificării:', error);
    }
  }
}

export default ParkingService; 