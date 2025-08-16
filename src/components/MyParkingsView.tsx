"use client";

import * as React from "react";
import { Car, Clock, MapPin, Calendar, CreditCard, TrendingUp, BarChart3, Activity, Heart, Star, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { cn } from '@/lib/utils';

export interface MyParkingsViewProps {
  className?: string;
}

export default function MyParkingsView({
  className = ""
}: MyParkingsViewProps) {
  const { favorites, isLoading } = useFavorites();

  // Mock data pentru sesiunile active (în viitor vor veni din Supabase)
  const myParkings = [{
    id: 1,
    location: "Str. Victoriei 15",
    status: "active",
    timeRemaining: "2h 15m",
    cost: "8.50 RON",
    startTime: "14:30",
    endTime: "18:45",
    type: "Parcare Stradală"
  }, {
    id: 2,
    location: "Piața Unirii",
    status: "reserved",
    timeRemaining: "Începe la 18:30",
    cost: "12.00 RON",
    startTime: "18:30",
    endTime: "21:30",
    type: "Parcare Subterană"
  }, {
    id: 3,
    location: "Mall Băneasa",
    status: "completed",
    timeRemaining: "Finalizat",
    cost: "15.00 RON",
    startTime: "10:00",
    endTime: "13:00",
    type: "Parcare Mall"
  }] as any[];

  const monthlyStats = {
    totalHours: 45.5,
    totalCost: 234,
    savings: 67,
    sessionsCount: 18
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-green-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activ';
      case 'reserved':
        return 'Rezervat';
      case 'completed':
        return 'Finalizat';
      default:
        return 'Necunoscut';
    }
  };

  return (
    <div className={`h-full bg-background overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Car className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Parcările Mele</h1>
            <p className="text-muted-foreground">Gestionează sesiunile tale de parcare și favoritele</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <Clock className="text-green-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Total Ore</p>
                <p className="text-xl font-bold text-green-800">{monthlyStats.totalHours}h</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <CreditCard className="text-blue-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Cost</p>
                <p className="text-xl font-bold text-blue-800">{monthlyStats.totalCost} RON</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <TrendingUp className="text-purple-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Economii</p>
                <p className="text-xl font-bold text-purple-800">{monthlyStats.savings} RON</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Activity className="text-orange-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Sesiuni</p>
                <p className="text-xl font-bold text-orange-800">{monthlyStats.sessionsCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="p-6 space-y-6">
        {/* Favorites Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Favoritele Mele</h2>
            <span className="text-sm text-muted-foreground">({favorites.length} parcare{favorites.length !== 1 ? 'i' : ''})</span>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Se încarcă favoritele...</p>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{favorite.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin size={14} />
                        {favorite.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{favorite.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {favorite.price > 0 ? `${favorite.price} RON/h` : 'Gratuit'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Adăugat: {favorite.addedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nu ai încă parcare favorite</p>
              <p className="text-sm text-muted-foreground mt-1">
                Dă click pe parcarea pe hartă și apasă "Adaugă la Favorite"
              </p>
            </div>
          )}
        </div>

        {/* Active Sessions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Car className="text-green-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sesiuni Active</h2>
          </div>

          <div className="space-y-3">
            {myParkings.filter(parking => parking.status === 'active' || parking.status === 'reserved').map((parking) => (
              <div key={parking.id} className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <MapPin className="text-muted-foreground" size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{parking.location}</h3>
                      <p className="text-sm text-muted-foreground">{parking.type}</p>
                    </div>
                  </div>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getStatusColor(parking.status))}>
                    {getStatusText(parking.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Timp rămas:</span>
                    <span className="font-medium">{parking.timeRemaining}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">{parking.cost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Începe:</span>
                    <span className="font-medium">{parking.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Se termină:</span>
                    <span className="font-medium">{parking.endTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Sessions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BarChart3 className="text-gray-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sesiuni Finalizate</h2>
          </div>

          <div className="space-y-3">
            {myParkings.filter(parking => parking.status === 'completed').map((parking) => (
              <div key={parking.id} className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <MapPin className="text-muted-foreground" size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{parking.location}</h3>
                      <p className="text-sm text-muted-foreground">{parking.type}</p>
                    </div>
                  </div>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getStatusColor(parking.status))}>
                    {getStatusText(parking.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Durată:</span>
                    <span className="font-medium">3h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">{parking.cost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">Astăzi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">Finalizat</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}