"use client";

import React, { useState } from 'react';
import { Bug, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DebugSupabase } from '@/lib/debugSupabase';
import { toast } from 'sonner';

export default function DebugPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    tableExists: boolean;
    structure: boolean;
    count: boolean;
    conflicts: boolean;
    rls: boolean;
    insert: boolean;
    cleanup: boolean;
  } | null>(null);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      console.log('🚀 Încep diagnosticul...');
      
      // 1. Verifică dacă tabela există
      const tableExists = await DebugSupabase.checkTableExists();
      console.log('Table exists result:', tableExists);

      // 2. Verifică structura
      const structure = await DebugSupabase.checkTableStructure();
      console.log('Structure result:', structure);

      // 3. Verifică numărul de parcări
      const count = await DebugSupabase.checkParkingCount();
      console.log('Count result:', count);

      // 4. Verifică conflictele de nume
      const conflicts = await DebugSupabase.checkNameConflicts();
      console.log('Conflicts result:', conflicts);

      // 5. Verifică permisiunile RLS
      const rls = await DebugSupabase.checkRLSPermissions();
      console.log('RLS result:', rls);

      // 6. Testează inserarea Victoriei
      const insertTest = await DebugSupabase.testInsertVictorieiParking();
      console.log('Insert test result:', insertTest);

      // 7. Curăță testul
      let cleanup = false;
      if (insertTest.success && insertTest.id) {
        const cleanupResult = await DebugSupabase.cleanupTestParking(insertTest.id);
        cleanup = cleanupResult.success || false;
        console.log('Cleanup result:', cleanupResult);
      }

      // Setează rezultatele
      setResults({
        tableExists: tableExists.success || false,
        structure: structure.success || false,
        count: count.success || false,
        conflicts: conflicts.success || false,
        rls: rls.success || false,
        insert: insertTest.success || false,
        cleanup: cleanup
      });

      // Afișează rezultatul final
      if ((tableExists.success || false) && (structure.success || false) && (count.success || false) && (insertTest.success || false) && cleanup) {
        toast.success('✅ Diagnostic complet reușit! Baza de date funcționează corect.');
      } else {
        toast.error('❌ Diagnosticul a identificat probleme. Verifică console-ul pentru detalii.');
      }

    } catch (error) {
      console.error('❌ Eroare la diagnostic:', error);
      toast.error('❌ Eroare neașteptată la diagnostic');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: boolean | null | undefined) => {
    if (status === null || status === undefined) return <AlertTriangle size={16} className="text-yellow-500" />;
    return status ? 
      <CheckCircle size={16} className="text-green-500" /> : 
      <XCircle size={16} className="text-red-500" />;
  };

  const getStatusText = (status: boolean | null | undefined, label: string) => {
    if (status === null || status === undefined) return `${label}: În așteptare`;
    return `${label}: ${status ? '✅ OK' : '❌ Eșuat'}`;
  };

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bug size={20} className="text-blue-500" />
        <h3 className="font-medium text-foreground">Debug Supabase</h3>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(results?.tableExists)}
          <span className="text-sm">{getStatusText(results?.tableExists, 'Tabela există')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(results?.structure)}
          <span className="text-sm">{getStatusText(results?.structure, 'Structura')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(results?.count)}
          <span className="text-sm">{getStatusText(results?.count, 'Numărarea')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(results?.conflicts)}
          <span className="text-sm">{getStatusText(results?.conflicts, 'Conflictele')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(results?.rls)}
          <span className="text-sm">{getStatusText(results?.rls, 'Permisiunile RLS')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(results?.insert)}
          <span className="text-sm">{getStatusText(results?.insert, 'Inserarea Victoriei')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(results?.cleanup)}
          <span className="text-sm">{getStatusText(results?.cleanup, 'Curățarea')}</span>
        </div>
      </div>

      <button
        onClick={runDiagnostic}
        disabled={isRunning}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isRunning
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <Play size={16} className={isRunning ? 'animate-pulse' : ''} />
        {isRunning ? 'Rulez diagnosticul...' : 'Rulează Diagnostic Complet'}
      </button>

      <div className="mt-3 text-xs text-muted-foreground">
        <p>• Verifică dacă tabela parking_locations există</p>
        <p>• Testează structura și permisiunile RLS</p>
        <p>• Verifică conflictele de nume</p>
        <p>• Testează inserarea Parcare Victoriei</p>
        <p>• Rezultatele apar în console și aici</p>
      </div>
    </div>
  );
} 