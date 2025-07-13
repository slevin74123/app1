import React, { useState, useEffect } from 'react';
import { Search, Filter, Menu, X, Bell, ChevronDown, LogOut, Settings } from 'lucide-react';
import UserSidebar from './UserSidebar';
import MapWithParkingPins from './MapWithParkingPins';
import AppFunctionsSidebar from './AppFunctionsSidebar';
import ParkingList from './ParkingList';
import MyParkingsView from './MyParkingsView';
import CommonChatView from './CommonChatView';
import CommunityWallView from './CommunityWallView';
const ParkingDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    priceRange: [number, number];
    availability: string;
    type: string;
  }>({
    priceRange: [0, 50],
    availability: 'all',
    type: 'all'
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyParkings, setShowMyParkings] = useState(false);
  const [showCommonChat, setShowCommonChat] = useState(false);
  const [showCommunityWall, setShowCommunityWall] = useState(false);
  const [showNearbyParking, setShowNearbyParking] = useState(false);
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
      setShowMyParkings(event.detail.show);
      if (event.detail.show) {
        setShowCommonChat(false);
      }
    };
    const handleShowCommonChat = (event: CustomEvent) => {
      setShowCommonChat(event.detail.show);
      if (event.detail.show) {
        setShowMyParkings(false);
        setShowCommunityWall(false);
      }
    };
    const handleShowCommunityWall = (event: CustomEvent) => {
      setShowCommunityWall(event.detail.show);
      if (event.detail.show) {
        setShowMyParkings(false);
        setShowCommonChat(false);
      }
    };
    const handleShowNearbyParking = (event: CustomEvent) => {
      setShowNearbyParking(event.detail.show);
      if (event.detail.show) {
        setShowMyParkings(false);
        setShowCommonChat(false);
        setShowCommunityWall(false);
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
  return <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        {/* Left side - Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button onClick={toggleMobileMenu} className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className="flex items-center text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Parcarile mele</span>
          </nav>
        </div>
        
        {/* Center - Title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        </div>

        {/* Right side - Notifications, User Avatar and Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button onClick={toggleNotifications} className="p-2 hover:bg-accent rounded-lg transition-colors relative" aria-label="Notifications">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Notificări</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Rezervare confirmată</p>
                        <p className="text-xs text-muted-foreground mt-1">Locul de parcare din Piața Unirii a fost rezervat cu succes pentru astăzi 14:00-16:00</p>
                        <span className="text-xs text-muted-foreground">acum 5 minute</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Plată procesată</p>
                        <p className="text-xs text-muted-foreground mt-1">Plata în valoare de 15 RON pentru parcarea din Centrul Vechi a fost procesată</p>
                        <span className="text-xs text-muted-foreground">acum 1 oră</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Reminder rezervare</p>
                        <p className="text-xs text-muted-foreground mt-1">Nu uita că ai o rezervare astăzi la 16:00 în Parcarea Mall</p>
                        <span className="text-xs text-muted-foreground">acum 2 ore</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Loc nou disponibil</p>
                        <p className="text-xs text-muted-foreground mt-1">Un nou loc de parcare a devenit disponibil în zona ta preferată</p>
                        <span className="text-xs text-muted-foreground">acum 3 ore</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Rezervare expirată</p>
                        <p className="text-xs text-muted-foreground mt-1">Rezervarea pentru Strada Victoriei a expirat. Locul este din nou disponibil</p>
                        <span className="text-xs text-muted-foreground">ieri</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border">
                  <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                    Vezi toate notificările
                  </button>
                </div>
              </div>}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button onClick={toggleUserMenu} className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors" aria-label="User menu">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">Alex Popescu</span>
              <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2">
                    <Settings size={16} />
                    Setari cont
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 text-red-600">
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </header>

      {/* Search Bar - moved below header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Left side - Harta Parcari text */}
          <div className="flex items-center">
            <span className="text-foreground font-medium text-sm">Harta Parcări</span>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-none mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input type="text" placeholder="Caută locuri de parcare..." value={searchQuery} onChange={handleSearchChange} className="w-full pl-10 pr-10 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" />
              {searchQuery && <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                  <X size={16} />
                </button>}
            </div>
          </div>

          {/* Right side - Filter Button */}
          <button onClick={toggleFilter} className={`p-2 rounded-lg transition-colors ${isFilterOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`} aria-label="Toggle filters">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - User Functions */}
        <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-64 h-full bg-card border-r border-border transition-transform duration-300 ease-in-out`}>
          <UserSidebar />
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={toggleMobileMenu} />}

        {/* Central Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filter Panel */}
          {isFilterOpen && <div className="bg-card border-b border-border p-4 shadow-sm">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Interval Preț:</label>
                  <select value={`${selectedFilters.priceRange[0]}-${selectedFilters.priceRange[1]}`} onChange={e => {
                const [min, max] = e.target.value.split('-').map(Number);
                setSelectedFilters(prev => ({
                  ...prev,
                  priceRange: [min, max]
                }));
              }} className="px-3 py-1 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="0-50">0 - 50 RON</option>
                    <option value="0-20">0 - 20 RON</option>
                    <option value="20-40">20 - 40 RON</option>
                    <option value="40-50">40 - 50 RON</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Disponibilitate:</label>
                  <select value={selectedFilters.availability} onChange={e => setSelectedFilters(prev => ({
                ...prev,
                availability: e.target.value
              }))} className="px-3 py-1 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="all">Toate</option>
                    <option value="available">Disponibil Acum</option>
                    <option value="reserved">Rezervat</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Tip:</label>
                  <select value={selectedFilters.type} onChange={e => setSelectedFilters(prev => ({
                ...prev,
                type: e.target.value
              }))} className="px-3 py-1 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="all">Toate Tipurile</option>
                    <option value="street">Parcare Stradală</option>
                    <option value="garage">Garaj</option>
                    <option value="lot">Parcare</option>
                  </select>
                </div>
              </div>
            </div>}

          {/* Map and Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Conditional Content - Show My Parkings, Common Chat, Community Wall, or Map */}
            {showMyParkings ? <div className="flex-1 relative">
                <MyParkingsView />
              </div> : showCommonChat ? <div className="flex-1 relative">
                <CommonChatView />
              </div> : showCommunityWall ? <div className="flex-1 relative">
                <CommunityWallView />
              </div> : showNearbyParking ? <div className="flex-1 relative">
                <MapWithParkingPins searchQuery={searchQuery} filters={selectedFilters} />
              </div> : <>
                {/* Map Area */}
                <div className="flex-1 relative">
                  <MapWithParkingPins searchQuery={searchQuery} filters={selectedFilters} />
                </div>

                {/* Right Sidebar - App Functions */}
                <div className="hidden xl:block w-80 bg-card border-l border-border">
                  <AppFunctionsSidebar />
                </div>
              </>}
          </div>

          {/* Bottom Parking List - Only show when not showing My Parkings, Common Chat, or Community Wall */}
          {!showMyParkings && !showCommonChat && !showCommunityWall && <div className="h-80 bg-card border-t border-border overflow-hidden">
              <ParkingList searchQuery={searchQuery} filters={selectedFilters} showNearbyOnly={showNearbyParking} />
            </div>}
        </div>
      </div>

      {/* My Parkings View */}
      {showMyParkings && <MyParkingsView />}

      {/* Common Chat View */}
      {showCommonChat && <CommonChatView />}

      {/* Community Wall View */}
      {showCommunityWall && <CommunityWallView />}
    </div>;
};
export default ParkingDashboard;