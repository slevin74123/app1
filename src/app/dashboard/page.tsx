'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Menu, X, Bell, ChevronDown, LogOut, Settings } from 'lucide-react';
import UserSidebar from '@/components/UserSidebar';
import MapWithParkingPins from '@/components/MapWithParkingPins';
import AppFunctionsSidebar from '@/components/AppFunctionsSidebar';
import ParkingList from '@/components/ParkingList';
import MyParkingsView from '@/components/MyParkingsView';
import CommonChatView from '@/components/CommonChatView';
import CommunityWallView from '@/components/CommunityWallView';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const defaultFilters = {
  priceRange: [0, 50] as [number, number],
  availability: 'all',
  type: 'all'
};

const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'list' | 'my-parkings' | 'chat' | 'community'>('map');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

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
        return <MapWithParkingPins searchQuery={searchQuery} filters={defaultFilters} />;
      case 'list':
        return <ParkingList searchQuery={searchQuery} filters={defaultFilters} />;
      case 'my-parkings':
        return <MyParkingsView />;
      case 'chat':
        return <CommonChatView />;
      case 'community':
        return <CommunityWallView />;
      default:
        return <MapWithParkingPins searchQuery={searchQuery} filters={defaultFilters} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-full bg-background flex overflow-hidden">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMobileMenu} />
        )}

        {/* Left Sidebar - User Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <UserSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
            {/* Left side - Breadcrumbs and Mobile Menu */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMobileMenu} 
                className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors" 
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <nav className="flex items-center text-sm text-muted-foreground">
                <span className="text-foreground font-medium">
                  {activeView === 'map' && 'Harta Parcărilor'}
                  {activeView === 'list' && 'Lista Parcărilor'}
                  {activeView === 'my-parkings' && 'Parcările Mele'}
                  {activeView === 'chat' && 'Chat Comunitate'}
                  {activeView === 'community' && 'Comunitate'}
                </span>
              </nav>
            </div>
            
            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Caută locuri de parcare..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Right side - Filters, Notifications, User Avatar */}
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button
                onClick={toggleFilter}
                className={`p-2 rounded-lg transition-colors ${
                  isFilterOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                aria-label="Filters"
              >
                <Filter size={20} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 hover:bg-accent rounded-lg transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Notificări</h3>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium">Loc nou disponibil</p>
                          <p className="text-muted-foreground">Un loc de parcare a fost eliberat în zona ta</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="font-medium">Rezervare confirmată</p>
                          <p className="text-muted-foreground">Rezervarea ta pentru mâine a fost confirmată</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    U
                  </div>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </button>
                
                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md flex items-center gap-2">
                        <Settings size={16} />
                        Setări
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md flex items-center gap-2 text-red-600">
                        <LogOut size={16} />
                        Deconectare
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

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
    </ProtectedRoute>
  );
};

export default DashboardPage; 