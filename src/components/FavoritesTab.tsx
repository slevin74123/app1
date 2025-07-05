"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Star, MapPin, Trash2, Navigation, Clock, CheckCircle, XCircle, History, Crown, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
interface User {
  name: string;
  avatarUrl: string;
  isPremium: boolean;
}
interface FavoriteParking {
  id: string;
  name: string;
  address: string;
  rating: number;
  price: number;
  distance: number;
  addedDate: string;
}
interface Booking {
  id: string;
  parkingName: string;
  parkingAddress: string;
  date: string;
  time: string;
  duration: number; // hours
  price: number;
  status: "active" | "completed" | "cancelled";
}
interface TimelineActivity {
  id: string;
  type: "favorite_added" | "booking_created" | "booking_completed" | "booking_cancelled" | "parking_reported";
  title: string;
  description: string;
  date: string;
  time: string;
}
export interface FavoritesTabProps {
  user?: User;
}
const mockFavorites: FavoriteParking[] = [{
  id: "1",
  name: "Parcare Centrul Vechi",
  address: "Strada Lipscani 15, București",
  rating: 4.5,
  price: 5,
  distance: 0.3,
  addedDate: "15 Dec 2024"
}, {
  id: "2",
  name: "Parcare Premium Unirii",
  address: "Piața Unirii 1, București",
  rating: 4.8,
  price: 12,
  distance: 0.7,
  addedDate: "10 Dec 2024"
}, {
  id: "3",
  name: "Parcare Magheru",
  address: "Bulevardul Magheru 25, București",
  rating: 4.2,
  price: 6,
  distance: 1.2,
  addedDate: "8 Dec 2024"
}];
const mockBookings: Booking[] = [{
  id: "1",
  parkingName: "Parcare Premium Unirii",
  parkingAddress: "Piața Unirii 1, București",
  date: "16 Dec 2024",
  time: "14:30",
  duration: 2,
  price: 24,
  status: "active"
}, {
  id: "2",
  parkingName: "Parcare Centrul Vechi",
  parkingAddress: "Strada Lipscani 15, București",
  date: "15 Dec 2024",
  time: "10:00",
  duration: 3,
  price: 15,
  status: "completed"
}, {
  id: "3",
  parkingName: "Parcare Magheru",
  parkingAddress: "Bulevardul Magheru 25, București",
  date: "14 Dec 2024",
  time: "16:45",
  duration: 1,
  price: 6,
  status: "cancelled"
}];
const mockTimelineActivities: TimelineActivity[] = [{
  id: "1",
  type: "booking_created",
  title: "Rezervare creată",
  description: "Ați rezervat un loc la Parcare Premium Unirii",
  date: "16 Dec 2024",
  time: "14:25"
}, {
  id: "2",
  type: "booking_completed",
  title: "Rezervare finalizată",
  description: "Ați finalizat parcarea la Parcare Centrul Vechi",
  date: "15 Dec 2024",
  time: "13:00"
}, {
  id: "3",
  type: "favorite_added",
  title: "Adăugat la favorite",
  description: "Ați adăugat Parcare Centrul Vechi la favorite",
  date: "15 Dec 2024",
  time: "09:30"
}, {
  id: "4",
  type: "parking_reported",
  title: "Parcare raportată",
  description: "Ați raportat locuri libere la Parcare Magheru",
  date: "14 Dec 2024",
  time: "18:20"
}, {
  id: "5",
  type: "booking_cancelled",
  title: "Rezervare anulată",
  description: "Ați anulat rezervarea la Parcare Magheru",
  date: "14 Dec 2024",
  time: "16:40"
}];
export default function FavoritesTab({
  user
}: FavoritesTabProps) {
  const [favorites, setFavorites] = useState<FavoriteParking[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timelineActivities, setTimelineActivities] = useState<TimelineActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setFavorites(mockFavorites);
        setBookings(mockBookings);
        setTimelineActivities(mockTimelineActivities);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  const handleRemoveFavorite = (favorite: FavoriteParking) => {
    setFavorites(prev => prev.filter(f => f.id !== favorite.id));
    toast.success(`${favorite.name} a fost eliminat din favorite`);
  };
  const handleNavigateToParking = (parking: FavoriteParking) => {
    toast.success(`Navigare către ${parking.name}`);
  };
  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };
  const confirmCancelBooking = () => {
    if (selectedBooking) {
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? {
        ...b,
        status: "cancelled" as const
      } : b));
      toast.success(`Rezervarea la ${selectedBooking.parkingName} a fost anulată`);
      setShowCancelDialog(false);
      setSelectedBooking(null);
    }
  };
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={cn("w-3 h-3", i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />);
  };
  const getBookingStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "active":
        return {
          variant: "default" as const,
          text: "Activă",
          icon: CheckCircle
        };
      case "completed":
        return {
          variant: "secondary" as const,
          text: "Finalizată",
          icon: CheckCircle
        };
      case "cancelled":
        return {
          variant: "destructive" as const,
          text: "Anulată",
          icon: XCircle
        };
    }
  };
  const getTimelineIcon = (type: TimelineActivity["type"]) => {
    switch (type) {
      case "favorite_added":
        return Star;
      case "booking_created":
      case "booking_completed":
        return CheckCircle;
      case "booking_cancelled":
        return XCircle;
      case "parking_reported":
        return MapPin;
      default:
        return History;
    }
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
  const timelineVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0
    }
  };
  if (isLoading) {
    return <div className="h-full bg-background">
        <div className="p-6 border-b">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({
              length: 2
            }, (_, i) => <Card key={i} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-32" />
                    </div>
                  </div>
                </Card>)}
            </div>
          </div>
        </ScrollArea>
      </div>;
  }
  return <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 border-b bg-card">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Favorite</h1>
          <p className="text-muted-foreground">
            Parcările tale preferate și rezervările recente
          </p>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Favorite Parkings */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Parcări favorite</h2>
              <Badge variant="secondary">
                {favorites.length} {favorites.length === 1 ? 'favorit' : 'favorite'}
              </Badge>
            </div>

            {favorites.length === 0 ? <Card className="p-8 text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nu aveți parcări favorite
                </h3>
                <p className="text-muted-foreground">
                  Adăugați parcări la favorite pentru acces rapid
                </p>
              </Card> : <ul className="space-y-4" role="list" aria-label="Lista parcărilor favorite">
                <AnimatePresence>
                  {favorites.map((favorite, index) => <motion.li key={favorite.id} variants={cardVariants} initial="hidden" animate="visible" exit="hidden" whileHover="hover" transition={{
                duration: 0.3,
                delay: index * 0.1
              }}>
                      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground">{favorite.name}</h3>
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{favorite.address}</p>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  {renderStars(favorite.rating)}
                                  <span className="text-muted-foreground ml-1">({favorite.rating})</span>
                                </div>
                                <span className="text-muted-foreground">
                                  {favorite.price} RON/oră
                                </span>
                                <span className="text-muted-foreground">
                                  {favorite.distance} km
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Adăugat pe {favorite.addedDate}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <Button size="sm" onClick={() => handleNavigateToParking(favorite)} aria-label={`Navighează către ${favorite.name}`}>
                                <Navigation className="w-3 h-3 mr-1" />
                                Răsfoiește
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleRemoveFavorite(favorite)} aria-label={`Elimină ${favorite.name} din favorite`}>
                                <Trash2 className="w-3 h-3 mr-1" />
                                Elimină
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.li>)}
                </AnimatePresence>
              </ul>}
          </section>

          <Separator />

          {/* My Bookings */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Rezervările mele</h2>
              <Badge variant="secondary">
                {bookings.length} {bookings.length === 1 ? 'rezervare' : 'rezervări'}
              </Badge>
            </div>

            {bookings.length === 0 ? <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nu aveți rezervări
                </h3>
                <p className="text-muted-foreground">
                  Rezervările dumneavoastră vor apărea aici
                </p>
              </Card> : <ul className="space-y-4" role="list" aria-label="Lista rezervărilor">
                <AnimatePresence>
                  {bookings.map((booking, index) => {
                const statusBadge = getBookingStatusBadge(booking.status);
                const StatusIcon = statusBadge.icon;
                return <motion.li key={booking.id} variants={cardVariants} initial="hidden" animate="visible" exit="hidden" whileHover="hover" transition={{
                  duration: 0.3,
                  delay: index * 0.1
                }}>
                        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-foreground">{booking.parkingName}</h3>
                                  <Badge {...statusBadge}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusBadge.text}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">{booking.parkingAddress}</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">{booking.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">{booking.time}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      {booking.duration} {booking.duration === 1 ? 'oră' : 'ore'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-foreground">
                                      {booking.price} RON
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {booking.status === "active" && <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking)} className="ml-4" aria-label={`Anulează rezervarea la ${booking.parkingName}`}>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Anulează
                                </Button>}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.li>;
              })}
                </AnimatePresence>
              </ul>}
          </section>

          <Separator />

          {/* Timeline */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-foreground">Activitate recentă</h2>
              <History className="w-5 h-5 text-muted-foreground" />
            </div>

            {timelineActivities.length === 0 ? <Card className="p-8 text-center">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nu există activitate
                </h3>
                <p className="text-muted-foreground">
                  Activitatea dumneavoastră va apărea aici
                </p>
              </Card> : <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                
                <ul className="space-y-4" role="list" aria-label="Cronologia activității">
                  <AnimatePresence>
                    {timelineActivities.map((activity, index) => {
                  const Icon = getTimelineIcon(activity.type);
                  return <motion.li key={activity.id} variants={timelineVariants} initial="hidden" animate="visible" transition={{
                    duration: 0.3,
                    delay: index * 0.1
                  }} className="relative flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-card border-2 border-background rounded-full flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-foreground">
                                {activity.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{activity.date}</span>
                                <span>•</span>
                                <span>{activity.time}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {activity.description}
                            </p>
                          </div>
                        </motion.li>;
                })}
                  </AnimatePresence>
                </ul>
              </div>}
          </section>
        </div>
      </ScrollArea>

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anulare rezervare</DialogTitle>
          </DialogHeader>
          {selectedBooking && <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground">{selectedBooking.parkingName}</h4>
                <p className="text-sm text-muted-foreground">{selectedBooking.parkingAddress}</p>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>{selectedBooking.date} la {selectedBooking.time}</span>
                  <span className="font-medium">{selectedBooking.price} RON</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Sunteți sigur că doriți să anulați această rezervare?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Păstrează rezervarea
                </Button>
                <Button variant="destructive" onClick={confirmCancelBooking}>
                  Anulează rezervarea
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}