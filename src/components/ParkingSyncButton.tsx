"use client";

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { ParkingSyncService } from '@/lib/parkingSyncService';
import { toast } from 'sonner';

export default function ParkingSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const result = await ParkingSyncService.syncMapParkingsWithDatabase();
      
      if (result.success) {
        setSyncStatus('success');
        setLastSync(new Date());
        toast.success(`Sincronizare completă! ${result.count} parcări noi adăugate.`);
      } else {
        setSyncStatus('error');
        toast.error(`Eroare la sincronizare: ${result.error}`);
      }
    } catch (error) {
      setSyncStatus('error');
      toast.error('Eroare neașteptată la sincronizare');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isSyncing
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
        title="Sincronizează parcările de pe hartă cu baza de date"
      >
        <RefreshCw 
          size={16} 
          className={isSyncing ? 'animate-spin' : ''} 
        />
        {isSyncing ? 'Sincronizare...' : 'Sincronizează Parcări'}
      </button>

      {/* Status indicator */}
      {syncStatus === 'success' && (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle size={16} />
          <span className="text-xs">Sincronizat</span>
        </div>
      )}

      {syncStatus === 'error' && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle size={16} />
          <span className="text-xs">Eroare</span>
        </div>
      )}

      {/* Last sync info */}
      {lastSync && (
        <span className="text-xs text-muted-foreground">
          Ultima sincronizare: {lastSync.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
} 