'use client';

import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import MapWithParkingPins from '@/components/MapWithParkingPins';
import AppFunctionsSidebar from '@/components/AppFunctionsSidebar';
import ParkingList from '@/components/ParkingList';
import MyParkingsView from '@/components/MyParkingsView';
import CommonChatView from '@/components/CommonChatView';
import CommunityWallView from '@/components/CommunityWallView';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import HeaderNavigation from "@/components/HeaderNavigation";

const defaultFilters = {
  priceRange: [0, 50] as [number, number],
  availability: 'all',
  type: 'all'
};

const DashboardPage: React.FC = () => {
  const [isMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'list' | 'my-parkings' | 'chat' | 'community'>('map');

  useEffect(() => {
    const handleShowMyParkings = (event: CustomEvent) => {
      if (event.detail.show) {
        setActiveView('my-parkings');
      }
    };

    const handleShowCommonChat = (event: CustomEvent) => {
      if (event.detail.show) {
        setActiveView('chat');
      }
    };

    const handleShowCommunityWall = (event: CustomEvent) => {
      if (event.detail.show) {
        setActiveView('community');
      }
    };

    const handleShowNearbyParking = (event: CustomEvent) => {
      if (event.detail.show) {
        setActiveView('list');
      }
    };

    window.addEventListener('showMyParkings', handleShowMyParkings as EventListener);
    window.addEventListener('showCommonChat', handleShowCommonChat as EventListener);
    window.addEventListener('showCommunityWall', handleShowCommunityWall as EventListener);
    window.addEventListener('showNearbyParking', handleShowNearbyParking as EventListener);

    return () => {
      window.removeEventListener('showMyParkings', handleShowMyParkings as EventListener);
      window.removeEventListener('showCommonChat', handleShowCommonChat as EventListener);
      window.removeEventListener('showCommunityWall', handleShowCommunityWall as EventListener);
      window.removeEventListener('showNearbyParking', handleShowNearbyParking as EventListener);
    };
  }, []);

  const renderMainContent = () => {
    switch (activeView) {
      case 'map':
        return <MapWithParkingPins filters={defaultFilters} />;
      case 'list':
        return <ParkingList searchQuery="" filters={defaultFilters} />; // Pass empty string for now
      case 'my-parkings':
        return <MyParkingsView />;
      case 'chat':
        return <CommonChatView />;
      case 'community':
        return <CommunityWallView />;
      default:
        return <MapWithParkingPins filters={defaultFilters} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
        <HeaderNavigation showNotifications={true} />
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - User Sidebar */}
          <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
            <UserSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Main Content */}
            <main className="flex-1 overflow-hidden h-full">
              {renderMainContent()}
            </main>
          </div>

          {/* Right Sidebar - App Functions */}
          <div className="hidden xl:block w-80 bg-card border-l border-border">
            <AppFunctionsSidebar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage; 