import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Bell, Heart, History, User, Settings, MapPin, Clock, Users, MessageCircle } from 'lucide-react';

const UserSidebar: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const userMenuItems = [{
    icon: Car,
    label: 'Parcările Mele',
    description: 'Vezi locurile tale rezervate',
    count: 2,
    color: 'text-blue-600'
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
  // Removed quickStats and communityMessages sections
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
        
        {/* Quick Stats section removed */}
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
              // Navigate to separate page
              router.push('/dashboard/my-parkings');
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
              
              {/* No submenu for Parcările Mele - now navigates to separate page */}
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
            
            {/* Community Messages section removed */}
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
            
            {/* Common Chat Messages section removed */}
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

      {/* Community Section removed */}
    </div>;
};
export default UserSidebar;