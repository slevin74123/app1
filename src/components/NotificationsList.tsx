"use client";

import React, { useState } from 'react';
import { Bell, MapPin, Clock, DollarSign, X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function NotificationsList() {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  // Mock data pentru testare
  const mockNotifications = [
    {
      id: '1',
      parking_name: 'Parcare Basarab',
      duration: 120,
      max_price: 20,
      created_at: '2025-08-16T10:00:00Z',
      is_active: true
    }
  ];

  const activeNotifications = mockNotifications.filter(n => n.is_active);
  const inactiveNotifications = mockNotifications.filter(n => !n.is_active);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} ore`;
    return `${Math.floor(minutes / 1440)} zile`;
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return 'Gratuit';
    return `${price} RON/oră`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'active'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={16} />
            <span>Active ({activeNotifications.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('inactive')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'inactive'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            <span>Inactive ({inactiveNotifications.length})</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'active' ? (
          // Active Notifications Tab
          <div className="space-y-3">
            {activeNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={48} className="text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nu ai alerte active</h3>
                <p className="text-sm text-muted-foreground">
                  Creează o alertă din secțiunea "Găsește un Loc" pentru a fi notificat când se raportează locuri libere.
                </p>
              </div>
            ) : (
              activeNotifications.map((notification) => (
                <div key={notification.id} className="p-4 bg-muted/30 border border-border rounded-lg">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      <span className="font-medium text-foreground">
                        {notification.parking_name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        title="Dezactivează alerta"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>Durata: {formatDuration(notification.duration)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign size={14} />
                      <span>Preț max: {formatPrice(notification.max_price)}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Creată: {new Date(notification.created_at).toLocaleDateString('ro-RO')}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle size={14} />
                      <span>Activă - vei fi notificat când se raportează locuri libere</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Inactive Notifications Tab
          <div className="space-y-3">
            {inactiveNotifications.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle size={48} className="text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nu ai alerte inactive</h3>
                <p className="text-sm text-muted-foreground">
                  Toate alertele tale sunt active sau nu ai creat încă nicio alertă.
                </p>
              </div>
            ) : (
              inactiveNotifications.map((notification) => (
                <div key={notification.id} className="p-4 bg-muted/20 border border-border rounded-lg opacity-75">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">
                        {notification.parking_name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Șterge alerta"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>Durata: {formatDuration(notification.duration)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign size={14} />
                      <span>Preț max: {formatPrice(notification.max_price)}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Creată: {new Date(notification.created_at).toLocaleDateString('ro-RO')}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertTriangle size={14} />
                      <span>Inactivă - nu vei mai fi notificat</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 