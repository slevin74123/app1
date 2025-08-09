// =====================================================
// TIPURI PENTRU FUNCȚIONALITĂȚILE DE PARCARE
// =====================================================

// =====================================================
// 1. SESIUNI PARCARE (My Parking Sessions)
// =====================================================

export interface ParkingSession {
  id: string;
  user_id: string;
  parcare_id: string;
  status: 'rezervat' | 'activ' | 'finalizat' | 'anulat';
  data_inceput: Date;
  data_sfarsit: Date;
  data_activare?: Date;
  cost_total: number;
  cost_pe_ora: number;
  ore_rezervate: number;
  ore_utilizate: number;
  locatie_nume: string;
  locatie_adresa: string;
  locatie_lat?: number;
  locatie_lng?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ParkingStats {
  total_ore_parcare: number;
  total_cost_parcare: number;
  total_economii: number;
  sesiuni_completate: number;
  sesiuni_active: number;
  ore_gratuite_ramase: number;
  nivel_fidelitate: 'incepator' | 'bronze' | 'argint' | 'aur' | 'platinum';
  puncte_fidelitate: number;
}

export interface StatsCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

// =====================================================
// 2. PARCĂRI DISPONIBILE (Available Parking)
// =====================================================

export interface ParkingSpot {
  id: string;
  nume: string;
  adresa: string;
  rating: number;
  numar_recenzii: number;
  disponibilitate: boolean;
  garaj: boolean;
  acoperit: boolean;
  securitate: boolean;
  pret_pe_ora: number;
  distanta_km: number;
  timp_mers_minute: number;
  lat: number;
  lng: number;
  locuri_disponibile: number;
  locuri_indisponibile: number;
  locuri_total: number;
  created_at: Date;
  updated_at: Date;
}

export interface ParkingReservation {
  id: string;
  parking_id: string;
  user_id: string;
  duration: number; // ore
  start_time: Date;
  end_time: Date;
  total_cost: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  created_at: Date;
}

export interface ParkingFilter {
  maxDistance?: number;
  maxPrice?: number;
  minRating?: number;
  features?: string[];
  availability?: boolean;
}

export interface ParkingSort {
  field: 'distance' | 'price' | 'rating' | 'availability';
  direction: 'asc' | 'desc';
}

// =====================================================
// 3. HARTA PRINCIPALĂ (Main Map)
// =====================================================

export interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  viewMode: 'map' | 'satellite';
  showUserLocation: boolean;
  showParkingSpots: boolean;
  showProblems: boolean;
}

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  type: 'parking' | 'user' | 'problem' | 'session';
  data: ParkingSpot | UserLocation | ProblemReport | ParkingSession;
  icon?: string;
  title: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}

// =====================================================
// 4. RAPORTĂRI PROBLEME (Report Problems)
// =====================================================

export interface ProblemReport {
  id: string;
  user_id: string;
  tip_problema: 'parcare_ilegala' | 'masina_abandonata' | 'contor_stricat' | 'zona_interzisa' | 'alte_probleme';
  titlu: string;
  descriere: string;
  locatie_nume?: string;
  locatie_adresa: string;
  locatie_lat?: number;
  locatie_lng?: number;
  imagine_url?: string;
  status: 'nou' | 'in_procesare' | 'rezolvat' | 'respins';
  prioritate: 'scazuta' | 'medie' | 'ridicata' | 'urgenta';
  raspuns_admin?: string;
  data_raspuns?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ProblemType {
  value: string;
  label: string;
  icon: string;
  description: string;
  priority: 'scazuta' | 'medie' | 'ridicata' | 'urgenta';
}

// =====================================================
// 5. ECONOMII ȘI FIDELITATE
// =====================================================

export interface UserStatistics {
  id: string;
  user_id: string;
  total_ore_parcare: number;
  total_cost_parcare: number;
  total_economii: number;
  sesiuni_completate: number;
  sesiuni_active: number;
  ore_gratuite_ramase: number;
  nivel_fidelitate: 'incepator' | 'bronze' | 'argint' | 'aur' | 'platinum';
  puncte_fidelitate: number;
  created_at: Date;
  updated_at: Date;
}

export interface Promotion {
  id: string;
  user_id: string;
  tip_promotie: 'prima_parcare' | 'ore_gratuite' | 'reducere_procent' | 'cashback' | 'bonus_fidelitate';
  descriere: string;
  valoare_economie: number;
  procent_reducere?: number;
  ore_gratuite?: number;
  este_activ: boolean;
  data_activare?: Date;
  data_expirare?: Date;
  este_utilizat: boolean;
  data_utilizare?: Date;
  created_at: Date;
}

export interface LoyaltyLevel {
  name: 'incepator' | 'bronze' | 'argint' | 'aur' | 'platinum';
  minPoints: number;
  discountPercentage: number;
  freeHours: number;
  benefits: string[];
  color: string;
}

// =====================================================
// 6. UTILITĂȚI ȘI CALCULE
// =====================================================

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export interface CostCalculation {
  baseCost: number;
  discount: number;
  finalCost: number;
  savings: number;
  freeHoursUsed: number;
}

export interface DistanceCalculation {
  distance: number; // km
  walkingTime: number; // minute
  drivingTime: number; // minute
  formattedDistance: string;
  formattedWalkingTime: string;
}

// =====================================================
// 7. API RESPONSES
// =====================================================

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

// =====================================================
// 8. FORM TYPES
// =====================================================

export interface ParkingSessionForm {
  parking_id: string;
  duration: number;
  start_time: Date;
  notes?: string;
}

export interface ProblemReportForm {
  tip_problema: string;
  titlu: string;
  descriere: string;
  locatie_adresa: string;
  locatie_lat?: number;
  locatie_lng?: number;
  imagine?: File;
}

export interface ParkingFilterForm {
  maxDistance: number;
  maxPrice: number;
  minRating: number;
  features: string[];
  availability: boolean;
}

// =====================================================
// 9. NOTIFICĂRI
// =====================================================

export interface Notification {
  id: string;
  user_id: string;
  type: 'session_expiring' | 'session_started' | 'promotion' | 'problem_resolved' | 'community_alert';
  title: string;
  message: string;
  data?: unknown;
  is_read: boolean;
  created_at: Date;
}

// =====================================================
// 10. EXPORT TYPES
// =====================================================

// Toate tipurile sunt deja exportate individual mai sus 