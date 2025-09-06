'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MyParkingsView from '@/components/MyParkingsView';


export default function MyParkingsPage() {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBackToDashboard}
              className="p-2 hover:bg-accent rounded-lg transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
              <span>Înapoi la Dashboard</span>
            </button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold text-foreground">Parcările Mele</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <MyParkingsView />
        </main>
      </div>
    
  );
} 
