"use client";

import * as React from "react";
import { useState } from "react";

import { User, LogOut, Star, Map, Settings, ParkingCircle, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Import subcomponents (will be created next)
import ParkingMapTab from "./ParkingMapTab";
import AvailableParkingSpacesTab from "./AvailableParkingSpacesTab";
import FavoritesTab from "./FavoritesTab";
import AccountSettingsTab from "./AccountSettingsTab";
interface User {
  name: string;
  avatarUrl: string;
  isPremium: boolean;
}
export interface UserDashboardProps {
  user?: User;
  onSignOut?: () => void;
}
const defaultUser: User = {
  name: "Maria Popescu",
  avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  isPremium: true
};
export default function UserDashboard({
  user = defaultUser,
  onSignOut = () => toast.success("V-ați deconectat cu succes")
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("map");
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const handleSignOut = () => {
    setShowSignOutDialog(false);
    onSignOut();
  };
  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -10
    }
  };
  return <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Toaster />
        
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <ParkingCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">ParkEasy</h1>
                <p className="text-sm text-muted-foreground">Găsește parcarea perfectă</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-3">
              {user.isPremium && <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </Badge>}
              
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 md:w-10 md:h-10">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  {user.isPremium && <p className="text-xs text-muted-foreground">Cont Premium</p>}
                </div>
              </div>

              <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
                <DialogTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Deconectare</p>
                    </TooltipContent>
                  </Tooltip>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmare deconectare</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-muted-foreground">Sunteți sigur că doriți să vă deconectați?</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowSignOutDialog(false)}>
                      Anulează
                    </Button>
                    <Button onClick={handleSignOut}>
                      Deconectare
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            {/* Navigation Tabs */}
            <div className="border-b bg-card">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-transparent">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="map" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                      <Map className="w-4 h-4" />
                      <span className="text-xs font-medium hidden sm:block">Harta Parcarilor</span>
                      <span className="text-xs font-medium sm:hidden">Hartă</span>
                      {user?.isPremium && (
                        <Badge variant="secondary" className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs">
                          <Crown className="w-1 h-1" />
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Harta Parcarilor {user?.isPremium && "(Premium)"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="available" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <ParkingCircle className="w-4 h-4" />
                      <span className="text-xs font-medium hidden sm:block">Locuri Disponibile</span>
                      <span className="text-xs font-medium sm:hidden">Locuri</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Locuri Disponibile</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="favorites" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Star className="w-4 h-4" />
                      <span className="text-xs font-medium hidden sm:block">Favorite</span>
                      <span className="text-xs font-medium sm:hidden">Favorite</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Favorite</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Settings className="w-4 h-4" />
                      <span className="text-xs font-medium hidden sm:block">Setări Cont</span>
                      <span className="text-xs font-medium sm:hidden">Setări</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Setări Cont</p>
                  </TooltipContent>
                </Tooltip>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              <TabsContent value="map" className="h-full m-0 p-0">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" exit="exit" transition={{
                duration: 0.2
              }} className="h-full">
                  <ParkingMapTab user={user} />
                </motion.div>
              </TabsContent>

              <TabsContent value="available" className="h-full m-0 p-0">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" exit="exit" transition={{
                duration: 0.2
              }} className="h-full">
                  <AvailableParkingSpacesTab user={user} />
                </motion.div>
              </TabsContent>

              <TabsContent value="favorites" className="h-full m-0 p-0">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" exit="exit" transition={{
                duration: 0.2
              }} className="h-full">
                  <FavoritesTab user={user} />
                </motion.div>
              </TabsContent>

              <TabsContent value="settings" className="h-full m-0 p-0">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" exit="exit" transition={{
                duration: 0.2
              }} className="h-full">
                  <AccountSettingsTab user={user} />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>;
}