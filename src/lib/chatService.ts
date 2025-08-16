import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  message: string;
  message_type: 'text' | 'info' | 'warning' | 'tip';
  is_edited: boolean;
  edited_at?: string;
  likes_count: number;
  heart_count: number;
  laugh_count: number;
  wow_count: number;
  sad_count: number;
  angry_count: number;
  created_at: string;
  updated_at: string;
}

export interface OnlineUser {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  last_seen: string;
  is_typing: boolean;
  typing_started_at?: string;
}

export interface CreateMessageData {
  message: string;
  message_type: 'text' | 'info' | 'warning' | 'tip';
}

export type ReactionType = 'like' | 'heart' | 'laugh' | 'wow' | 'sad' | 'angry';

export class ChatService {
  /**
   * Obține toate mesajele de chat cu reacții
   */
  static async getChatMessages(): Promise<{ success: boolean; error?: string; data?: ChatMessage[] }> {
    try {
      // Obține mesajele
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching chat messages:', messagesError);
        return { success: false, error: messagesError.message };
      }

      // Obține reacțiile pentru fiecare mesaj
      const messagesWithReactions: ChatMessage[] = [];
      
      for (const message of messages || []) {
        const { data: reactions } = await supabase
          .from('message_reactions')
          .select('reaction_type')
          .eq('message_id', message.id);

        const messageWithReactions: ChatMessage = {
          id: message.id,
          user_id: message.user_id,
          user_name: message.user_name,
          user_avatar: message.user_avatar,
          message: message.message,
          message_type: message.message_type,
          is_edited: message.is_edited,
          edited_at: message.edited_at,
          likes_count: reactions?.filter(r => r.reaction_type === 'like').length || 0,
          heart_count: reactions?.filter(r => r.reaction_type === 'heart').length || 0,
          laugh_count: reactions?.filter(r => r.reaction_type === 'laugh').length || 0,
          wow_count: reactions?.filter(r => r.reaction_type === 'wow').length || 0,
          sad_count: reactions?.filter(r => r.reaction_type === 'sad').length || 0,
          angry_count: reactions?.filter(r => r.reaction_type === 'angry').length || 0,
          created_at: message.created_at,
          updated_at: message.updated_at
        };

        messagesWithReactions.push(messageWithReactions);
      }

      return { success: true, data: messagesWithReactions };
    } catch (error) {
      console.error('Error in getChatMessages:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Creează un nou mesaj de chat
   */
  static async createMessage(
    user: User,
    messageData: CreateMessageData
  ): Promise<{ success: boolean; error?: string; data?: ChatMessage }> {
    try {
      // Obține numele utilizatorului din metadata
      const userName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'Utilizator';

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          user_name: userName,
          user_avatar: user.user_metadata?.avatar_url,
          message: messageData.message,
          message_type: messageData.message_type
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating message:', error);
        return { success: false, error: error.message };
      }

      // Convert to ChatMessage format
      const chatMessage: ChatMessage = {
        id: data.id,
        user_id: data.user_id,
        user_name: data.user_name,
        user_avatar: data.user_avatar,
        message: data.message,
        message_type: data.message_type,
        is_edited: data.is_edited,
        edited_at: data.edited_at,
        likes_count: 0,
        heart_count: 0,
        laugh_count: 0,
        wow_count: 0,
        sad_count: 0,
        angry_count: 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return { success: true, data: chatMessage };
    } catch (error) {
      console.error('Error in createMessage:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Editează un mesaj existent
   */
  static async editMessage(
    user: User,
    messageId: string,
    newMessage: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({
          message: newMessage,
          is_edited: true,
          edited_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error editing message:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in editMessage:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Șterge un mesaj (doar pentru utilizatorul care l-a creat)
   */
  static async deleteMessage(
    user: User,
    messageId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting message:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Adaugă/actualizează o reacție la un mesaj
   */
  static async toggleReaction(
    user: User,
    messageId: string,
    reactionType: ReactionType
  ): Promise<{ success: boolean; error?: string; newReactionType?: string }> {
    try {
      // Verifică dacă există deja o reacție
      const { data: existingReaction } = await supabase
        .from('message_reactions')
        .select('reaction_type')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .single();

      if (existingReaction) {
        if (existingReaction.reaction_type === reactionType) {
          // Dacă aceeași reacție, o șterge
          const { error } = await supabase
            .from('message_reactions')
            .delete()
            .eq('message_id', messageId)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error removing reaction:', error);
            return { success: false, error: error.message };
          }

          return { success: true, newReactionType: undefined };
        } else {
          // Dacă reacție diferită, o actualizează
          const { error } = await supabase
            .from('message_reactions')
            .update({ reaction_type: reactionType })
            .eq('message_id', messageId)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error updating reaction:', error);
            return { success: false, error: error.message };
          }

          return { success: true, newReactionType: reactionType };
        }
      } else {
        // Dacă nu există reacție, o creează
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction_type: reactionType
          });

        if (error) {
          console.error('Error creating reaction:', error);
          return { success: false, error: error.message };
        }

        return { success: true, newReactionType: reactionType };
      }
    } catch (error) {
      console.error('Error in toggleReaction:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține utilizatorii online
   */
  static async getOnlineUsers(): Promise<{ success: boolean; error?: string; data?: OnlineUser[] }> {
    try {
      const { data, error } = await supabase
        .from('chat_online_users')
        .select('*')
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Ultimele 5 minute
        .order('last_seen', { ascending: false });

      if (error) {
        console.error('Error fetching online users:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getOnlineUsers:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Actualizează statusul online al unui utilizator
   */
  static async updateOnlineStatus(
    user: User
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Obține numele utilizatorului din metadata
      const userName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'Utilizator';

      const { error } = await supabase
        .from('chat_online_users')
        .upsert({
          user_id: user.id,
          user_name: userName,
          user_avatar: user.user_metadata?.avatar_url,
          last_seen: new Date().toISOString(),
          is_typing: false,
          typing_started_at: null
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating online status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateOnlineStatus:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Setează statusul de typing
   */
  static async setTypingStatus(
    user: User,
    isTyping: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('chat_online_users')
        .update({
          is_typing: isTyping,
          typing_started_at: isTyping ? new Date().toISOString() : null,
          last_seen: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error setting typing status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in setTypingStatus:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține reacția unui utilizator la un mesaj specific
   */
  static async getUserReactionForMessage(
    messageId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string; data?: { reaction_type: string }[] }> {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('reaction_type')
        .eq('message_id', messageId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user reaction:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getUserReactionForMessage:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține mesajele unui utilizator specific
   */
  static async getUserMessages(userId: string): Promise<{ success: boolean; error?: string; data?: ChatMessage[] }> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user messages:', error);
        return { success: false, error: error.message };
      }

      // Convert to ChatMessage format
      const chatMessages: ChatMessage[] = (data || []).map(message => ({
        id: message.id,
        user_id: message.user_id,
        user_name: message.user_name,
        user_avatar: message.user_avatar,
        message: message.message,
        message_type: message.message_type,
        is_edited: message.is_edited,
        edited_at: message.edited_at,
        likes_count: 0,
        heart_count: 0,
        laugh_count: 0,
        wow_count: 0,
        sad_count: 0,
        angry_count: 0,
        created_at: message.created_at,
        updated_at: message.updated_at
      }));

      return { success: true, data: chatMessages };
    } catch (error) {
      console.error('Error in getUserMessages:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține mesajele filtrate după tip
   */
  static async getMessagesByType(messageType: string): Promise<{ success: boolean; error?: string; data?: ChatMessage[] }> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('message_type', messageType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages by type:', error);
        return { success: false, error: error.message };
      }

      // Convert to ChatMessage format
      const chatMessages: ChatMessage[] = (data || []).map(message => ({
        id: message.id,
        user_id: message.user_id,
        user_name: message.user_name,
        user_avatar: message.user_avatar,
        message: message.message,
        message_type: message.message_type,
        is_edited: message.is_edited,
        edited_at: message.edited_at,
        likes_count: 0,
        heart_count: 0,
        laugh_count: 0,
        wow_count: 0,
        sad_count: 0,
        angry_count: 0,
        created_at: message.created_at,
        updated_at: message.updated_at
      }));

      return { success: true, data: chatMessages };
    } catch (error) {
      console.error('Error in getMessagesByType:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }
} 