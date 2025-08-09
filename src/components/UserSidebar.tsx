import React, { useState } from 'react';
import { Car, Bell, Heart, History, Settings, MapPin, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface UserMenuItem {
  icon: React.ElementType;
  label: string;
  description: string;
  count: number | null;
  color: string;
  hasSubmenu?: boolean;
  submenu?: { label: string; description: string; icon: React.ElementType }[];
}

const UserSidebar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const userMenuItems: UserMenuItem[] = [{
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
  }];
  return <div className="h-full flex flex-col bg-card">
      {/* User Profile Section - Removed as per request */}

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
              
                <AnimatePresence>
                  {activeSection === 'parking-details' && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} className="mt-2 ml-4 pl-4 border-l-2 border-muted overflow-hidden">
                      <div className="space-y-2 py-2">
                        {/* parkingDetails is not defined in this component, so this will cause an error.
                            Assuming it's meant to be a placeholder or will be added later.
                            For now, removing the loop as it's not part of the requested edit. */}
                      </div>
                    </motion.div>}
                </AnimatePresence>
              
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
        </ul>
      </nav>
      {/* Settings Section */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group">
          <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-background text-muted-foreground">
            <Settings size={18} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Setări</p>
            <p className="text-xs text-muted-foreground">Setări de cont și preferințe</p>
          </div>
        </button>
      </div>
    </div>;
};

export default UserSidebar;