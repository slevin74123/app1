"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Edit3, 
  Trash2, 
  X, 
  ThumbsUp, 
  Heart, 
  Laugh, 
  Zap, 
  Frown, 
  Angry,
  Info,
  AlertTriangle,
  Lightbulb,
  Type,
  Users,
  Circle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatService, type ChatMessage, type CreateMessageData, type ReactionType, type OnlineUser } from '@/lib/chatService';
import { toast } from 'sonner';

export default function CommonChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessageType, setSelectedMessageType] = useState<'text' | 'info' | 'warning' | 'tip'>('text');
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editText, setEditText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [userReactions, setUserReactions] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Funcție pentru a reveni la dashboard
  const handleBackToDashboard = () => {
    window.dispatchEvent(new CustomEvent('showCommonChat', {
      detail: { show: false }
    }));
  };

  // Load messages and online users on component mount
  useEffect(() => {
    if (user) {
      loadMessages();
      loadOnlineUsers();
      updateOnlineStatus();
      
      // Set up periodic updates
      const interval = setInterval(() => {
        loadMessages();
        loadOnlineUsers();
        updateOnlineStatus();
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update typing status when user types
  useEffect(() => {
    if (user && isTyping) {
      ChatService.setTypingStatus(user, true);
      
      // Clear typing status after 3 seconds of inactivity
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        ChatService.setTypingStatus(user, false);
      }, 3000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, user]);

  const loadMessages = async () => {
    try {
      const result = await ChatService.getChatMessages();
      if (result.success && result.data) {
        setMessages(result.data);
        // Load user reactions for each message
        if (user) {
          await loadUserReactions(result.data);
        }
      } else {
        console.error('Error loading messages:', result.error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserReactions = async (messages: ChatMessage[]) => {
    if (!user) return;
    
    try {
      const reactions: Record<string, string> = {};
      for (const message of messages) {
        const result = await ChatService.getUserReactionForMessage(message.id, user.id);
        if (result.success && result.data && result.data.length > 0) {
          reactions[message.id] = result.data[0].reaction_type;
        }
      }
      setUserReactions(reactions);
    } catch (error) {
      console.error('Error loading user reactions:', error);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const result = await ChatService.getOnlineUsers();
      if (result.success && result.data) {
        setOnlineUsers(result.data);
        
        // Extract typing users
        const typing = result.data
          .filter(u => u.is_typing && u.user_id !== user?.id)
          .map(u => u.user_name);
        setTypingUsers(typing);
      }
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  };

  const updateOnlineStatus = async () => {
    if (user) {
      try {
        await ChatService.updateOnlineStatus(user);
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    try {
      const messageData: CreateMessageData = {
        message: newMessage.trim(),
        message_type: selectedMessageType
      };

      const result = await ChatService.createMessage(user, messageData);
      if (result.success && result.data) {
        // Add new message to the list
        setMessages(prev => [...prev, result.data!]);
        setNewMessage('');
        setSelectedMessageType('text');
        
        // Update online status
        await updateOnlineStatus();
        
        toast.success('Mesajul a fost trimis!');
      } else {
        toast.error(`Eroare la trimiterea mesajului: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Eroare neașteptată la trimiterea mesajului');
    }
  };

  const handleEditMessage = async () => {
    if (!user || !editingMessage || !editText.trim()) return;

    try {
      const result = await ChatService.editMessage(user, editingMessage.id, editText.trim());
      if (result.success) {
        // Update message in the list
        setMessages(prev => prev.map(msg => 
          msg.id === editingMessage.id 
            ? { ...msg, message: editText.trim(), is_edited: true, edited_at: new Date().toISOString() }
            : msg
        ));
        
        setEditingMessage(null);
        setEditText('');
        toast.success('Mesajul a fost editat cu succes!');
      } else {
        toast.error(`Eroare la editarea mesajului: ${result.error}`);
      }
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Eroare neașteptată la editarea mesajului');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      const result = await ChatService.deleteMessage(user, messageId);
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        toast.success('Mesajul a fost șters cu succes!');
      } else {
        toast.error(`Eroare la ștergerea mesajului: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Eroare neașteptată la ștergerea mesajului');
    }
  };

  const handleReaction = async (messageId: string, reactionType: ReactionType) => {
    if (!user) return;

    try {
      const result = await ChatService.toggleReaction(user, messageId, reactionType);
      if (result.success) {
        // Update local user reactions
        if (result.newReactionType) {
          setUserReactions(prev => ({ ...prev, [messageId]: result.newReactionType! }));
        } else {
          setUserReactions(prev => {
            const newReactions = { ...prev };
            delete newReactions[messageId];
            return newReactions;
          });
        }
        
        // Refresh messages to get updated reaction counts
        await loadMessages();
        toast.success('Reacția a fost actualizată!');
      } else {
        toast.error(`Eroare la actualizarea reacției: ${result.error}`);
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Eroare neașteptată la actualizarea reacției');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      default: return <Type className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'tip': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'info': return 'Informație';
      case 'warning': return 'Atenție';
      case 'tip': return 'Sfat';
      default: return 'Text';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Acum';
    if (diffInMinutes < 60) return `Acum ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Acum ${Math.floor(diffInMinutes / 60)}h`;
    return `Acum ${Math.floor(diffInMinutes / 1440)} zile`;
  };

  const getReactionIcon = (type: ReactionType) => {
    switch (type) {
      case 'like': return <ThumbsUp size={16} />;
      case 'heart': return <Heart size={16} />;
      case 'laugh': return <Laugh size={16} />;
      case 'wow': return <Zap size={16} />;
      case 'sad': return <Frown size={16} />;
      case 'angry': return <Angry size={16} />;
    }
  };

  const getReactionColor = (type: ReactionType, isActive: boolean) => {
    if (isActive) return 'text-primary';
    switch (type) {
      case 'like': return 'text-green-500';
      case 'heart': return 'text-pink-500';
      case 'laugh': return 'text-yellow-500';
      case 'wow': return 'text-blue-500';
      case 'sad': return 'text-gray-500';
      case 'angry': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Trebuie să fii autentificat pentru a accesa chat-ul</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToDashboard}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Înapoi la Dashboard"
            >
              <ArrowLeft className="text-muted-foreground" size={20} />
            </button>
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageCircle className="text-green-600" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Chat Comun</h1>
              <p className="text-sm text-muted-foreground">Chat în timp real cu toți utilizatorii</p>
            </div>
          </div>
          
          {/* Online Users */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {onlineUsers.length} online
            </span>
          </div>
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'scrie' : 'scriu'}...
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Se încarcă mesajele...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                {message.user_avatar ? (
                  <img src={message.user_avatar} alt={message.user_name} className="w-10 h-10 rounded-full" />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    {message.user_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{message.user_name}</span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(message.created_at)}</span>
                  
                  {/* Message Type Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs border ${getMessageTypeColor(message.message_type)}`}>
                    {getMessageTypeIcon(message.message_type)}
                    <span className="ml-1">{getMessageTypeLabel(message.message_type)}</span>
                  </span>

                  {/* Edited Indicator */}
                  {message.is_edited && (
                    <span className="text-xs text-muted-foreground">(editat)</span>
                  )}
                </div>

                {/* Message Text */}
                {editingMessage?.id === message.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 p-2 border border-input rounded-md bg-background text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleEditMessage()}
                    />
                    <button
                      onClick={handleEditMessage}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                    >
                      Salvează
                    </button>
                    <button
                      onClick={() => {
                        setEditingMessage(null);
                        setEditText('');
                      }}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80"
                    >
                      Anulează
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-foreground mb-2">{message.message}</p>
                )}

                {/* Reactions */}
                <div className="flex items-center gap-2">
                  {(['like', 'heart', 'laugh', 'wow', 'sad', 'angry'] as ReactionType[]).map((reaction) => {
                    const count = message[`${reaction}_count` as keyof ChatMessage] as number;
                    const isActive = userReactions[message.id] === reaction;
                    
                    return (
                      <button
                        key={reaction}
                        onClick={() => handleReaction(message.id, reaction)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full hover:bg-muted transition-colors ${
                          isActive ? 'bg-primary/10' : ''
                        }`}
                        title={reaction.charAt(0).toUpperCase() + reaction.slice(1)}
                      >
                        <span className={getReactionColor(reaction, isActive)}>
                          {getReactionIcon(reaction)}
                        </span>
                        {count > 0 && (
                          <span className="text-xs text-muted-foreground">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons for Own Messages */}
                {user && message.user_id === user.id && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingMessage(message);
                        setEditText(message.message);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nu există încă mesaje</p>
            <p className="text-sm text-muted-foreground mt-1">
              Fii primul care împărtășește ceva cu comunitatea!
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          {/* Message Type Selector */}
          <select
            value={selectedMessageType}
            onChange={(e) => setSelectedMessageType(e.target.value as any)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="text">Text</option>
            <option value="info">Informație</option>
            <option value="warning">Atenție</option>
            <option value="tip">Sfat</option>
          </select>

          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Scrie un mesaj..."
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}