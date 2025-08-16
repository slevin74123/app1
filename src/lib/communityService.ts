import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  message: string;
  location?: string;
  post_type: 'info' | 'warning' | 'tip' | 'question' | 'general';
  likes_count: number;
  dislikes_count: number;
  heart_count: number;
  laugh_count: number;
  wow_count: number;
  sad_count: number;
  angry_count: number;
  user_reaction?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  message: string;
  location?: string;
  post_type: 'info' | 'warning' | 'tip' | 'question' | 'general';
}

export type ReactionType = 'like' | 'dislike' | 'heart' | 'laugh' | 'wow' | 'sad' | 'angry';

export class CommunityService {
  /**
   * Obține toate postările comunității cu reacții
   */
  static async getCommunityPosts(): Promise<{ success: boolean; error?: string; data?: CommunityPost[] }> {
    try {
      const { data, error } = await supabase
        .rpc('get_community_posts_with_reactions');

      if (error) {
        console.error('Error fetching community posts:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getCommunityPosts:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Creează o nouă postare
   */
  static async createPost(
    user: User,
    postData: CreatePostData
  ): Promise<{ success: boolean; error?: string; data?: CommunityPost }> {
    try {
      // Obține numele utilizatorului din metadata
      const userName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'Utilizator';

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          user_name: userName,
          user_avatar: user.user_metadata?.avatar_url,
          message: postData.message,
          location: postData.location,
          post_type: postData.post_type
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
      }

      // Convert to CommunityPost format
      const communityPost: CommunityPost = {
        id: data.id,
        user_id: data.user_id,
        user_name: data.user_name,
        user_avatar: data.user_avatar,
        message: data.message,
        location: data.location,
        post_type: data.post_type,
        likes_count: 0,
        dislikes_count: 0,
        heart_count: 0,
        laugh_count: 0,
        wow_count: 0,
        sad_count: 0,
        angry_count: 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return { success: true, data: communityPost };
    } catch (error) {
      console.error('Error in createPost:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Adaugă/actualizează o reacție la o postare
   */
  static async toggleReaction(
    user: User,
    postId: string,
    reactionType: ReactionType
  ): Promise<{ success: boolean; error?: string; newReactionType?: string }> {
    try {
      const { data, error } = await supabase
        .rpc('toggle_post_reaction', {
          post_uuid: postId,
          reaction_type_param: reactionType
        });

      if (error) {
        console.error('Error toggling reaction:', error);
        return { success: false, error: error.message };
      }

      if (data && data.length > 0) {
        const result = data[0];
        return { 
          success: result.success, 
          error: result.message,
          newReactionType: result.new_reaction_type
        };
      }

      return { success: false, error: 'Rezultat neașteptat' };
    } catch (error) {
      console.error('Error in toggleReaction:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Șterge o postare (doar pentru utilizatorul care a creat-o)
   */
  static async deletePost(
    user: User,
    postId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deletePost:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține postările unui utilizator specific
   */
  static async getUserPosts(userId: string): Promise<{ success: boolean; error?: string; data?: CommunityPost[] }> {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user posts:', error);
        return { success: false, error: error.message };
      }

      // Convert to CommunityPost format
      const communityPosts: CommunityPost[] = (data || []).map(post => ({
        id: post.id,
        user_id: post.user_id,
        user_name: post.user_name,
        user_avatar: post.user_avatar,
        message: post.message,
        location: post.location,
        post_type: post.post_type,
        likes_count: post.likes_count || 0,
        dislikes_count: post.dislikes_count || 0,
        heart_count: 0,
        laugh_count: 0,
        wow_count: 0,
        sad_count: 0,
        angry_count: 0,
        created_at: post.created_at,
        updated_at: post.updated_at
      }));

      return { success: true, data: communityPosts };
    } catch (error) {
      console.error('Error in getUserPosts:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Obține postările filtrate după tip
   */
  static async getPostsByType(postType: string): Promise<{ success: boolean; error?: string; data?: CommunityPost[] }> {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('post_type', postType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts by type:', error);
        return { success: false, error: error.message };
      }

      // Convert to CommunityPost format
      const communityPosts: CommunityPost[] = (data || []).map(post => ({
        id: post.id,
        user_id: post.user_id,
        user_name: post.user_name,
        user_avatar: post.user_avatar,
        message: post.message,
        location: post.location,
        post_type: post.post_type,
        likes_count: post.likes_count || 0,
        dislikes_count: post.dislikes_count || 0,
        heart_count: 0,
        laugh_count: 0,
        wow_count: 0,
        sad_count: 0,
        angry_count: 0,
        created_at: post.created_at,
        updated_at: post.updated_at
      }));

      return { success: true, data: communityPosts };
    } catch (error) {
      console.error('Error in getPostsByType:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }
} 