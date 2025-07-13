"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Car, Menu, X, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeaderNavigationProps {
  logoText?: string;
  onNavClick?: (sectionId: string) => void;
  activeSection?: string;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

// Navigation menu items
const navItems: NavItem[] = [{
  id: "home",
  label: "Acasă",
  href: "#home"
}, {
  id: "features",
  label: "Funcționalități",
  href: "#features"
}, {
  id: "about",
  label: "Despre",
  href: "#about"
}, {
  id: "contact",
  label: "Contact",
  href: "#contact"
}];

export default function HeaderNavigation({
  logoText = "Unde Parchez?",
  onNavClick,
  activeSection = "home",
  onLoginClick,
  onSignUpClick
}: HeaderNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();

  const handleNavClick = (sectionId: string) => {
    onNavClick?.(sectionId);
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    setAuthModalTab('signin');
    setAuthModalOpen(true);
    onLoginClick?.();
  };

  const handleSignUpClick = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
    onSignUpClick?.();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Navigare principală">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold text-foreground">{logoText}</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex items-center space-x-6" role="menubar">
                {navItems.map(item => (
                  <li key={item.id} role="none">
                    <button 
                      onClick={() => handleNavClick(item.id)} 
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1",
                        activeSection === item.id ? "text-primary" : "text-muted-foreground"
                      )} 
                      role="menuitem" 
                      aria-label={`Navighează la secțiunea ${item.label}`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="text-sm font-medium flex items-center gap-2" aria-label="Accesează dashboard-ul">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
                
                {user ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-foreground hidden lg:block">
                        {user.email}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSignOut}
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span className="hidden sm:block">Deconectare</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleLoginClick} className="text-sm font-medium" aria-label="Autentificare în cont">
                      Autentificare
                    </Button>
                    <Button size="sm" onClick={handleSignUpClick} className="text-sm font-medium rounded-full px-6" aria-label="Înregistrare cont nou">
                      Înregistrare
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-2" aria-label={mobileMenuOpen ? "Închide meniul" : "Deschide meniul"} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
                {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                id="mobile-menu" 
                initial={{
                  opacity: 0,
                  height: 0
                }} 
                animate={{
                  opacity: 1,
                  height: "auto"
                }} 
                exit={{
                  opacity: 0,
                  height: 0
                }} 
                transition={{
                  duration: 0.2
                }} 
                className="md:hidden border-t bg-background"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <ul className="space-y-1" role="menu">
                    {navItems.map(item => (
                      <li key={item.id} role="none">
                        <button 
                          onClick={() => handleNavClick(item.id)} 
                          className={cn(
                            "block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            activeSection === item.id ? "text-primary bg-primary/10" : "text-muted-foreground"
                          )} 
                          role="menuitem" 
                          aria-label={`Navighează la secțiunea ${item.label}`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Mobile Auth Buttons */}
                  <div className="pt-4 border-t space-y-2">
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start text-left flex items-center gap-2" aria-label="Accesează dashboard-ul">
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Button>
                    </Link>
                    
                    {user ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">
                            {user.email}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleSignOut}
                          className="w-full justify-start text-left flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Deconectare
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={handleLoginClick} className="w-full justify-start text-left" aria-label="Autentificare în cont">
                          Autentificare
                        </Button>
                        <Button size="sm" onClick={handleSignUpClick} className="w-full rounded-full" aria-label="Înregistrare cont nou">
                          Înregistrare
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}