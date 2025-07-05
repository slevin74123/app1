"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Car, Menu, X } from "lucide-react";
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
  const handleNavClick = (sectionId: string) => {
    onNavClick?.(sectionId);
    setMobileMenuOpen(false);
  };
  const handleLoginClick = () => {
    onLoginClick?.();
    console.log("Login clicked");
  };
  const handleSignUpClick = () => {
    onSignUpClick?.();
    console.log("Sign up clicked");
  };
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
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
              {navItems.map(item => <li key={item.id} role="none">
                  <button onClick={() => handleNavClick(item.id)} className={cn("text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1", activeSection === item.id ? "text-primary" : "text-muted-foreground")} role="menuitem" aria-label={`Navighează la secțiunea ${item.label}`}>
                    {item.label}
                  </button>
                </li>)}
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleLoginClick} className="text-sm font-medium" aria-label="Autentificare în cont">
                Autentificare
              </Button>
              <Button size="sm" onClick={handleSignUpClick} className="text-sm font-medium rounded-full px-6" aria-label="Înregistrare cont nou">
                Înregistrare
              </Button>
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
          {mobileMenuOpen && <motion.div id="mobile-menu" initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: "auto"
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.2
        }} className="md:hidden border-t bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <ul className="space-y-1" role="menu">
                  {navItems.map(item => <li key={item.id} role="none">
                      <button onClick={() => handleNavClick(item.id)} className={cn("block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", activeSection === item.id ? "text-primary bg-primary/10" : "text-muted-foreground")} role="menuitem" aria-label={`Navighează la secțiunea ${item.label}`}>
                        {item.label}
                      </button>
                    </li>)}
                </ul>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t space-y-2">
                  <Button variant="ghost" size="sm" onClick={handleLoginClick} className="w-full justify-start text-left" aria-label="Autentificare în cont">
                    Autentificare
                  </Button>
                  <Button size="sm" onClick={handleSignUpClick} className="w-full rounded-full" aria-label="Înregistrare cont nou">
                    Înregistrare
                  </Button>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </nav>
    </header>;
}