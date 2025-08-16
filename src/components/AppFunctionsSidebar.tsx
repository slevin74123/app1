"use client";

import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, Users, TrendingUp, MapPin, Clock, MessageSquare } from 'lucide-react';
import ParkingSearchBar from './ParkingSearchBar';
import { type SearchResult } from '@/lib/parkingService';
import { NotificationService } from '@/lib/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import NotificationsList from './NotificationsList';

interface AppFunctionsSidebarProps {
  onNotificationCreated?: () => void; // Callback pentru actualizarea notificărilor
}

export default function AppFunctionsSidebar({ onNotificationCreated }: AppFunctionsSidebarProps) {
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [selectedParkingLocation, setSelectedParkingLocation] = useState<SearchResult | null>(null);
  const [selectedParkingForFind, setSelectedParkingForFind] = useState<SearchResult | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>('');
  const { user } = useAuth();
  const mainFunctions = [{
    id: 'report',
    icon: Plus,
    title: 'Raportează Loc Liber',
    description: 'Ajută comunitatea raportând parcări disponibile',
    color: 'bg-green-500',
    textColor: 'text-green-600'
  }, {
    id: 'find',
    icon: Search,
    title: 'Găsește un Loc',
    description: 'Primește recomandări personalizate de parcare',
    color: 'bg-purple-500',
    textColor: 'text-purple-600'
  }] as any[];
  const quickActions = [{
    icon: AlertTriangle,
    title: 'Raportează Problemă',
    description: 'Raportează încălcări sau probleme de parcare',
    count: null
  }, {
    icon: Users,
    title: 'Feed Comunitate',
    description: 'Vezi ce împărtășesc alții',
    count: 12
  }, {
    icon: TrendingUp,
    title: 'Ore de Vârf',
    description: 'Vezi orele aglomerate de parcare',
    count: null
  }] as any[];
  const recentActivity = [{
    action: 'Loc nou raportat',
    location: 'Piața Victoriei',
    time: 'acum 2 min',
    type: 'report'
  }, {
    action: 'Actualizare comunitate',
    location: 'Centrul Vechi',
    time: 'acum 5 min',
    type: 'update'
  }, {
    action: 'Loc rezervat',
    location: 'Herastrau',
    time: 'acum 8 min',
    type: 'reservation'
  }] as any[];
  const handleFunctionClick = (functionId: string) => {
    setActiveFunction(activeFunction === functionId ? null : functionId);
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <Plus size={12} className="text-green-600" />;
      case 'update':
        return <MessageSquare size={12} className="text-blue-600" />;
      case 'reservation':
        return <Clock size={12} className="text-purple-600" />;
      default:
        return <MapPin size={12} className="text-muted-foreground" />;
    }
  };
  const handleFindParking = async () => {
    if (selectedParkingForFind && selectedDuration && selectedMaxPrice !== undefined && user) {
      try {
        // Creează notificarea pentru utilizator
        const result = await NotificationService.createParkingNotification(
          user.id,
          selectedParkingForFind.id,
          selectedParkingForFind.name,
          parseInt(selectedDuration),
          parseFloat(selectedMaxPrice)
        );

        if (result.success) {
          toast.success(`Notificare creată pentru ${selectedParkingForFind.name}! Vei fi notificat când se raportează locuri libere.`);
          
          // Resetează formularul
          setSelectedParkingForFind(null);
          setSelectedDuration('');
          setSelectedMaxPrice('');
          setActiveFunction(null);
          
          // Notifică dashboard-ul să actualizeze notificările
          if (onNotificationCreated) {
            onNotificationCreated();
          }
        } else {
          toast.error(`Eroare la crearea notificării: ${result.error}`);
        }
      } catch (error) {
        console.error('Error creating notification:', error);
        toast.error('Eroare la crearea notificării. Încearcă din nou.');
      }
    }
  };
  return <div className="h-full flex flex-col bg-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Acțiuni Rapide</h2>
        <p className="text-sm text-muted-foreground">Ajută să îmbunătățim parcarea pentru toți</p>
      </div>

      {/* Main Functions */}
      <div className="p-4 space-y-3">
        {mainFunctions.map(func => <div key={func.id} className="space-y-2">
            <button onClick={() => handleFunctionClick(func.id)} className={`w-full p-4 rounded-lg border transition-all duration-200 ${activeFunction === func.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50 hover:bg-accent/50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${func.color} text-white`}>
                  <func.icon size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-foreground">{func.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{func.description}</p>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {activeFunction === func.id && <div className="ml-4 p-3 bg-muted/30 rounded-lg border-l-2 border-primary">
                {func.id === 'report' && <div className="space-y-3">
                    <ParkingSearchBar
                      placeholder="Caută parcare..."
                      onLocationSelect={(location) => setSelectedParkingLocation(location)}
                      className="w-full"
                      maxResults={8}
                    />
                    {selectedParkingLocation && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={16} className="text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Parcare selectată
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mb-1">
                          {selectedParkingLocation.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {selectedParkingLocation.address}, {selectedParkingLocation.city}
                        </p>
                      </div>
                    )}
                    <button 
                      className={`w-full py-2 rounded text-sm transition-colors ${
                        selectedParkingLocation 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!selectedParkingLocation}
                    >
                      Adaugă Loc Liber
                    </button>
                  </div>}
                
                {func.id === 'inform' && <div className="space-y-3">
                    <select className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Selectează tipul actualizării</option>
                      <option>Alertă Construcții</option>
                      <option>Parcare Eveniment</option>
                      <option>Schimbare Preț</option>
                      <option>Altele</option>
                    </select>
                    <textarea placeholder="Împărtășește actualizarea cu comunitatea" rows={3} className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                      Împărtășește Actualizarea
                    </button>
                  </div>}
                
                {func.id === 'find' && <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Alege parcarea</label>
                      <ParkingSearchBar
                        placeholder="Caută parcare..."
                        onLocationSelect={(location) => setSelectedParkingForFind(location)}
                        className="w-full"
                        maxResults={8}
                      />
                      {selectedParkingForFind && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">
                              Parcare selectată
                            </span>
                          </div>
                          <p className="text-sm text-purple-700 mb-1">
                            {selectedParkingForFind.name}
                          </p>
                          <p className="text-xs text-purple-600">
                            {selectedParkingForFind.address}, {selectedParkingForFind.city}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <select 
                        className="flex-1 px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                      >
                        <option value="">Durata</option>
                        <option value="30">30 minute</option>
                        <option value="60">1 oră</option>
                        <option value="120">2 ore</option>
                        <option value="480">8 ore</option>
                        <option value="1440">Toată ziua</option>
                      </select>
                      <select 
                        className="flex-1 px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={selectedMaxPrice}
                        onChange={(e) => setSelectedMaxPrice(e.target.value)}
                      >
                        <option value="">Preț maxim</option>
                        <option value="5">5 RON/oră</option>
                        <option value="10">10 RON/oră</option>
                        <option value="15">15 RON/oră</option>
                        <option value="20">20 RON/oră</option>
                        <option value="30">30 RON/oră</option>
                        <option value="0">Gratuit</option>
                      </select>
                    </div>
                    
                    <button 
                      className={`w-full py-2 rounded text-sm transition-colors ${
                        selectedParkingForFind && selectedDuration && selectedMaxPrice !== undefined
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!selectedParkingForFind || !selectedDuration || selectedMaxPrice === undefined}
                      onClick={handleFindParking}
                    >
                      Găsește Cele Mai Bune Locuri
                    </button>
                  </div>}
              </div>}
          </div>)}
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Mai Multe Acțiuni
        </h3>
        <div className="space-y-2">
          {quickActions.map(action => (
            <button key={action.title} className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <action.icon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-foreground">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                {action.count !== null && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {action.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="border-t border-border">
        <NotificationsList />
      </div>

      {/* Recent Activity */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Activitate Recentă
        </h3>
        <div className="space-y-2 overflow-y-auto">
          {recentActivity.map((activity, index) => <div key={index} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-2">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.location}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};