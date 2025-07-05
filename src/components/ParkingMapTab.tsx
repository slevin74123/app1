"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Search, Filter, Info, XCircle, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
interface User {
  name: string;
  avatarUrl: string;
  isPremium: boolean;
}
interface ParkingPin {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: "free" | "occupied";
  freeSpaces: number;
  totalSpaces: number;
  price: number;
  zone: string;
  street: string;
}
interface Zone {
  id: string;
  name: string;
}
interface Street {
  id: string;
  name: string;
}
export interface ParkingMapTabProps {
  user?: User;
}
const mockZones: Zone[] = [{
  id: "1",
  name: "Centrul Vechi"
}, {
  id: "2",
  name: "Piața Unirii"
}, {
  id: "3",
  name: "Calea Victoriei"
}];
const mockStreets: Street[] = [{
  id: "1",
  name: "Strada Lipscani"
}, {
  id: "2",
  name: "Bulevardul Magheru"
}, {
  id: "3",
  name: "Strada Franceza"
}, {
  id: "4",
  name: "Calea Dorobanti"
}, {
  id: "5",
  name: "Strada Amzei"
}];
const mockParkingPins: ParkingPin[] = [{
  id: "1",
  name: "Parcare Centrul Vechi",
  address: "Strada Lipscani 15",
  lat: 44.4268,
  lng: 26.1025,
  status: "free",
  freeSpaces: 12,
  totalSpaces: 50,
  price: 5,
  zone: "Centrul Vechi",
  street: "Strada Lipscani"
}, {
  id: "2",
  name: "Parcare Piața Unirii",
  address: "Piața Unirii 1",
  lat: 44.4267,
  lng: 26.1030,
  status: "occupied",
  freeSpaces: 0,
  totalSpaces: 30,
  price: 8,
  zone: "Piața Unirii",
  street: "Bulevardul Magheru"
}, {
  id: "3",
  name: "Parcare Magheru",
  address: "Bulevardul Magheru 25",
  lat: 44.4270,
  lng: 26.1020,
  status: "free",
  freeSpaces: 8,
  totalSpaces: 25,
  price: 6,
  zone: "Calea Victoriei",
  street: "Bulevardul Magheru"
}, {
  id: "4",
  name: "Parcare Franceza",
  address: "Strada Franceza 10",
  lat: 44.4265,
  lng: 26.1035,
  status: "free",
  freeSpaces: 15,
  totalSpaces: 40,
  price: 4,
  zone: "Centrul Vechi",
  street: "Strada Franceza"
}, {
  id: "5",
  name: "Parcare Amzei",
  address: "Strada Amzei 5",
  lat: 44.4272,
  lng: 26.1015,
  status: "occupied",
  freeSpaces: 2,
  totalSpaces: 35,
  price: 7,
  zone: "Calea Victoriei",
  street: "Strada Amzei"
}];
export default function ParkingMapTab({
  user
}: ParkingMapTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedStreets, setSelectedStreets] = useState<string[]>([]);
  const [selectedPin, setSelectedPin] = useState<ParkingPin | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter parking pins
  const filteredPins = useMemo(() => {
    return mockParkingPins.filter(pin => {
      const matchesSearch = debouncedSearch === "" || pin.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || pin.address.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesZone = selectedZones.length === 0 || selectedZones.includes(pin.zone);
      const matchesStreet = selectedStreets.length === 0 || selectedStreets.includes(pin.street);
      return matchesSearch && matchesZone && matchesStreet;
    });
  }, [debouncedSearch, selectedZones, selectedStreets]);
  const handleZoneChange = (zoneName: string, checked: boolean) => {
    if (checked) {
      setSelectedZones(prev => [...prev, zoneName]);
    } else {
      setSelectedZones(prev => prev.filter(z => z !== zoneName));
    }
  };
  const handleStreetChange = (streetName: string, checked: boolean) => {
    if (checked) {
      setSelectedStreets(prev => [...prev, streetName]);
    } else {
      setSelectedStreets(prev => prev.filter(s => s !== streetName));
    }
  };
  const clearFilters = () => {
    setSelectedZones([]);
    setSelectedStreets([]);
    setSearchQuery("");
  };
  const pinVariants = {
    hidden: {
      scale: 0,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1
    },
    hover: {
      scale: 1.1
    },
    tap: {
      scale: 0.95
    }
  };
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1
    },
    closed: {
      x: -300,
      opacity: 0
    }
  };
  return <div className="h-full flex bg-background">
      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && <motion.aside variants={sidebarVariants} initial="closed" animate="open" exit="closed" transition={{
        duration: 0.3
      }} className="w-80 border-r bg-card shadow-sm flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Filtrare</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)} className="md:hidden">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Caută parcare..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" aria-label="Caută parcare" />
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Zone Filters */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Zone</h3>
                  <div className="space-y-2">
                    {mockZones.map(zone => <div key={zone.id} className="flex items-center space-x-2">
                        <Checkbox id={`zone-${zone.id}`} checked={selectedZones.includes(zone.name)} onCheckedChange={checked => handleZoneChange(zone.name, checked as boolean)} />
                        <label htmlFor={`zone-${zone.id}`} className="text-sm text-foreground cursor-pointer">
                          {zone.name}
                        </label>
                      </div>)}
                  </div>
                </div>

                <Separator />

                {/* Street Filters */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Străzi</h3>
                  <div className="space-y-2">
                    {mockStreets.map(street => <div key={street.id} className="flex items-center space-x-2">
                        <Checkbox id={`street-${street.id}`} checked={selectedStreets.includes(street.name)} onCheckedChange={checked => handleStreetChange(street.name, checked as boolean)} />
                        <label htmlFor={`street-${street.id}`} className="text-sm text-foreground cursor-pointer">
                          {street.name}
                        </label>
                      </div>)}
                  </div>
                </div>

                <Separator />

                {/* Clear Filters */}
                <Button variant="outline" onClick={clearFilters} className="w-full" disabled={selectedZones.length === 0 && selectedStreets.length === 0 && searchQuery === ""}>
                  Șterge filtrele
                </Button>
              </div>
            </ScrollArea>
          </motion.aside>}
      </AnimatePresence>

      {/* Map Area */}
      <main className="flex-1 flex flex-col">
        {/* Map Header */}
        <div className="p-4 border-b bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isFilterOpen && <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)}>
                <Filter className="w-4 h-4" />
              </Button>}
            <div>
              <h1 className="text-xl font-semibold text-foreground">Harta Parcărilor</h1>
              <p className="text-sm text-muted-foreground">
                {filteredPins.length} {filteredPins.length === 1 ? 'parcare găsită' : 'parcări găsite'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Liber
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Ocupat
            </Badge>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-muted">
          {isLoading ? <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-12 h-12 text-muted-foreground mx-auto mb-2 animate-pulse" />
                <p className="text-muted-foreground">Se încarcă harta...</p>
              </div>
            </div> : filteredPins.length === 0 ? <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium text-foreground mb-1">Nu s-au găsit parcări</h3>
                <p className="text-muted-foreground">Încercați să modificați filtrele de căutare</p>
              </div>
            </div> : <>
              {/* Mock Map Background */}
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
                {/* Parking Pins */}
                {filteredPins.map(pin => <Tooltip key={pin.id}>
                    <TooltipTrigger asChild>
                      <motion.button variants={pinVariants} initial="hidden" animate="visible" whileHover="hover" whileTap="tap" transition={{
                  duration: 0.2
                }} className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full" style={{
                  left: `${20 + (pin.lng - 26.1015) * 8000}%`,
                  top: `${50 + (44.4268 - pin.lat) * 8000}%`
                }} onClick={() => setSelectedPin(pin)} aria-label={`${pin.name} - ${pin.status === 'free' ? 'Locuri libere' : 'Complet ocupat'}`}>
                        <div className={cn("w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center", pin.status === 'free' ? "bg-green-500" : "bg-red-500")}>
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        {pin.status === 'free' && pin.freeSpaces > 0 && <div className="absolute -top-1 -right-1 bg-white text-xs font-bold text-green-600 rounded-full w-4 h-4 flex items-center justify-center border border-green-500">
                            {pin.freeSpaces}
                          </div>}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">{pin.name}</p>
                        <p className="text-sm text-muted-foreground">{pin.address}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Locuri libere: {pin.freeSpaces}/{pin.totalSpaces}</span>
                          <span className="font-medium">{pin.price} RON/oră</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>)}
              </div>
            </>}
        </div>

        {/* Selected Pin Details */}
        <AnimatePresence>
          {selectedPin && <motion.div initial={{
          y: 100,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} exit={{
          y: 100,
          opacity: 0
        }} transition={{
          duration: 0.3
        }} className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedPin.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedPin.address}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedPin(null)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", selectedPin.status === 'free' ? "bg-green-500" : "bg-red-500")} />
                      <span className="text-sm font-medium">
                        {selectedPin.status === 'free' ? 'Locuri disponibile' : 'Complet ocupat'}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {selectedPin.price} RON/oră
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Locuri libere: <span className="font-medium text-foreground">{selectedPin.freeSpaces}/{selectedPin.totalSpaces}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={selectedPin.status === 'occupied'}>
                      {selectedPin.status === 'free' ? 'Navighează' : 'Indisponibil'}
                    </Button>
                    {user?.isPremium && selectedPin.status === 'free' && <Button variant="outline" className="flex-1">
                        Rezervă
                      </Button>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>}
        </AnimatePresence>
      </main>
    </div>;
}