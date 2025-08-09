// =====================================================
// SERVICIUL PENTRU FUNCȚIONALITĂȚILE DE COMUNITATE ȘI CHAT
// =====================================================

import { supabase } from '@/lib/supabase';
import { 
  CommunityPost, 
  PostComment, 
  PostLike, 
  ChatMessage, 
  OnlineUser,
  UserProfile,
  CommunityApiResponse,
  PaginatedCommunityResponse,
  RealTimeUpdate,
  CreatePostForm,
  CreateCommentForm,
  SendMessageForm,
  MessageLike
} from '@/types/community';

// =====================================================
// 1. POSTĂRI COMUNITATE (Community Feed)
// =====================================================

export class CommunityService {
  
  // Obține toate postările
  static async getPosts(
    page: number = 1,
    limit: number = 20,
    filters?: {
      tip_postare?: 'general' | 'problema' | 'recomandare' | 'alerta';
      verified_only?: boolean;
    }
  ): Promise<CommunityApiResponse<PaginatedCommunityResponse<CommunityPost>>> {
    try {
      let query = supabase
        .from('postari_comunitate')
        .select(`
          *,
          user:user_id(
            id,
            email,
            user_metadata
          )
        `, { count: 'exact' })
        .eq('status', 'activ');

      // Aplică filtrele
      if (filters) {
        if (filters.tip_postare) {
          query = query.eq('tip_postare', filters.tip_postare);
        }
        if (filters.verified_only) {
          query = query.eq('is_verified', true);
        }
      }

      // Sortare după data creării
      query = query.order('created_at', { ascending: false });

      // Paginare
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

  // Creează o nouă postare
  static async createPost(postData: CreatePostForm, userId: string): Promise<CommunityApiResponse<CommunityPost | null>> {
    try {
      const postPayload = {
        user_id: userId,
        titlu: postData.titlu,
        continut: postData.continut,
        tip_postare: postData.tip_postare,
        locatie_nume: postData.locatie_nume,
        locatie_adresa: postData.locatie_adresa,
        locatie_lat: postData.locatie_lat,
        locatie_lng: postData.locatie_lng,
        imagine_url: postData.imagine ? await this.uploadImage(postData.imagine) : null,
        likes_count: 0,
        comentarii_count: 0,
        share_count: 0,
        is_verified: false,
        status: 'activ'
      };

      const { data, error } = await supabase
        .from('postari_comunitate')
        .insert([postPayload])
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

  // Adaugă like la o postare
  static async likePost(postId: string, userId: string): Promise<CommunityApiResponse<PostLike | null>> {
    try {
      // Verifică dacă utilizatorul a dat deja like
      const { data: existingLike } = await supabase
        .from('like_uri_postari')
        .select('*')
        .eq('postare_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Șterge like-ul existent
        const { error } = await supabase
          .from('like_uri_postari')
          .delete()
          .eq('postare_id', postId)
          .eq('user_id', userId);

        if (error) throw error;

        // Actualizează numărul de like-uri
        await supabase
          .from('postari_comunitate')
          .update({ likes_count: supabase.rpc('decrement') })
          .eq('id', postId);

        return {
          data: null,
          error: null,
          success: true
        };
      } else {
        // Adaugă like-ul
        const { data, error } = await supabase
          .from('like_uri_postari')
          .insert([{
            postare_id: postId,
            user_id: userId
          }])
          .select()
          .single();

        if (error) throw error;

        // Actualizează numărul de like-uri
        await supabase
          .from('postari_comunitate')
          .update({ likes_count: supabase.rpc('increment') })
          .eq('id', postId);

        return {
          data,
          error: null,
          success: true
        };
      }
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // Adaugă comentariu la o postare
  static async addComment(commentData: CreateCommentForm, userId: string): Promise<CommunityApiResponse<PostComment | null>> {
    try {
      const { data, error } = await supabase
        .from('comentarii_postari')
        .insert([{
          user_id: userId,
          postare_id: commentData.postare_id,
          continut: commentData.continut,
          likes_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Actualizează numărul de comentarii
      await supabase
        .from('postari_comunitate')
        .update({ comentarii_count: supabase.rpc('increment') })
        .eq('id', commentData.postare_id);

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

  // Obține comentariile unei postări
  static async getPostComments(postId: string): Promise<CommunityApiResponse<PostComment[]>> {
    try {
      const { data, error } = await supabase
        .from('comentarii_postari')
        .select(`
          *,
          user:user_id(
            id,
            email,
            user_metadata
          )
        `)
        .eq('postare_id', postId)
        .order('created_at', { ascending: true });

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

  // =====================================================
  // 2. CHAT LIVE (Live Chat)
  // =====================================================

  // Obține mesajele chat-ului
  static async getChatMessages(limit: number = 50): Promise<CommunityApiResponse<ChatMessage[]>> {
    try {
      const { data, error } = await supabase
        .from('mesaje_chat')
        .select(`
          *,
          user:user_id(
            id,
            email,
            user_metadata
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        data: (data || []).reverse(), // Inversează pentru a afișa cronologic
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

  // Trimite un mesaj în chat
  static async sendMessage(messageData: SendMessageForm, userId: string): Promise<CommunityApiResponse<ChatMessage | null>> {
    try {
      const messagePayload = {
        user_id: userId,
        continut: messageData.continut,
        tip_mesaj: messageData.tip_mesaj,
        imagine_url: messageData.imagine ? await this.uploadImage(messageData.imagine) : null,
        locatie_lat: messageData.locatie_lat,
        locatie_lng: messageData.locatie_lng,
        likes_count: 0,
        is_edited: false
      };

      const { data, error } = await supabase
        .from('mesaje_chat')
        .insert([messagePayload])
        .select(`
          *,
          user:user_id(
            id,
            email,
            user_metadata
          )
        `)
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

  // Adaugă like la un mesaj
  static async likeMessage(messageId: string, userId: string): Promise<CommunityApiResponse<MessageLike | null>> {
    try {
      // Verifică dacă utilizatorul a dat deja like
      const { data: existingLike } = await supabase
        .from('like_uri_mesaje')
        .select('*')
        .eq('mesaj_id', messageId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Șterge like-ul existent
        const { error } = await supabase
          .from('like_uri_mesaje')
          .delete()
          .eq('mesaj_id', messageId)
          .eq('user_id', userId);

        if (error) throw error;

        // Actualizează numărul de like-uri
        await supabase
          .from('mesaje_chat')
          .update({ likes_count: supabase.rpc('decrement') })
          .eq('id', messageId);

        return {
          data: null,
          error: null,
          success: true
        };
      } else {
        // Adaugă like-ul
        const { data, error } = await supabase
          .from('like_uri_mesaje')
          .insert([{
            mesaj_id: messageId,
            user_id: userId
          }])
          .select()
          .single();

        if (error) throw error;

        // Actualizează numărul de like-uri
        await supabase
          .from('mesaje_chat')
          .update({ likes_count: supabase.rpc('increment') })
          .eq('id', messageId);

        return {
          data,
          error: null,
          success: true
        };
      }
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message,
        success: false
      };
    }
  }

  // =====================================================
  // 3. UTILIZATORI ONLINE
  // =====================================================

  // Obține utilizatorii online
  static async getOnlineUsers(): Promise<CommunityApiResponse<OnlineUser[]>> {
    try {
      const { data, error } = await supabase
        .from('utilizatori_online')
        .select(`
          *,
          user:user_id(
            id,
            email,
            user_metadata
          )
        `)
        .eq('status', 'online')
        .order('ultima_activitate', { ascending: false });

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

  // Actualizează statusul utilizatorului
  static async updateUserStatus(userId: string, status: 'online' | 'away' | 'offline'): Promise<CommunityApiResponse<OnlineUser | null>> {
    try {
      const { data, error } = await supabase
        .from('utilizatori_online')
        .upsert({
          user_id: userId,
          status,
          ultima_activitate: new Date().toISOString()
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
  // 4. PROFILURI UTILIZATORI
  // =====================================================

  // Obține profilul unui utilizator
  static async getUserProfile(userId: string): Promise<CommunityApiResponse<UserProfile | null>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
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

  // Actualizează profilul utilizatorului
  static async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<CommunityApiResponse<UserProfile | null>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
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
  // 5. UTILITĂȚI
  // =====================================================

  // Upload imagine pentru postări/mesaje
  static async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `community/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Eroare la upload imagine:', error);
      throw error;
    }
  }

  // Formatează timpul relativ
  static formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'acum';
    if (minutes < 60) return `acum ${minutes} min`;
    if (hours < 24) return `acum ${hours} ore`;
    if (days < 7) return `acum ${days} zile`;
    
    return date.toLocaleDateString('ro-RO');
  }

  // Generează inițialele din nume
  static generateInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // =====================================================
  // 6. REAL-TIME UPDATES
  // =====================================================

  // Abonează-te la actualizări în timp real
  static subscribeToRealtimeUpdates(callback: (update: RealTimeUpdate) => void) {
    // Postări noi
    supabase
      .channel('community_posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'postari_comunitate' },
        (payload) => {
          callback({
            type: 'post_created',
            data: payload.new,
            timestamp: new Date()
          });
        }
      )
      .subscribe();

    // Mesaje noi
    supabase
      .channel('chat_messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mesaje_chat' },
        (payload) => {
          callback({
            type: 'post_created',
            data: payload.new,
            timestamp: new Date()
          });
        }
      )
      .subscribe();

    // Utilizatori online
    supabase
      .channel('online_users')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'utilizatori_online' },
        (payload) => {
          callback({
            type: payload.eventType === 'INSERT' ? 'user_online' : 'user_offline',
            data: payload.new,
            timestamp: new Date()
          });
        }
      )
      .subscribe();
  }
}

export default CommunityService; 