"use client";

import React, { useState } from 'react';
import { Car, MapPin, Star, Clock, Users, Zap, Bug, X } from 'lucide-react';
import { toast } from 'sonner';
import { ParkingSpotService } from '@/lib/parkingSpotService';

interface AppFunctionsSidebarProps {
  user: any;
  onClose: () => void;
}

export default function AppFunctionsSidebar({ user, onClose }: AppFunctionsSidebarProps) {
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReportParking = async () => {
    if (!user) {
      toast.error('Trebuie să fii autentificat pentru a raporta un loc liber');
      return;
    }

    setIsLoading(true);
    try {
      // Simulează raportarea unui loc liber
      const result = await ParkingSpotService.reportFreeParkingSpot(
        'parking-location-1', // ID-ul locației de parcare
        'A1', // Numărul locului
        user.id, // ID-ul utilizatorului
        'Loc liber raportat de utilizator' // Note
      );

      if (result.success) {
        toast.success('Loc liber raportat cu succes!');
        
        // Emite evenimentul pentru actualizarea datelor
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('parkingStatsUpdated', {
            detail: {
              parkingLocationId: 'parking-location-1',
              message: 'Parking spot reported successfully',
              timestamp: new Date().toISOString()
            }
          }));
        }
      } else {
        toast.error(result.error || 'Eroare la raportarea locului liber');
      }
    } catch (error) {
      console.error('Error reporting parking spot:', error);
      toast.error('Eroare la raportarea locului liber');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickActions = (action: string) => {
    switch (action) {
      case 'findParking':
        toast.info('Căutare locuri de parcare...');
        break;
      case 'favorites':
        toast.info('Deschidere favorite...');
        break;
      case 'history':
        toast.info('Deschidere istoric...');
        break;
      case 'settings':
        toast.info('Deschidere setări...');
        break;
      default:
        break;
    }
  };

  if (activeFunction === 'reportParking') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Raportează Loc Liber</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Locația de parcare</label>
              <select className="w-full p-2 border border-border rounded-md bg-background">
                <option>Parcare Centru - Piața Victoriei</option>
                <option>Parcare Herăstrău</option>
                <option>Parcare Universitate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Numărul locului</label>
              <input 
                type="text" 
                placeholder="ex: A1, B5, C12"
                className="w-full p-2 border border-border rounded-md bg-background"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Note (opțional)</label>
              <textarea 
                placeholder="Observații despre locul de parcare..."
                className="w-full p-2 border border-border rounded-md bg-background h-20"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setActiveFunction(null)}
              className="flex-1 p-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={handleReportParking}
              disabled={isLoading}
              className="flex-1 p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-md font-medium transition-colors"
            >
              {isLoading ? 'Se procesează...' : 'Raportează'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-xl z-40 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Funcții Aplicație</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Funcții Rapide</h3>
          
          {/* Raportează Loc Liber */}
          <button
            onClick={() => setActiveFunction('reportParking')}
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Car size={20} />
            Raportează Loc Liber
          </button>

          {/* Acțiuni Rapide */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickActions('findParking')}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              Găsește
            </button>
            
            <button
              onClick={() => handleQuickActions('favorites')}
              className="p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Star size={20} />
              Favorite
            </button>
            
            <button
              onClick={() => handleQuickActions('history')}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Clock size={20} />
              Istoric
            </button>
            
            <button
              onClick={() => handleQuickActions('settings')}
              className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              Setări
            </button>
          </div>

          {/* Statistici Rapide */}
          <div className="mt-6 p-4 bg-accent rounded-lg">
            <h4 className="font-semibold mb-3 text-foreground">Statistici Rapide</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Locuri disponibile</span>
                <span className="font-medium text-foreground">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Locuri rezervate</span>
                <span className="font-medium text-foreground">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Utilizatori activi</span>
                <span className="font-medium text-foreground">156</span>
              </div>
            </div>
          </div>

          {/* Informații Utilizator */}
          {user && (
            <div className="mt-6 p-4 bg-accent rounded-lg">
              <h4 className="font-semibold mb-3 text-foreground">Contul tău</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">5 locuri favorite</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">12 raportări</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}