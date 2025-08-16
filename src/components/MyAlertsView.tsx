"use client";

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, MapPin, Clock, DollarSign, X, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { alertsService, type ParkingAlert } from '@/lib/alertsService';

export default function MyAlertsView() {
  const [alerts, setAlerts] = useState<ParkingAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Funcție pentru a reveni la dashboard
  const handleBackToDashboard = () => {
    window.dispatchEvent(new CustomEvent('showMyAlerts', {
      detail: { show: false }
    }));
  };

  // Încarcă alertele utilizatorului
  useEffect(() => {
    if (user) {
      loadUserAlerts();
    }
  }, [user]);

  const loadUserAlerts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const result = await alertsService.getUserAlerts(user.id);
      
      if (result.success && result.data) {
        setAlerts(result.data);
      } else {
        console.error('Error loading alerts:', result.error);
        toast.error('Eroare la încărcarea alertelor');
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Eroare neașteptată');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAlert = async (alertId: string) => {
    try {
      const result = await alertsService.updateAlertStatus(alertId, false);
      
      if (result.success) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, is_active: false }
            : alert
        ));
        toast.success('Alertă anulată cu succes!');
      } else {
        toast.error(`Eroare la anularea alertei: ${result.error}`);
      }
    } catch (error) {
      console.error('Error canceling alert:', error);
      toast.error('Eroare neașteptată');
    }
  };

  const handleReactivateAlert = async (alertId: string) => {
    try {
      const result = await alertsService.updateAlertStatus(alertId, true);
      
      if (result.success) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, is_active: true }
            : alert
        ));
        toast.success('Alertă reactivată cu succes!');
      } else {
        toast.error(`Eroare la reactivarea alertei: ${result.error}`);
      }
    } catch (error) {
      console.error('Error reactivating alert:', error);
      toast.error('Eroare neașteptată');
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const result = await alertsService.deleteAlert(alertId);
      
      if (result.success) {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
        toast.success('Alertă ștearsă cu succes!');
      } else {
        toast.error(`Eroare la ștergerea alertei: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Eroare neașteptată');
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)} zile`;
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

  const activeAlerts = alerts.filter(alert => alert.is_active);
  const inactiveAlerts = alerts.filter(alert => !alert.is_active);

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBackToDashboard}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Înapoi la Dashboard"
          >
            <ArrowLeft className="text-muted-foreground" size={20} />
          </button>
          <div className="p-3 bg-orange-100 rounded-xl">
            <Bell className="text-orange-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alertele Mele</h1>
            <p className="text-muted-foreground">Gestionează alertele tale de parcare</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Bell className="text-orange-700" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{activeAlerts.length}</p>
                <p className="text-sm text-orange-600">Alerte Active</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Clock className="text-blue-700" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{inactiveAlerts.length}</p>
                <p className="text-sm text-blue-600">Alerte Inactive</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <AlertTriangle className="text-green-700" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{alerts.length}</p>
                <p className="text-sm text-green-600">Total Alerte</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Se încarcă alertele...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-foreground">Alerte Active</h2>
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Bell className="text-orange-600" size={18} />
                            <h3 className="font-semibold text-orange-800">{alert.parking_name}</h3>
                            <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">
                              Activă
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="text-orange-600" size={16} />
                              <span className="text-orange-700">{alert.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="text-orange-600" size={16} />
                              <span className="text-orange-700">{formatDuration(alert.duration_minutes)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="text-orange-600" size={16} />
                              <span className="text-orange-700">Max {alert.max_price_per_hour} RON/oră</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-orange-600 mt-2">
                            Creată {formatTimeAgo(alert.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCancelAlert(alert.id)}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title="Anulează alerta"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Șterge alerta"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Alerts */}
            {inactiveAlerts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-foreground">Alerte Inactive</h2>
                <div className="space-y-3">
                  {inactiveAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Bell className="text-gray-500" size={18} />
                            <h3 className="font-semibold text-gray-700">{alert.parking_name}</h3>
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                              Inactivă
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="text-gray-500" size={16} />
                              <span className="text-gray-600">{alert.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="text-gray-500" size={16} />
                              <span className="text-gray-600">{formatDuration(alert.duration_minutes)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="text-gray-500" size={16} />
                              <span className="text-gray-600">Max {alert.max_price_per_hour} RON/oră</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            Creată {formatTimeAgo(alert.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReactivateAlert(alert.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Reactivează alerta"
                          >
                            <Bell size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Șterge alerta"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {alerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nu ai alerte încă</h3>
                <p className="text-muted-foreground mb-4">
                  Creează alerte pentru a fi notificat când se eliberează locuri de parcare
                </p>
                <button
                  onClick={handleBackToDashboard}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Creează Prima Alertă
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 