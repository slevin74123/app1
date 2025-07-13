"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Clock, Users, Smile, Paperclip, MoreVertical } from 'lucide-react';
export interface CommonChatViewProps {
  className?: string;
}
export default function CommonChatView({
  className = ""
}: CommonChatViewProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Mock chat messages data
  const chatMessages = [{
    id: 1,
    user: {
      name: 'Maria Ionescu',
      avatar: 'MI',
      initials: 'MI',
      isOnline: true
    },
    message: 'Salut tuturor! Am găsit un loc liber pe strada Victoriei, lângă numărul 15. Perfect pentru cine are nevoie!',
    timestamp: '10:30',
    location: 'Strada Victoriei',
    isOwn: false,
    reactions: ['👍', '❤️'],
    reactionCount: 3
  }, {
    id: 2,
    user: {
      name: 'Alexandru Popescu',
      avatar: 'AP',
      initials: 'AP',
      isOnline: true
    },
    message: 'Mulțumesc Maria! Tocmai am ajuns în zonă. Este încă disponibil?',
    timestamp: '10:32',
    location: null,
    isOwn: false,
    reactions: [],
    reactionCount: 0
  }, {
    id: 3,
    user: {
      name: 'Tu',
      avatar: 'IP',
      initials: 'IP',
      isOnline: true
    },
    message: 'Și eu sunt interesat! Dacă Alexandru nu îl ia, pot să vin eu.',
    timestamp: '10:33',
    location: null,
    isOwn: true,
    reactions: ['👍'],
    reactionCount: 1
  }, {
    id: 4,
    user: {
      name: 'Elena Radu',
      avatar: 'ER',
      initials: 'ER',
      isOnline: false
    },
    message: 'Atenție! Parcarea de la Piața Unirii este plină, dar am văzut că se eliberează locuri după ora 18:00. Recomand să încercați atunci.',
    timestamp: '10:35',
    location: 'Piața Unirii',
    isOwn: false,
    reactions: ['👍', '💡'],
    reactionCount: 5
  }, {
    id: 5,
    user: {
      name: 'Mihai Georgescu',
      avatar: 'MG',
      initials: 'MG',
      isOnline: true
    },
    message: 'Atenție șoferi! Lucrări pe strada Republicii - accesul la parcarea subterană este restricționat până mâine.',
    timestamp: '10:40',
    location: 'Strada Republicii',
    isOwn: false,
    reactions: ['⚠️'],
    reactionCount: 8
  }, {
    id: 6,
    user: {
      name: 'Ana Dumitrescu',
      avatar: 'AD',
      initials: 'AD',
      isOnline: true
    },
    message: 'Am observat că parcometrele de pe Bulevardul Magheru nu funcționează corect. Să fie cineva atent să nu ia amendă!',
    timestamp: '10:45',
    location: 'Bulevardul Magheru',
    isOwn: false,
    reactions: ['⚠️', '👍'],
    reactionCount: 12
  }] as any[];
  const onlineUsers = [{
    name: 'Maria Ionescu',
    initials: 'MI',
    status: 'Activ acum'
  }, {
    name: 'Alexandru Popescu',
    initials: 'AP',
    status: 'Activ acum'
  }, {
    name: 'Mihai Georgescu',
    initials: 'MG',
    status: 'Activ acum'
  }, {
    name: 'Ana Dumitrescu',
    initials: 'AD',
    status: 'Activ acum'
  }, {
    name: 'Cristian Marin',
    initials: 'CM',
    status: 'Activ acum'
  }] as any[];
  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return <div className={`h-full flex flex-col bg-background ${className}`}>
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Chat Comun</h2>
              <p className="text-sm text-muted-foreground">
                {onlineUsers.length} utilizatori online
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
            <MoreVertical size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map(msg => <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold relative ${msg.isOwn ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                    {msg.user.initials}
                    {msg.user.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>}
                  </div>
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-md ${msg.isOwn ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {msg.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp}
                    </span>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${msg.isOwn ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    
                    {msg.location && <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/20">
                        <MapPin size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {msg.location}
                        </span>
                      </div>}
                  </div>

                  {/* Reactions */}
                  {msg.reactions.length > 0 && <div className="flex items-center gap-1 mt-1">
                      <div className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1">
                        {msg.reactions.map((reaction: string, index: number) => <span key={index} className="text-xs">{reaction}</span>)}
                        <span className="text-xs text-muted-foreground ml-1">
                          {msg.reactionCount}
                        </span>
                      </div>
                    </div>}
                </div>
              </div>)}
            
            {isTyping && <div className="flex gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{
                  animationDelay: '0.1s'
                }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{
                  animationDelay: '0.2s'
                }}></div>
                  </div>
                </div>
              </div>}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-card border-t border-border p-4">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Paperclip size={20} className="text-muted-foreground" />
              </button>
              
              <div className="flex-1 relative">
                <textarea value={message} onChange={e => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Scrie un mesaj..." className="w-full p-3 bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" rows={1} style={{
                minHeight: '44px',
                maxHeight: '120px'
              }} />
                <button className="absolute right-2 top-2 p-1 hover:bg-accent rounded transition-colors">
                  <Smile size={16} className="text-muted-foreground" />
                </button>
              </div>
              
              <button onClick={handleSendMessage} disabled={!message.trim()} className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="hidden lg:block w-64 bg-card border-l border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground mb-2">Utilizatori Online</h3>
            <p className="text-sm text-muted-foreground">{onlineUsers.length} persoane</p>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto">
            {onlineUsers.map((user, index) => <div key={index} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.status}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}