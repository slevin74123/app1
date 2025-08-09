// =====================================================
// TIPURI PENTRU FUNCȚIONALITĂȚILE DE COMUNITATE ȘI CHAT
// =====================================================

// =====================================================
// 1. POSTĂRI COMUNITATE (Community Feed)
// =====================================================

export interface CommunityPost {
  id: string;
  user_id: string;
  titlu?: string;
  continut: string;
  tip_postare: 'general' | 'problema' | 'recomandare' | 'alerta';
  locatie_nume?: string;
  locatie_adresa?: string;
  locatie_lat?: number;
  locatie_lng?: number;
  imagine_url?: string;
  likes_count: number;
  comentarii_count: number;
  share_count: number;
  is_verified: boolean;
  status: 'activ' | 'moderat' | 'sters';
  created_at: Date;
  updated_at: Date;
}

export interface PostUser {
  id: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  level: 'incepator' | 'bronze' | 'argint' | 'aur' | 'platinum';
}

export interface PostComment {
  id: string;
  user_id: string;
  postare_id: string;
  continut: string;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
  user?: PostUser;
}

export interface PostLike {
  id: string;
  user_id: string;
  postare_id: string;
  created_at: Date;
}

export interface PostFilter {
  tip_postare?: 'general' | 'problema' | 'recomandare' | 'alerta';
  locatie?: string;
  verified_only?: boolean;
  date_from?: Date;
  date_to?: Date;
}

export interface PostSort {
  field: 'created_at' | 'likes_count' | 'comentarii_count';
  direction: 'asc' | 'desc';
}

// =====================================================
// 2. CHAT LIVE (Live Chat)
// =====================================================

export interface ChatMessage {
  id: string;
  user_id: string;
  continut: string;
  tip_mesaj: 'text' | 'imagine' | 'locatie';
  imagine_url?: string;
  locatie_lat?: number;
  locatie_lng?: number;
  likes_count: number;
  is_edited: boolean;
  created_at: Date;
  updated_at: Date;
  user?: ChatUser;
}

export interface ChatUser {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  isOnline: boolean;
  status: 'online' | 'away' | 'offline';
  lastActivity: Date;
}

export interface OnlineUser {
  id: string;
  user_id: string;
  ultima_activitate: Date;
  status: 'online' | 'away' | 'offline';
  created_at: Date;
  user?: ChatUser;
}

export interface MessageLike {
  id: string;
  user_id: string;
  mesaj_id: string;
  created_at: Date;
}

export interface ChatFilter {
  user_id?: string;
  tip_mesaj?: 'text' | 'imagine' | 'locatie';
  date_from?: Date;
  date_to?: Date;
}

// =====================================================
// 3. UTILIZATORI ȘI PROFILURI
// =====================================================

export interface UserProfile {
  id: string;
  user_id: string;
  nume_complet: string;
  avatar_url?: string;
  bio?: string;
  locatie?: string;
  nivel_fidelitate: 'incepator' | 'bronze' | 'argint' | 'aur' | 'platinum';
  puncte_fidelitate: number;
  postari_count: number;
  sesiuni_count: number;
  este_verificat: boolean;
  data_inscriere: Date;
  ultima_activitate: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserStats {
  total_postari: number;
  total_like_uri: number;
  total_comentarii: number;
  sesiuni_parcare: number;
  ore_parcare: number;
  economii_total: number;
  nivel_activitate: 'scazut' | 'mediu' | 'ridicat' | 'foarte_ridicat';
}

// =====================================================
// 4. MODERARE ȘI SECURITATE
// =====================================================

export interface ModerationAction {
  id: string;
  moderator_id: string;
  target_type: 'post' | 'comment' | 'message' | 'user';
  target_id: string;
  action: 'warn' | 'hide' | 'delete' | 'ban';
  reason: string;
  duration?: number; // pentru ban-uri temporare
  created_at: Date;
}

export interface ReportContent {
  id: string;
  reporter_id: string;
  target_type: 'post' | 'comment' | 'message' | 'user';
  target_id: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'fake_news' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  moderator_id?: string;
  moderator_notes?: string;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 5. NOTIFICĂRI COMUNITATE
// =====================================================

export interface CommunityNotification {
  id: string;
  user_id: string;
  type: 'post_like' | 'post_comment' | 'comment_like' | 'user_mention' | 'community_alert' | 'moderation_action';
  title: string;
  message: string;
  data?: unknown;
  is_read: boolean;
  created_at: Date;
}

export interface NotificationSettings {
  user_id: string;
  post_likes: boolean;
  post_comments: boolean;
  user_mentions: boolean;
  community_alerts: boolean;
  moderation_updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

// =====================================================
// 6. FORM TYPES
// =====================================================

export interface CreatePostForm {
  titlu?: string;
  continut: string;
  tip_postare: 'general' | 'problema' | 'recomandare' | 'alerta';
  locatie_nume?: string;
  locatie_adresa?: string;
  locatie_lat?: number;
  locatie_lng?: number;
  imagine?: File;
}

export interface CreateCommentForm {
  postare_id: string;
  continut: string;
}

export interface SendMessageForm {
  continut: string;
  tip_mesaj: 'text' | 'imagine' | 'locatie';
  imagine?: File;
  locatie_lat?: number;
  locatie_lng?: number;
}

export interface ReportContentForm {
  target_type: 'post' | 'comment' | 'message' | 'user';
  target_id: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'fake_news' | 'other';
  description: string;
}

// =====================================================
// 7. API RESPONSES
// =====================================================

export interface CommunityApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

export interface PaginatedCommunityResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface RealTimeUpdate {
  type: 'post_created' | 'post_updated' | 'post_deleted' | 'comment_added' | 'like_added' | 'user_online' | 'user_offline';
  data: unknown;
  timestamp: Date;
}

// =====================================================
// 8. CONSTANTE ȘI ENUM-URI
// =====================================================

export const POST_TYPES = {
  GENERAL: 'general',
  PROBLEMA: 'problema',
  RECOMANDARE: 'recomandare',
  ALERTA: 'alerta'
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGINE: 'imagine',
  LOCATIE: 'locatie'
} as const;

export const USER_STATUS = {
  ONLINE: 'online',
  AWAY: 'away',
  OFFLINE: 'offline'
} as const;

export const MODERATION_ACTIONS = {
  WARN: 'warn',
  HIDE: 'hide',
  DELETE: 'delete',
  BAN: 'ban'
} as const;

export const REPORT_REASONS = {
  SPAM: 'spam',
  INAPPROPRIATE: 'inappropriate',
  HARASSMENT: 'harassment',
  FAKE_NEWS: 'fake_news',
  OTHER: 'other'
} as const;

// =====================================================
// 9. UTILITĂȚI
// =====================================================

export interface ContentModeration {
  isAppropriate: boolean;
  confidence: number;
  flags: string[];
  suggestedAction?: 'allow' | 'review' | 'block';
}

export interface UserActivity {
  postsToday: number;
  commentsToday: number;
  likesToday: number;
  totalActivity: number;
  lastActivity: Date;
}

export interface CommunityStats {
  totalUsers: number;
  onlineUsers: number;
  totalPosts: number;
  postsToday: number;
  totalComments: number;
  commentsToday: number;
  activeModerators: number;
}

// =====================================================
// 10. EXPORT TYPES
// =====================================================

// Toate tipurile sunt deja exportate individual mai sus 