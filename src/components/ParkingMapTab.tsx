"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Star, Clock, Crown } from "lucide-react";
import { toast } from "sonner";

import ParkingMap from "./ParkingMap";

interface User {
  name: string;
  avatarUrl: string;
  isPremium: boolean;
}

export interface ParkingMapTabProps {
  user?: User;
}

export default function ParkingMapTab({
  user
}: ParkingMapTabProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapStats, setMapStats] = useState({
    totalParkings: 0,
    availableSpaces: 0,
    premiumSpaces: 0,
    lastUpdated: new Date()
  });

  // Get user location
  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
          toast.success("Locația a fost detectată cu succes!");
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          toast.error("Nu s-a putut detecta locația. Verificați permisiunile.");
        }
      );
    } else {
      setIsLocating(false);
      toast.error("Geolocația nu este suportată de browser.");
    }
  };

  // Update map stats periodically
  useEffect(() => {
    const updateStats = () => {
      setMapStats(prev => ({
        ...prev,
        totalParkings: Math.floor(Math.random() * 50) + 100,
        availableSpaces: Math.floor(Math.random() * 200) + 300,
        premiumSpaces: Math.floor(Math.random() * 20) + 30,
        lastUpdated: new Date()
      }));
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Map Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border-b p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Harta Parcarilor</h2>
              <p className="text-sm text-muted-foreground">
                Găsește locuri de parcare în timp real
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user?.isPremium && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={getUserLocation}
              disabled={isLocating}
              className="flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              {isLocating ? "Se detectează..." : "Locația mea"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-0 bg-primary/5">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Parcări</p>
                  <p className="text-lg font-semibold text-foreground">{mapStats.totalParkings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-green-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-xs text-muted-foreground">Locuri Libere</p>
                  <p className="text-lg font-semibold text-foreground">{mapStats.availableSpaces}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-yellow-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Premium</p>
                  <p className="text-lg font-semibold text-foreground">{mapStats.premiumSpaces}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-blue-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Actualizat</p>
                  <p className="text-lg font-semibold text-foreground">
                    {mapStats.lastUpdated.toLocaleTimeString('ro-RO', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <ParkingMap 
          className="h-full"
          userLocation={userLocation}
          user={user}
        />
      </div>
    </div>
  );
}