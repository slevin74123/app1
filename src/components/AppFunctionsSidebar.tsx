"use client";

import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, MapPin, Clock, MessageSquare } from 'lucide-react';
import ParkingSearchBar from './ParkingSearchBar';
import { type SearchResult } from '@/lib/parkingService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { activityService, type ActivityItem } from '@/lib/activityService';
import { alertsService } from '@/lib/alertsService';
import { useRealTimeActivities } from '@/hooks/useRealTimeActivities';

export default function AppFunctionsSidebar() {
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [selectedParkingLocation, setSelectedParkingLocation] = useState<SearchResult | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('60');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>('10');
  const { user } = useAuth();
  
  // Hook pentru activități în timp real
  const { activities: recentActivities, isLoading: isLoadingActivities, refresh: refreshActivities } = useRealTimeActivities(5, 30000);

  // Funcție pentru a reveni la dashboard
  const handleBackToDashboard = () => {
    window.dispatchEvent(new CustomEvent('showCommonChat', {
      detail: { show: false }
    }));
  };

  const mainFunctions = [{
    id: 'report',
    icon: Plus,
    title: 'Raportează Loc Liber',
    description: 'Ajută comunitatea raportând parcări disponibile',
    color: 'bg-green-500',
    textColor: 'text-green-600'
  }, {
    id: 'alert',
    icon: AlertTriangle,
    title: 'Alertă Parcări',
    description: 'Creează alerte pentru locuri de parcare',
    color: 'bg-orange-500',
    textColor: 'text-orange-600'
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

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'parking_reported':
        return <div className="p-2 rounded-lg bg-green-100"><Plus className="w-4 h-4 text-green-600" /></div>;
      case 'community_update':
        return <div className="p-2 rounded-lg bg-blue-100"><MessageSquare className="w-4 h-4 text-blue-600" /></div>;
      case 'parking_reserved':
        return <div className="p-2 rounded-lg bg-purple-100"><Clock className="w-4 h-4 text-purple-600" /></div>;
      case 'alert_created':
        return <div className="p-2 rounded-lg bg-orange-100"><AlertTriangle className="w-4 h-4 text-orange-600" /></div>;
      case 'chat_message':
        return <div className="p-2 rounded-lg bg-indigo-100"><MessageSquare className="w-4 h-4 text-indigo-600" /></div>;
      default:
        return <div className="p-2 rounded-lg bg-gray-100"><MessageSquare className="w-4 h-4 text-gray-600" /></div>;
    }
  };

  const getActivityText = (actionType: string) => {
    switch (actionType) {
      case 'parking_reported':
        return 'Loc nou raportat';
      case 'community_update':
        return 'Actualizare comunitate';
      case 'parking_reserved':
        return 'Loc rezervat';
      case 'alert_created':
        return 'Alertă creată';
      case 'chat_message':
        return 'Mesaj chat';
      default:
        return 'Activitate';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Acum';
    if (diffInMinutes < 60) return `acum ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `acum ${Math.floor(diffInMinutes / 60)}h`;
    return `acum ${Math.floor(diffInMinutes / 1440)} zile`;
  };

  const handleReportParking = async () => {
    if (selectedParkingLocation) {
      try {
        // Creează activitate pentru locul raportat
        if (user) {
          await activityService.reportParkingActivity(
            user.id,
            selectedParkingLocation.name,
            `Loc liber raportat în ${selectedParkingLocation.address}`
          );
        }
        
        toast.success(`Loc liber raportat pentru ${selectedParkingLocation.name}!`);
        setSelectedParkingLocation(null);
        setActiveFunction(null);
        
        // Reîncarcă activitățile recente
        await refreshActivities();
      } catch (error) {
        console.error('Error creating activity:', error);
        toast.success(`Loc liber raportat pentru ${selectedParkingLocation.name}!`);
        setSelectedParkingLocation(null);
        setActiveFunction(null);
      }
    } else {
      toast.error('Te rog selectează o parcare din listă.');
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Funcții Rapide</h2>
        
        {/* Main Functions */}
        <div className="space-y-3 mb-6">
          {mainFunctions.map((func) => (
            <div
              key={func.id}
              className={`p-4 rounded-lg border border-border cursor-pointer transition-all hover:shadow-md ${
                activeFunction === func.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleFunctionClick(func.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${func.color}`}>
                  <func.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${func.textColor}`}>{func.title}</h3>
                  <p className="text-sm text-muted-foreground">{func.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Function Details */}
        {activeFunction === 'report' && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium mb-3">Raportează Loc Liber</h3>
            <div className="space-y-3">
              <ParkingSearchBar
                placeholder="Caută parcarea..."
                onLocationSelect={setSelectedParkingLocation}
                className="w-full"
                maxResults={8}
              />
              {selectedParkingLocation && (
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="font-medium">{selectedParkingLocation.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedParkingLocation.address}
                  </p>
                </div>
              )}
              <button
                onClick={handleReportParking}
                disabled={!selectedParkingLocation}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Raportează Loc Liber
              </button>
            </div>
          </div>
        )}

        {activeFunction === 'alert' && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium mb-3">Alertă Parcări</h3>
            <div className="space-y-3">
              <ParkingSearchBar
                placeholder="Caută parcarea pentru alertă..."
                onLocationSelect={setSelectedParkingLocation}
                className="w-full"
                maxResults={8}
              />
              {selectedParkingLocation && (
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="font-medium">{selectedParkingLocation.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedParkingLocation.address}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Durata dorită</label>
                  <select 
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="30">30 minute</option>
                    <option value="60">1 oră</option>
                    <option value="120">2 ore</option>
                    <option value="480">8 ore</option>
                    <option value="1440">Toată ziua</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preț maxim (RON/oră)</label>
                  <select 
                    value={selectedMaxPrice}
                    onChange={(e) => setSelectedMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="5">5 RON/oră</option>
                    <option value="10">10 RON/oră</option>
                    <option value="15">15 RON/oră</option>
                    <option value="20">20 RON/oră</option>
                    <option value="30">30 RON/oră</option>
                    <option value="0">Gratuit</option>
                  </select>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (selectedParkingLocation) {
                    try {
                      // Creează alerta în baza de date
                      if (user) {
                        const alertResult = await alertsService.createAlert({
                          user_id: user.id,
                          parking_name: selectedParkingLocation.name,
                          location: selectedParkingLocation.address,
                          duration_minutes: parseInt(selectedDuration),
                          max_price_per_hour: parseFloat(selectedMaxPrice)
                        });

                        if (alertResult.success) {
                          // Creează activitate pentru alerta creată
                          await activityService.alertCreatedActivity(
                            user.id,
                            selectedParkingLocation.name,
                            `Alertă creată pentru ${selectedParkingLocation.name}`
                          );
                          
                          toast.success(`Alertă creată pentru ${selectedParkingLocation.name}! Vei fi notificat când se raportează locuri libere.`);
                          setSelectedParkingLocation(null);
                          setActiveFunction(null);
                          
                          // Reîncarcă activitățile recente
                          await refreshActivities();
                        } else {
                          toast.error(`Eroare la crearea alertei: ${alertResult.error}`);
                        }
                      }
                    } catch (error) {
                      console.error('Error creating alert:', error);
                      toast.error('Eroare neașteptată la crearea alertei');
                    }
                  } else {
                    toast.error('Te rog selectează o parcare din listă.');
                  }
                }}
                disabled={!selectedParkingLocation}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Creează Alertă
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Activitate Recentă</h3>
          <div className="space-y-2">
            {isLoadingActivities ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-xs text-muted-foreground mt-2">Se încarcă...</p>
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  {getActivityIcon(activity.action_type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{getActivityText(activity.action_type)}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.location} • {formatTimeAgo(activity.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">Nu există activități recente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}