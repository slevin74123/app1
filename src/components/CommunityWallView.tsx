"use client";

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  MapPin, 
  Plus, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Laugh, 
  Zap, 
  Frown, 
  Angry,
  Info,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CommunityService, type CommunityPost, type CreatePostData, type ReactionType } from '@/lib/communityService';
import { toast } from 'sonner';

export default function CommunityWallView() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState<CreatePostData>({
    message: '',
    location: '',
    post_type: 'general'
  });
  const [selectedPostType, setSelectedPostType] = useState<string>('all');
  const { user } = useAuth();

  // Funcție pentru a reveni la dashboard
  const handleBackToDashboard = () => {
    window.dispatchEvent(new CustomEvent('showCommunityWall', {
      detail: { show: false }
    }));
  };

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const result = await CommunityService.getCommunityPosts();
      if (result.success && result.data) {
        setPosts(result.data);
      } else {
        console.error('Error loading posts:', result.error);
        toast.error('Eroare la încărcarea postărilor');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Eroare neașteptată');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('Trebuie să fii autentificat pentru a crea o postare');
      return;
    }

    if (!newPost.message.trim()) {
      toast.error('Mesajul nu poate fi gol');
      return;
    }

    try {
      const result = await CommunityService.createPost(user, newPost);
      if (result.success && result.data) {
        // Add new post to the beginning of the list
        setPosts(prev => [result.data!, ...prev]);
        setNewPost({ message: '', location: '', post_type: 'general' });
        setShowCreateForm(false);
        toast.success('Postarea a fost creată cu succes!');
      } else {
        toast.error(`Eroare la crearea postării: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Eroare neașteptată la crearea postării');
    }
  };

  const handleReaction = async (postId: string, reactionType: ReactionType) => {
    if (!user) {
      toast.error('Trebuie să fii autentificat pentru a reacționa');
      return;
    }

    try {
      const result = await CommunityService.toggleReaction(user, postId, reactionType);
      if (result.success) {
        // Refresh posts to get updated reaction counts
        await loadPosts();
        toast.success('Reacția a fost actualizată!');
      } else {
        toast.error(`Eroare la actualizarea reacției: ${result.error}`);
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Eroare neașteptată la actualizarea reacției');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      const result = await CommunityService.deletePost(user, postId);
      if (result.success) {
        setPosts(prev => prev.filter(post => post.id !== postId));
        toast.success('Postarea a fost ștearsă cu succes!');
      } else {
        toast.error(`Eroare la ștergerea postării: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Eroare neașteptată la ștergerea postării');
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'question': return <HelpCircle className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'tip': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'question': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'info': return 'Informație';
      case 'warning': return 'Atenție';
      case 'tip': return 'Sfat';
      case 'question': return 'Întrebare';
      default: return 'General';
    }
  };

  const filteredPosts = selectedPostType === 'all' 
    ? posts 
    : posts.filter(post => post.post_type === selectedPostType);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Acum';
    if (diffInMinutes < 60) return `Acum ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Acum ${Math.floor(diffInMinutes / 60)}h`;
    return `Acum ${Math.floor(diffInMinutes / 1440)} zile`;
  };

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBackToDashboard}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Înapoi la Dashboard"
          >
            <ArrowLeft className="text-muted-foreground" size={20} />
          </button>
          <div className="p-3 bg-indigo-100 rounded-xl">
            <MessageCircle className="text-indigo-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comunitatea Parcării</h1>
            <p className="text-muted-foreground">Împărtășește informații și sfaturi cu alți șoferi</p>
          </div>
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Creează o Postare
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex flex-wrap gap-2">
          {['all', 'info', 'warning', 'tip', 'question', 'general'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedPostType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedPostType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {type === 'all' ? 'Toate' : getPostTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Creează o Postare</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipul Postării</label>
                <select
                  value={newPost.post_type}
                  onChange={(e) => setNewPost(prev => ({ ...prev, post_type: e.target.value as any }))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="general">General</option>
                  <option value="info">Informație</option>
                  <option value="warning">Atenție</option>
                  <option value="tip">Sfat</option>
                  <option value="question">Întrebare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mesajul</label>
                <textarea
                  value={newPost.message}
                  onChange={(e) => setNewPost(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Scrie mesajul tău aici..."
                  className="w-full p-2 border border-input rounded-md bg-background h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Locația (opțional)</label>
                <input
                  type="text"
                  value={newPost.location}
                  onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="ex: Piața Victoriei, București"
                  className="w-full p-2 border border-input rounded-md bg-background"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreatePost}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Postează
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-muted text-muted-foreground py-2 rounded-md hover:bg-muted/80 transition-colors"
                >
                  Anulează
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Se încarcă postările...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-lg p-4">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    {post.user_avatar ? (
                      <img src={post.user_avatar} alt={post.user_name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {post.user_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.user_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getPostTypeIcon(post.post_type)}
                      <span className={getPostTypeColor(post.post_type) + ' px-2 py-1 rounded-full text-xs border'}>
                        {getPostTypeLabel(post.post_type)}
                      </span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                {user && post.user_id === user.id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-foreground mb-2">{post.message}</p>
                {post.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {post.location}
                  </div>
                )}
              </div>

              {/* Reactions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(['like', 'dislike', 'heart', 'laugh', 'wow', 'sad', 'angry'] as ReactionType[]).map((reaction) => {
                    const count = post[`${reaction}_count` as keyof CommunityPost] as number;
                    const isActive = post.user_reaction === reaction;
                    
                    const getReactionIcon = (type: ReactionType) => {
                      switch (type) {
                        case 'like': return <ThumbsUp size={16} />;
                        case 'dislike': return <ThumbsDown size={16} />;
                        case 'heart': return <Heart size={16} />;
                        case 'laugh': return <Laugh size={16} />;
                        case 'wow': return <Zap size={16} />;
                        case 'sad': return <Frown size={16} />;
                        case 'angry': return <Angry size={16} />;
                      }
                    };

                    const getReactionColor = (type: ReactionType) => {
                      if (isActive) return 'text-primary';
                      switch (type) {
                        case 'like': return 'text-green-500';
                        case 'dislike': return 'text-red-500';
                        case 'heart': return 'text-pink-500';
                        case 'laugh': return 'text-yellow-500';
                        case 'wow': return 'text-blue-500';
                        case 'sad': return 'text-gray-500';
                        case 'angry': return 'text-orange-500';
                        default: return 'text-muted-foreground';
                      }
                    };

                    return (
                      <button
                        key={reaction}
                        onClick={() => handleReaction(post.id, reaction)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full hover:bg-muted transition-colors ${
                          isActive ? 'bg-primary/10' : ''
                        }`}
                        title={reaction.charAt(0).toUpperCase() + reaction.slice(1)}
                      >
                        <span className={getReactionColor(reaction)}>
                          {getReactionIcon(reaction)}
                        </span>
                        {count > 0 && (
                          <span className="text-xs text-muted-foreground">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nu există încă postări</p>
            <p className="text-sm text-muted-foreground mt-1">
              Fii primul care împărtășește ceva cu comunitatea!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}