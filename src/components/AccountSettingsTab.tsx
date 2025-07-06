"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Settings, Bell, MapPin, Crown, LogOut, CheckCircle, User, Shield, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

interface User {
  name: string;
  avatarUrl: string;
  isPremium: boolean;
}
interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  parkingReminders: boolean;
  promotionalOffers: boolean;
}
interface Area {
  id: string;
  name: string;
}
export interface AccountSettingsTabProps {
  user?: User;
  onSignOut?: () => void;
}
const mockAreas: Area[] = [{
  id: "1",
  name: "Centrul Vechi"
}, {
  id: "2",
  name: "Piața Unirii"
}, {
  id: "3",
  name: "Calea Victoriei"
}, {
  id: "4",
  name: "Herastrau"
}, {
  id: "5",
  name: "Baneasa"
}];
const defaultNotificationSettings: NotificationSettings = {
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  parkingReminders: true,
  promotionalOffers: false
};
export default function AccountSettingsTab({
  user,
  onSignOut = () => toast.success("V-ați deconectat cu succes")
}: AccountSettingsTabProps) {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const [preferredArea, setPreferredArea] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Simulate loading settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setNotificationSettings(defaultNotificationSettings);
        setPreferredArea("1");
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);
  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success("Setările de notificare au fost actualizate");
  };
  const handleAreaChange = (value: string) => {
    setPreferredArea(value);
    const selectedArea = mockAreas.find(area => area.id === value);
    toast.success(`Zona preferată a fost schimbată în ${selectedArea?.name}`);
  };
  const handleUpgrade = () => {
    setShowUpgradeDialog(true);
  };
  const confirmUpgrade = () => {
    toast.success("Vă mulțumim pentru upgrade! Contul dumneavoastră Premium va fi activat în curând.");
    setShowUpgradeDialog(false);
  };
  const handleSignOut = () => {
    setShowSignOutDialog(true);
  };
  const confirmSignOut = () => {
    setShowSignOutDialog(false);
    onSignOut();
  };
  const saveAllSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Toate setările au fost salvate cu succes");
    } catch {
      toast.error("Eroare la salvarea setărilor");
    } finally {
      setIsSaving(false);
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
  if (isLoading) {
    return <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto animate-spin" />
          <p className="text-muted-foreground">Se încarcă setările...</p>
        </div>
      </div>;
  }
  return <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 border-b bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Setări Cont</h1>
            <p className="text-muted-foreground">
              Gestionați preferințele și setările contului dumneavoastră
            </p>
          </div>
          {user?.isPremium && <Badge variant="secondary" className="flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Premium
            </Badge>}
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Account Information */}
          <motion.section variants={cardVariants} initial="hidden" animate="visible" transition={{
          duration: 0.3
        }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informații cont
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user && <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {user.avatarUrl ? <Image src={user.avatarUrl} alt={user.name} width={64} height={64} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-muted-foreground" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                      <p className="text-muted-foreground">
                        {user.isPremium ? "Cont Premium" : "Cont Standard"}
                      </p>
                    </div>
                  </div>}
                
                {!user?.isPremium && <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Upgrade la Premium</h4>
                        <p className="text-sm text-muted-foreground">
                          Obțineți acces la rezervări și funcții exclusive
                        </p>
                      </div>
                      <Button onClick={handleUpgrade} className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Upgrade
                      </Button>
                    </div>
                  </div>}
              </CardContent>
            </Card>
          </motion.section>

          {/* Notification Settings */}
          <motion.section variants={cardVariants} initial="hidden" animate="visible" transition={{
          duration: 0.3,
          delay: 0.1
        }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Setări notificări
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="push-notifications" className="text-sm font-medium">
                        Notificări push
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Primiți notificări în aplicație
                      </p>
                    </div>
                    <Switch id="push-notifications" checked={notificationSettings.pushNotifications} onCheckedChange={checked => handleNotificationChange('pushNotifications', checked)} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="email-notifications" className="text-sm font-medium">
                        Notificări email
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Primiți notificări pe email
                      </p>
                    </div>
                    <Switch id="email-notifications" checked={notificationSettings.emailNotifications} onCheckedChange={checked => handleNotificationChange('emailNotifications', checked)} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="sms-notifications" className="text-sm font-medium">
                        Notificări SMS
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Primiți notificări prin SMS
                      </p>
                    </div>
                    <Switch id="sms-notifications" checked={notificationSettings.smsNotifications} onCheckedChange={checked => handleNotificationChange('smsNotifications', checked)} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="parking-reminders" className="text-sm font-medium">
                        Memento parcare
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Primiți amintiri despre expirarea parcării
                      </p>
                    </div>
                    <Switch id="parking-reminders" checked={notificationSettings.parkingReminders} onCheckedChange={checked => handleNotificationChange('parkingReminders', checked)} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="promotional-offers" className="text-sm font-medium">
                        Oferte promoționale
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Primiți oferte și reduceri speciale
                      </p>
                    </div>
                    <Switch id="promotional-offers" checked={notificationSettings.promotionalOffers} onCheckedChange={checked => handleNotificationChange('promotionalOffers', checked)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Location Preferences */}
          <motion.section variants={cardVariants} initial="hidden" animate="visible" transition={{
          duration: 0.3,
          delay: 0.2
        }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Preferințe locație
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred-area">Zona preferată</Label>
                  <Select value={preferredArea} onValueChange={handleAreaChange}>
                    <SelectTrigger id="preferred-area">
                      <SelectValue placeholder="Selectați zona preferată" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAreas.map(area => <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Această zonă va fi afișată primul în căutări
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Privacy & Security */}
          <motion.section variants={cardVariants} initial="hidden" animate="visible" transition={{
          duration: 0.3,
          delay: 0.3
        }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Confidențialitate și securitate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Schimbă parola
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Autentificare în doi pași
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Protejați-vă contul cu setări de securitate avansate
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Actions */}
          <motion.section variants={cardVariants} initial="hidden" animate="visible" transition={{
          duration: 0.3,
          delay: 0.4
        }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={saveAllSettings} disabled={isSaving} className="flex-1">
                    {isSaving ? <>
                        <Settings className="w-4 h-4 mr-2 animate-spin" />
                        Se salvează...
                      </> : <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Salvează toate setările
                      </>}
                  </Button>
                  
                  <Button variant="outline" onClick={handleSignOut} className="flex-1 sm:flex-none">
                    <LogOut className="w-4 h-4 mr-2" />
                    Deconectare
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </ScrollArea>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Upgrade la Premium
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Beneficii Premium:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Rezervări de locuri de parcare
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Acces la parcări premium
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Notificări prioritare
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Suport tehnic prioritar
                </li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">29 RON/lună</p>
              <p className="text-sm text-muted-foreground">Prima lună gratuită</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Poate mai târziu
              </Button>
              <Button onClick={confirmUpgrade}>
                Activează Premium
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Out Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare deconectare</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Sunteți sigur că doriți să vă deconectați din cont?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSignOutDialog(false)}>
                Anulează
              </Button>
              <Button variant="destructive" onClick={confirmSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Deconectare
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}