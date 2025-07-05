"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Star, Crown, Navigation, CheckCircle, AlertCircle, Clock, Euro } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
interface User {
  name: string;
  avatarUrl: string;
  isPremium: boolean;
}
interface ParkingSpace {
  id: string;
  name: string;
  address: string;
  freeSpaces: number;
  totalSpaces: number;
  distance: number; // in km
  price: number; // RON per hour
  rating: number; // 1-5 stars
  isPremiumOnly: boolean;
  lastUpdated: string;
}
export interface AvailableParkingSpacesTabProps {
  user?: User;
}
const mockParkingSpaces: ParkingSpace[] = [{
  id: "1",
  name: "Parcare Centrul Vechi",
  address: "Strada Lipscani 15, București",
  freeSpaces: 12,
  totalSpaces: 50,
  distance: 0.3,
  price: 5,
  rating: 4.5,
  isPremiumOnly: false,
  lastUpdated: "Acum 2 minute"
}, {
  id: "2",
  name: "Parcare Premium Unirii",
  address: "Piața Unirii 1, București",
  freeSpaces: 8,
  totalSpaces: 30,
  distance: 0.7,
  price: 12,
  rating: 4.8,
  isPremiumOnly: true,
  lastUpdated: "Acum 1 minut"
}, {
  id: "3",
  name: "Parcare Magheru",
  address: "Bulevardul Magheru 25, București",
  freeSpaces: 3,
  totalSpaces: 25,
  distance: 1.2,
  price: 6,
  rating: 4.2,
  isPremiumOnly: false,
  lastUpdated: "Acum 5 minute"
}, {
  id: "4",
  name: "Parcare Franceza",
  address: "Strada Franceza 10, București",
  freeSpaces: 15,
  totalSpaces: 40,
  distance: 0.9,
  price: 4,
  rating: 4.0,
  isPremiumOnly: false,
  lastUpdated: "Acum 3 minute"
}, {
  id: "5",
  name: "Parcare VIP Amzei",
  address: "Strada Amzei 5, București",
  freeSpaces: 5,
  totalSpaces: 35,
  distance: 1.5,
  price: 15,
  rating: 4.9,
  isPremiumOnly: true,
  lastUpdated: "Acum 1 minut"
}];
export default function AvailableParkingSpacesTab({
  user
}: AvailableParkingSpacesTabProps) {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParking, setSelectedParking] = useState<ParkingSpace | null>(null);
  const [showReserveDialog, setShowReserveDialog] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setParkingSpaces(mockParkingSpaces);
        setError(null);
      } catch (err) {
        setError("Nu s-au putut încărca parcările disponibile");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  const handleNavigate = (parking: ParkingSpace) => {
    toast.success(`Navigare către ${parking.name}`);
  };
  const handleReserve = (parking: ParkingSpace) => {
    if (!user?.isPremium) {
      toast.error("Funcția de rezervare este disponibilă doar pentru utilizatorii Premium");
      return;
    }
    setSelectedParking(parking);
    setShowReserveDialog(true);
  };
  const confirmReservation = () => {
    if (selectedParking) {
      toast.success(`Rezervare confirmată la ${selectedParking.name}`);
      setShowReserveDialog(false);
      setSelectedParking(null);
    }
  };
  const handleReportFree = (parking: ParkingSpace) => {
    toast.success(`Mulțumim! Ați raportat că ${parking.name} are locuri libere`);
    // Update the parking space data
    setParkingSpaces(prev => prev.map(p => p.id === parking.id ? {
      ...p,
      lastUpdated: "Acum 1 minut"
    } : p));
  };
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={cn("w-3 h-3", i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />);
  };
  const getAvailabilityColor = (freeSpaces: number, totalSpaces: number) => {
    const percentage = freeSpaces / totalSpaces * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };
  const getAvailabilityBadge = (freeSpaces: number, totalSpaces: number) => {
    const percentage = freeSpaces / totalSpaces * 100;
    if (percentage > 50) return {
      variant: "secondary" as const,
      text: "Multe locuri"
    };
    if (percentage > 20) return {
      variant: "outline" as const,
      text: "Puține locuri"
    };
    return {
      variant: "destructive" as const,
      text: "Aproape plin"
    };
  };
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    },
    hover: {
      y: -2,
      transition: {
        duration: 0.2
      }
    }
  };
  if (isLoading) {
    return <div className="h-full bg-background">
        <div className="p-6 border-b">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-6 space-y-4">
            {Array.from({
            length: 3
          }, (_, i) => <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              </Card>)}
          </div>
        </ScrollArea>
      </div>;
  }
  if (error) {
    return <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Eroare la încărcare</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Încearcă din nou
          </Button>
        </div>
      </div>;
  }
  if (parkingSpaces.length === 0) {
    return <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Nu sunt parcări disponibile</h3>
            <p className="text-muted-foreground">Încercați din nou mai târziu</p>
          </div>
        </div>
      </div>;
  }
  return <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 border-b bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Locuri Disponibile</h1>
            <p className="text-muted-foreground">
              {parkingSpaces.length} {parkingSpaces.length === 1 ? 'parcare găsită' : 'parcări găsite'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Actualizat în timp real
            </Badge>
          </div>
        </div>
      </header>

      {/* Parking List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <ul className="space-y-4" role="list" aria-label="Lista parcărilor disponibile">
            <AnimatePresence>
              {parkingSpaces.map((parking, index) => {
              const availabilityBadge = getAvailabilityBadge(parking.freeSpaces, parking.totalSpaces);
              return <motion.li key={parking.id} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" transition={{
                duration: 0.3,
                delay: index * 0.1
              }}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">{parking.name}</CardTitle>
                              {parking.isPremiumOnly && <Tooltip>
                                  <TooltipTrigger>
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Parcare Premium</p>
                                  </TooltipContent>
                                </Tooltip>}
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">{parking.address}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(parking.rating)}
                              <span className="text-sm text-muted-foreground ml-1">
                                ({parking.rating})
                              </span>
                            </div>
                          </div>
                          <Badge {...availabilityBadge}>
                            {availabilityBadge.text}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Parking Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className={cn("font-medium", getAvailabilityColor(parking.freeSpaces, parking.totalSpaces))}>
                              {parking.freeSpaces}/{parking.totalSpaces} locuri
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Navigation className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {parking.distance} km
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Euro className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {parking.price} RON/oră
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs">
                              {parking.lastUpdated}
                            </span>
                          </div>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button onClick={() => handleNavigate(parking)} className="flex-1" aria-label={`Navighează către ${parking.name}`}>
                            <Navigation className="w-4 h-4 mr-2" />
                            Răsfoiește
                          </Button>
                          
                          {parking.isPremiumOnly ? user?.isPremium ? <Button variant="secondary" onClick={() => handleReserve(parking)} className="flex-1" aria-label={`Rezervă loc la ${parking.name}`}>
                                <Crown className="w-4 h-4 mr-2" />
                                Rezervă
                              </Button> : <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="secondary" disabled className="flex-1">
                                    <Crown className="w-4 h-4 mr-2" />
                                    Rezervă
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Necesită cont Premium</p>
                                </TooltipContent>
                              </Tooltip> : user?.isPremium && <Button variant="secondary" onClick={() => handleReserve(parking)} className="flex-1" aria-label={`Rezervă loc la ${parking.name}`}>
                                <Crown className="w-4 h-4 mr-2" />
                                Rezervă
                              </Button>}
                          
                          <Button variant="outline" onClick={() => handleReportFree(parking)} className="flex-1 sm:flex-none" aria-label={`Raportează că ${parking.name} are locuri libere`}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Raportează ca liber
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.li>;
            })}
            </AnimatePresence>
          </ul>
        </div>
      </ScrollArea>

      {/* Reserve Dialog */}
      <Dialog open={showReserveDialog} onOpenChange={setShowReserveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare rezervare</DialogTitle>
          </DialogHeader>
          {selectedParking && <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground">{selectedParking.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedParking.address}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">Preț: {selectedParking.price} RON/oră</span>
                  <span className="text-sm">Locuri libere: {selectedParking.freeSpaces}</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Doriți să rezervați un loc de parcare pentru următoarele 30 de minute?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReserveDialog(false)}>
                  Anulează
                </Button>
                <Button onClick={confirmReservation}>
                  Confirmă rezervarea
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}