import React, { useState } from 'react';
import { Car, Bell, Heart, History, User, Settings, MapPin, Clock, Users, MessageCircle } from 'lucide-react';
const UserSidebar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const userMenuItems = [{
    icon: Car,
    label: 'Parcările Mele',
    description: 'Vezi locurile tale rezervate',
    count: 2,
    color: 'text-blue-600'
  }, {
    icon: Bell,
    label: 'Notificări',
    description: 'Alerte și actualizări',
    count: 5,
    color: 'text-orange-600'
  }, {
    icon: Heart,
    label: 'Favorite',
    description: 'Locuri de parcare salvate',
    count: 8,
    color: 'text-red-600'
  }, {
    icon: History,
    label: 'Istoric',
    description: 'Sesiuni de parcare anterioare',
    count: null,
    color: 'text-green-600'
  }, {
    icon: MapPin,
    label: 'Locuri Apropiate',
    description: 'Locuri lângă poziția ta',
    count: 12,
    color: 'text-purple-600'
  }, {
    icon: Users,
    label: 'Comunitate',
    description: 'Mesaje și informații comunitate',
    count: 23,
    color: 'text-indigo-600',
    hasSubmenu: true,
    submenu: [{
      label: 'Locuri Apropiate',
      description: 'Vezi locurile din zona ta',
      icon: MapPin
    }]
  }] as any[];
  const quickStats = [{
    label: 'Ore Parcat',
    value: '24.5',
    icon: Clock
  }, {
    label: 'Bani Economisiți',
    value: '127 RON',
    icon: Car
  }, {
    label: 'Locuri Folosite',
    value: '18',
    icon: MapPin
  }] as any[];

  // Mock community messages data
  const communityMessages = [{
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
  }] as any[];
  return <div className="h-full flex flex-col bg-card">
      {/* User Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Ion Popescu</h3>
            <p className="text-sm text-muted-foreground">Membru Premium</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-2">
          {quickStats.map((stat, index) => <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <stat.icon size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{stat.value}</span>
            </div>)}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {/* Regular Menu */}
        <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Contul Meu
        </h4>
        <ul className="space-y-1 mb-6">
          {userMenuItems.filter(item => item.label !== 'Comunitate').map((item, index) => <li key={index}>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group" onClick={() => {
            if (item.label === 'Parcările Mele') {
              setActiveSection(activeSection === 'parking-details' ? null : 'parking-details');
              // Trigger display change in main dashboard
              window.dispatchEvent(new CustomEvent('showMyParkings', {
                detail: {
                  show: activeSection !== 'parking-details'
                }
              }));
            } else if (item.label === 'Locuri Apropiate') {
              // Trigger display change to show nearby parking spots
              window.dispatchEvent(new CustomEvent('showNearbyParking', {
                detail: {
                  show: true
                }
              }));
            }
          }}>
                <div className={`p-2 rounded-lg bg-muted/50 group-hover:bg-background ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.count && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        {item.count}
                      </span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </button>
              
              {/* Parking Details Submenu */}
              {item.label === 'Parcările Mele' && activeSection === 'parking-details' && <div className="mt-2 ml-4 pl-4 border-l-2 border-muted space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h5 className="font-medium text-sm text-foreground mb-2">Parcare Activă</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Locație:</span>
                        <span className="text-foreground">Str. Victoriei 15</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Timp rămas:</span>
                        <span className="text-green-600 font-medium">2h 15m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="text-foreground">8.50 RON</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h5 className="font-medium text-sm text-foreground mb-2">Rezervare Următoare</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Locație:</span>
                        <span className="text-foreground">Piața Unirii</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Ora:</span>
                        <span className="text-foreground">18:30</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Durată:</span>
                        <span className="text-foreground">3 ore</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h5 className="font-medium text-sm text-foreground mb-2">Statistici Luna</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total ore:</span>
                        <span className="text-foreground">45.5h</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total cost:</span>
                        <span className="text-foreground">234 RON</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Economii:</span>
                        <span className="text-green-600 font-medium">67 RON</span>
                      </div>
                    </div>
                  </div>
                </div>}
            </li>)}
        </ul>

        {/* Community Section */}
        <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Comunitate
        </h4>
        <ul className="space-y-1 mb-6">
          <li>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group" onClick={() => {
            setActiveSection(activeSection === 'community' ? null : 'community');
            // Trigger display change in main dashboard to show community wall instead of map and parking list
            window.dispatchEvent(new CustomEvent('showCommunityWall', {
              detail: {
                show: activeSection !== 'community'
              }
            }));
          }}>
              <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-background text-indigo-600">
                <Users size={18} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Comunitate</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    23
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Chat și informații comunitate</p>
              </div>
            </button>
            
            {/* Community Messages */}
            {activeSection === 'community' && <div className="mt-2 ml-4 pl-4 border-l-2 border-muted max-h-64 overflow-y-auto">
                <button className="w-full mt-3 p-2 text-xs text-primary hover:bg-accent rounded-lg transition-colors" onClick={() => {
              // Trigger display change in main dashboard to show community chat instead of map and parking list
              window.dispatchEvent(new CustomEvent('showCommonChat', {
                detail: {
                  show: true
                }
              }));
            }}>
                  Vezi toate mesajele
                </button>
              </div>}
          </li>
          
          <li>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group" onClick={() => {
            setActiveSection(activeSection === 'common-chat' ? null : 'common-chat');
            // Trigger display change in main dashboard to show common chat instead of map and parking list
            window.dispatchEvent(new CustomEvent('showCommonChat', {
              detail: {
                show: activeSection !== 'common-chat'
              }
            }));
          }}>
              <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-background text-green-600">
                <MessageCircle size={18} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Chat Comun</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                    Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Chat în timp real cu toți utilizatorii</p>
              </div>
            </button>
            
            {/* Common Chat Messages */}
            {activeSection === 'common-chat' && <div className="mt-2 ml-4 pl-4 border-l-2 border-muted max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {communityMessages.slice(0, 3).map(message => <div key={message.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">{message.user.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs text-foreground truncate">{message.user.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{message.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{message.message}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={10} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{message.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                
                <div className="mt-3 p-2 bg-muted/20 rounded-lg">
                  <input type="text" placeholder="Scrie un mesaj..." className="w-full bg-transparent text-xs placeholder:text-muted-foreground border-none outline-none" />
                </div>
              </div>}
          </li>
        </ul>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
          <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
            <Settings size={18} />
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium text-foreground">Setări</span>
            <p className="text-xs text-muted-foreground">Preferințe cont</p>
          </div>
        </button>
      </div>

      {/* Community Section */}
      {activeSection === "community-section" && <div className="p-4 border-t border-border">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Comunitate
        </h4>
        <ul className="space-y-1">
          {communityMessages.map(message => <li key={message.id}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-lg font-semibold">{message.user.initials}</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{message.message}</p>
                  <p className="text-xs text-muted-foreground">{message.location}</p>
                </div>
              </div>
            </li>)}
        </ul>
      </div>}
    </div>;
};
export default UserSidebar;