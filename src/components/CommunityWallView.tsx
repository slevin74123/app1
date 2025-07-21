/* eslint-disable jsx-a11y/alt-text */
"use client";

import React, { useState } from 'react';
import { MessageCircle, Heart, Share2, MapPin, Clock, Send, Image, Smile, MoreHorizontal } from 'lucide-react';
export interface CommunityWallViewProps {
  className?: string;
}

// Tip pentru post
interface CommunityPost {
  id: number;
  user: {
    name: string;
    avatar: string;
    initials: string;
    isVerified: boolean;
  };
  message: string;
  timestamp: string;
  location: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  image: string | null;
}

export default function CommunityWallView({
  className = ""
}: CommunityWallViewProps) {
  const [newMessage, setNewMessage] = useState('');

  // Mock community wall posts data
  const communityPosts: CommunityPost[] = [{
    id: 1,
    user: {
      name: 'Maria Ionescu',
      avatar: 'MI',
      initials: 'MI',
      isVerified: true
    },
    message: 'Atenție! Locul de parcare de pe strada Victoriei nr. 15 este ocupat ilegal de o mașină fără număr. Să anunțăm autoritățile? 🚗⚠️',
    timestamp: '2 ore',
    location: 'Strada Victoriei',
    likes: 12,
    comments: 3,
    shares: 1,
    isLiked: false,
    image: null
  }, {
    id: 2,
    user: {
      name: 'Alexandru Popescu',
      avatar: 'AP',
      initials: 'AP',
      isVerified: false
    },
    message: 'Salut! Am găsit un loc liber pe Calea Dorobanților, lângă mall. Perfect pentru shopping! Locul este gratuit pentru primele 2 ore. 🛍️',
    timestamp: '4 ore',
    location: 'Calea Dorobanților',
    likes: 8,
    comments: 5,
    shares: 2,
    isLiked: true,
    image: null
  }, {
    id: 3,
    user: {
      name: 'Elena Radu',
      avatar: 'ER',
      initials: 'ER',
      isVerified: true
    },
    message: 'Parcarea de la Piața Unirii este plină, dar am văzut că se eliberează locuri după ora 18:00. Recomand să încercați atunci. Prețurile sunt rezonabile - 5 RON/oră.',
    timestamp: '6 ore',
    location: 'Piața Unirii',
    likes: 15,
    comments: 7,
    shares: 3,
    isLiked: false,
    image: null
  }, {
    id: 4,
    user: {
      name: 'Mihai Georgescu',
      avatar: 'MG',
      initials: 'MG',
      isVerified: false
    },
    message: 'Atenție șoferi! Lucrări pe strada Republicii - accesul la parcarea subterană este restricționat până mâine. Folosiți parcarea de pe strada paralela. 🚧',
    timestamp: '8 ore',
    location: 'Strada Republicii',
    likes: 23,
    comments: 12,
    shares: 8,
    isLiked: true,
    image: null
  }, {
    id: 5,
    user: {
      name: 'Ana Dumitrescu',
      avatar: 'AD',
      initials: 'AD',
      isVerified: true
    },
    message: 'Am observat că parcometrele de pe Bulevardul Magheru nu funcționează corect. Să fie cineva atent să nu ia amendă! Am sunat la primărie să raportez problema.',
    timestamp: '1 zi',
    location: 'Bulevardul Magheru',
    likes: 31,
    comments: 18,
    shares: 5,
    isLiked: false,
    image: null
  }, {
    id: 6,
    user: {
      name: 'Cristian Marin',
      avatar: 'CM',
      initials: 'CM',
      isVerified: false
    },
    message: 'Locuri libere în parcarea de la Teatrul Național! Prețuri rezonabile și foarte aproape de centru. Perfect pentru spectacole de seară. 🎭',
    timestamp: '1 zi',
    location: 'Teatrul Național',
    likes: 19,
    comments: 9,
    shares: 4,
    isLiked: true,
    image: null
  }];
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Handle message submission
      console.log('Submitting message:', newMessage);
      setNewMessage('');
    }
  };
  const handleLike = (postId: number) => {
    // Handle like functionality
    console.log('Liking post:', postId);
  };
  const handleComment = (postId: number) => {
    // Handle comment functionality
    console.log('Commenting on post:', postId);
  };
  const handleShare = (postId: number) => {
    // Handle share functionality
    console.log('Sharing post:', postId);
  };
  return <div className={`h-full flex flex-col bg-background ${className}`}>
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Comunitate</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Informații și mesaje de la comunitatea de șoferi
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Community Wall Posts */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* New Post Input */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  IP
                </div>
                <div className="flex-1">
                  <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Informează comunitatea despre situația parcărilor..." className="w-full bg-background border border-input rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" rows={3} />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Add image">
                    <Image size={18} className="text-muted-foreground" />
                  </button>
                  <button type="button" className="p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Add emoji">
                    <Smile size={18} className="text-muted-foreground" />
                  </button>
                  <button type="button" className="p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Add location">
                    <MapPin size={18} className="text-muted-foreground" />
                  </button>
                </div>
                
                <button type="submit" disabled={!newMessage.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <Send size={16} />
                  <span>Postează</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts */}
          {communityPosts.map(post => <article key={post.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Post Header */}
              <header className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {post.user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{post.user.name}</h3>
                      {post.user.isVerified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={12} />
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <MapPin size={12} />
                      <span>{post.location}</span>
                    </div>
                  </div>
                </div>
                
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <MoreHorizontal size={16} className="text-muted-foreground" />
                </button>
              </header>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">{post.message}</p>
              </div>

              {/* Post Actions */}
              <footer className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${post.isLiked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-muted-foreground hover:bg-accent'}`}>
                    <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  
                  <button onClick={() => handleComment(post.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  
                  <button onClick={() => handleShare(post.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors">
                    <Share2 size={16} />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </button>
                </div>
              </footer>
            </article>)}
        </div>
      </div>
    </div>;
}