"use client";

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Funcții Rapide</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-medium">Raportează Loc Liber</h3>
              <p className="text-sm text-muted-foreground">Ajută comunitatea raportând parcări disponibile</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-medium">Găsește un Loc</h3>
              <p className="text-sm text-muted-foreground">Primește recomandări personalizate de parcare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-background">
          <h1 className="text-xl font-semibold">Parcare Inteligentă</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-accent">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Harta Parcărilor</h2>
            <p className="text-muted-foreground">Harta va fi afișată aici</p>
          </div>
        </main>
      </div>

      {/* Right Sidebar - Notificări */}
      <div className="w-80 bg-card border-l border-border">
        {/* Alerte Parcări Section */}
        <div className="h-full">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Alerte Parcări
            </h3>
          </div>
          <div className="p-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Nu ai alerte active</h3>
              <p className="text-sm text-muted-foreground">
                Creează o alertă din secțiunea "Găsește un Loc" pentru a fi notificat când se raportează locuri libere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 