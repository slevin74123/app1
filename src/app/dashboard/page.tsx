"use client";

import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ParkingSyncButton from '@/components/ParkingSyncButton';
import MainSearchBar from '@/components/MainSearchBar';
import MapWithParkingPins from '@/components/MapWithParkingPins';
import UserSidebar from '@/components/UserSidebar';
import MyParkingsView from '@/components/MyParkingsView';
import CommonChatView from '@/components/CommonChatView';
import CommunityWallView from '@/components/CommunityWallView';
import AppFunctionsSidebar from '@/components/AppFunctionsSidebar';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<any>({
    priceRange: [0, 50],
    availability: 'all',
    type: 'all'
  });
  
  // State pentru diferitele view-uri
  const [showMyParkings, setShowMyParkings] = useState(false);
  const [showCommonChat, setShowCommonChat] = useState(false);
  const [showCommunityWall, setShowCommunityWall] = useState(false);
  const [showNearbyParking, setShowNearbyParking] = useState(false);

  useEffect(() => {
    // Event listeners pentru navigarea din sidebar
    const handleShowMyParkings = (event: CustomEvent) => {
      setShowMyParkings(event.detail.show);
      setShowCommonChat(false);
      setShowCommunityWall(false);
      setShowNearbyParking(false);
    };

    const handleShowCommonChat = (event: CustomEvent) => {
      setShowCommonChat(event.detail.show);
      setShowMyParkings(false);
      setShowCommunityWall(false);
      setShowNearbyParking(false);
    };

    const handleShowCommunityWall = (event: CustomEvent) => {
      setShowCommunityWall(event.detail.show);
      setShowMyParkings(false);
      setShowCommonChat(false);
      setShowNearbyParking(false);
    };

    const handleShowNearbyParking = (event: CustomEvent) => {
      setShowNearbyParking(event.detail.show);
      setShowMyParkings(false);
      setShowCommonChat(false);
      setShowCommunityWall(false);
    };

    // Adaugă event listeners
    window.addEventListener('showMyParkings', handleShowMyParkings as EventListener);
    window.addEventListener('showCommonChat', handleShowCommonChat as EventListener);
    window.addEventListener('showCommunityWall', handleShowCommunityWall as EventListener);
    window.addEventListener('showNearbyParking', handleShowNearbyParking as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('showMyParkings', handleShowMyParkings as EventListener);
      window.removeEventListener('showCommonChat', handleShowCommonChat as EventListener);
      window.removeEventListener('showCommunityWall', handleShowCommunityWall as EventListener);
      window.removeEventListener('showNearbyParking', handleShowNearbyParking as EventListener);
    };
  }, []);

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSelectedFilters(filters);
    setActiveView('map');
  };

  const renderMainContent = () => {
    // Dacă un view special este activ, afișează-l
    if (showMyParkings) {
      return <MyParkingsView />;
    }

    if (showCommonChat) {
      return <CommonChatView />;
    }

    if (showCommunityWall) {
      return <CommunityWallView />;
    }

    // Altfel, afișează conținutul normal (hartă)
    switch (activeView) {
      case 'map':
        return (
          <div className="flex flex-col h-full">
            <MainSearchBar />
            <div className="flex-1">
              <MapWithParkingPins searchQuery={searchQuery} filters={selectedFilters} />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="flex flex-col h-full">
            <MainSearchBar />
            <div className="flex-1">
              <MapWithParkingPins searchQuery={searchQuery} filters={selectedFilters} />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col h-full">
            <MainSearchBar />
            <div className="flex-1">
              <MapWithParkingPins searchQuery={searchQuery} filters={selectedFilters} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - UserSidebar cu Parcările mele, Chat Comunitate, etc. */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-background">
          <h1 className="text-xl font-semibold">Parcare Inteligentă</h1>
          <div className="flex items-center space-x-4">
            <ParkingSyncButton />
            <button className="p-2 rounded-full hover:bg-accent">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* Right Sidebar - App Functions (doar când nu sunt afișate view-urile speciale) */}
      {!showMyParkings && !showCommonChat && !showCommunityWall && (
        <div className="w-full lg:w-72 xl:w-80 bg-card border-t lg:border-t-0 lg:border-l border-border">
          <AppFunctionsSidebar />
        </div>
      )}
    </div>
  );
} 