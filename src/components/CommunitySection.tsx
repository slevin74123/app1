"use client";

import React from 'react';
import { MapPin, Heart, MessageCircle } from 'lucide-react';
interface CommunityMessage {
  id: number;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  message: string;
  timestamp: string;
  location: string;
}
type CommunitySectionProps = Record<string, never>;
const CommunitySection: React.FC<CommunitySectionProps> = () => {
  // Mock community messages data
  const communityMessages: CommunityMessage[] = [{
    id: 1,
    user: {
      name: 'Maria Ionescu',
      avatar: 'MI',
      initials: 'MI'
    },
    message: 'Atenție! Locul de parcare de pe strada Victoriei nr. 15 este ocupat ilegal de o mașină fără număr. Să anunțăm autoritățile?',
    timestamp: '2 ore',
    location: 'Strada Victoriei'
  }, {
    id: 2,
    user: {
      name: 'Alexandru Popescu',
      avatar: 'AP',
      initials: 'AP'
    },
    message: 'Salut! Am găsit un loc liber pe Calea Dorobanților, lângă mall. Perfect pentru shopping!',
    timestamp: '4 ore',
    location: 'Calea Dorobanților'
  }, {
    id: 3,
    user: {
      name: 'Elena Radu',
      avatar: 'ER',
      initials: 'ER'
    },
    message: 'Parcarea de la Piața Unirii este plină, dar am văzut că se eliberează locuri după ora 18:00. Recomand să încercați atunci.',
    timestamp: '6 ore',
    location: 'Piața Unirii'
  }, {
    id: 4,
    user: {
      name: 'Mihai Georgescu',
      avatar: 'MG',
      initials: 'MG'
    },
    message: 'Atenție șoferi! Lucrări pe strada Republicii - accesul la parcarea subterană este restricționat până mâine.',
    timestamp: '8 ore',
    location: 'Strada Republicii'
  }, {
    id: 5,
    user: {
      name: 'Ana Dumitrescu',
      avatar: 'AD',
      initials: 'AD'
    },
    message: 'Am observat că parcometrele de pe Bulevardul Magheru nu funcționează corect. Să fie cineva atent să nu ia amendă!',
    timestamp: '1 zi',
    location: 'Bulevardul Magheru'
  }, {
    id: 6,
    user: {
      name: 'Cristian Marin',
      avatar: 'CM',
      initials: 'CM'
    },
    message: 'Locuri libere în parcarea de la Teatrul Național! Prețuri rezonabile și foarte aproape de centru.',
    timestamp: '1 zi',
    location: 'Teatrul Național'
  }];
  return <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Comunitatea Parking
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Conectează-te cu alți șoferi și împărtășește informații utile despre parcări
          </p>
        </div>
      </div>

      {/* Community Feed */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* New Post Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">IP</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">Ion Popescu</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Membru Premium</p>
              </div>
            </div>
            <textarea placeholder="Împărtășește o informație utilă despre parcări..." className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin size={16} />
                <span>Adaugă locația</span>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Postează
              </button>
            </div>
          </div>

          {/* Community Messages */}
          {communityMessages.map(msg => <div key={msg.id} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {msg.user.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {msg.user.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                      <MapPin size={14} />
                      <span>{msg.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors group">
                      <Heart size={16} className="group-hover:fill-current" />
                      <span>Apreciază</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
                      <MessageCircle size={16} />
                      <span>Comentează</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">127</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Membri Activi</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">45</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Postări Azi</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">892</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Locuri Raportate</div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default CommunitySection;