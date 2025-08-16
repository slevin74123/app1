"use client";

import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, Users, TrendingUp, MapPin, Clock, MessageSquare } from 'lucide-react';
import ParkingSearchBar from './ParkingSearchBar';
import { type SearchResult } from '@/lib/parkingService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function AppFunctionsSidebar() {
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [selectedParkingLocation, setSelectedParkingLocation] = useState<SearchResult | null>(null);
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
  }, {
    id: 'alert',
    icon: AlertTriangle,
    title: 'Alertă Parcări',
    description: 'Creează alerte pentru locuri de parcare',
    color: 'bg-orange-500',
    textColor: 'text-orange-600'
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

  const handleReportParking = () => {
    if (selectedParkingLocation) {
      toast.success(`Loc liber raportat pentru ${selectedParkingLocation.name}!`);
      setSelectedParkingLocation(null);
      setActiveFunction(null);
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

        {activeFunction === 'find' && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium mb-3">Găsește un Loc</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Această funcționalitate va fi implementată în curând.
            </p>
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} />
                <span className="text-sm">În dezvoltare...</span>
              </div>
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
                  <select className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Selectează durata</option>
                    <option value="30">30 minute</option>
                    <option value="60">1 oră</option>
                    <option value="120">2 ore</option>
                    <option value="480">8 ore</option>
                    <option value="1440">Toată ziua</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preț maxim (RON/oră)</label>
                  <select className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Selectează prețul</option>
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
                onClick={() => {
                  if (selectedParkingLocation) {
                    toast.success(`Alertă creată pentru ${selectedParkingLocation.name}! Vei fi notificat când se raportează locuri libere.`);
                    setSelectedParkingLocation(null);
                    setActiveFunction(null);
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

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Acțiuni Rapide</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-2 rounded-lg bg-muted">
                  <action.icon size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                {action.count !== null && (
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    {action.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-medium mb-3">Activitate Recentă</h3>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.location} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}