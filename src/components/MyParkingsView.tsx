"use client";

import * as React from "react";
import { Car, Clock, MapPin, CreditCard, TrendingUp, BarChart3, Activity } from 'lucide-react';
export interface MyParkingsViewProps {
  className?: string;
}
export default function MyParkingsView({
  className = ""
}: MyParkingsViewProps) {
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
  }] as {
    id: number;
    location: string;
    status: string;
    timeRemaining: string;
    cost: string;
    startTime: string;
    endTime: string;
    type: string;
  }[];
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
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
  return <div className={`h-full bg-background overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Car className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Parcările Mele</h1>
            <p className="text-muted-foreground">Gestionează sesiunile tale de parcare</p>
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

      {/* Parking Sessions */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Sesiuni de Parcare</h2>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-muted-foreground" size={20} />
            <span className="text-sm text-muted-foreground">Luna aceasta</span>
          </div>
        </div>

        <div className="space-y-4">
          {myParkings.map(parking => <div key={parking.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <MapPin className="text-muted-foreground" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{parking.location}</h3>
                    <p className="text-muted-foreground text-sm">{parking.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(parking.status)}`}>
                  {getStatusText(parking.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Timp Rămas</p>
                  <p className="font-medium text-foreground">{parking.timeRemaining}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Cost</p>
                  <p className="font-medium text-foreground">{parking.cost}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Început</p>
                  <p className="font-medium text-foreground">{parking.startTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Sfârșit</p>
                  <p className="font-medium text-foreground">{parking.endTime}</p>
                </div>
              </div>

              {parking.status === 'active' && <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                      Oprește Parcarea
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Prelungește Timpul
                    </button>
                  </div>
                </div>}

              {parking.status === 'reserved' && <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Activează Acum
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                      Anulează Rezervarea
                    </button>
                  </div>
                </div>}
            </div>)}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Activitate Recentă</h3>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Parcare activată</p>
                  <p className="text-xs text-muted-foreground">Str. Victoriei 15 • Acum 2 ore</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Rezervare creată</p>
                  <p className="text-xs text-muted-foreground">Piața Unirii • Acum 4 ore</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Sesiune finalizată</p>
                  <p className="text-xs text-muted-foreground">Mall Băneasa • Ieri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}