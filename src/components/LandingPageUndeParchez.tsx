"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, Users, CheckCircle, Timer, TrendingUp, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Leaf, Heart } from "lucide-react";

// Import subcomponents (to be created)
import HeaderNavigation from "./HeaderNavigation";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";

// Interfaces for data structures
interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar?: string;
}
interface BenefitStat {
  id: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  value: string;
  label: string;
  description: string;
}
interface FooterLink {
  id: string;
  label: string;
  href: string;
}
interface SocialLink {
  id: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  href: string;
  label: string;
}
export interface LandingPageUndeParchezProps {
  logoText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  showTestimonials?: boolean;
}

// Mock data
const testimonials: Testimonial[] = [{
  id: "1",
  name: "Maria Popescu",
  location: "București",
  rating: 5,
  comment: "Aplicația mi-a economisit ore întregi de căutare a locurilor de parcare în centrul Bucureștiului. Recomand cu încredere!"
}, {
  id: "2",
  name: "Alexandru Ionescu",
  location: "Cluj-Napoca",
  rating: 5,
  comment: "Foarte utilă pentru orașul nostru aglomerat. Comunitatea este activă și informațiile sunt mereu la zi."
}, {
  id: "3",
  name: "Elena Dumitrescu",
  location: "Timișoara",
  rating: 4,
  comment: "O idee excelentă! M-a ajutat să evit stresul de a căuta parcare, mai ales în zonele comerciale."
}];
const benefitStats: BenefitStat[] = [{
  id: "1",
  icon: Timer,
  value: "30 min",
  label: "Timp economisit",
  description: "În medie pe zi pentru fiecare utilizator"
}, {
  id: "2",
  icon: Leaf,
  value: "25%",
  label: "Reducerea poluării",
  description: "Prin diminuarea timpului de căutare"
}, {
  id: "3",
  icon: Users,
  value: "50,000+",
  label: "Utilizatori activi",
  description: "Comunitate în creștere în toată România"
}];
const footerLinks: FooterLink[] = [{
  id: "1",
  label: "Termeni și condiții",
  href: "#terms"
}, {
  id: "2",
  label: "Politica de confidențialitate",
  href: "#privacy"
}, {
  id: "3",
  label: "Suport",
  href: "#support"
}, {
  id: "4",
  label: "FAQ",
  href: "#faq"
}];
const socialLinks: SocialLink[] = [{
  id: "1",
  icon: Facebook,
  href: "#facebook",
  label: "Facebook"
}, {
  id: "2",
  icon: Instagram,
  href: "#instagram",
  label: "Instagram"
}, {
  id: "3",
  icon: Twitter,
  href: "#twitter",
  label: "Twitter"
}];
export default function LandingPageUndeParchez({
  logoText = "Unde Parchez?",
  heroTitle = "Găsește locul de parcare în timp real în orașele din România",
  heroSubtitle = "Aplicația care conectează șoferii și îi ajută să găsească rapid locuri de parcare disponibile, reducând stresul și traficul urban.",
  ctaText = "Începe acum",
  showTestimonials = true
}: LandingPageUndeParchezProps) {
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleCTAClick = () => {
    // Simulate CTA action
    console.log("CTA clicked - redirect to app/registration");
  };
  return <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <HeaderNavigation logoText={logoText} onNavClick={scrollToSection} activeSection={activeSection} />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section id="home" className="relative py-12 sm:py-16 lg:py-24 xl:py-32 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    {heroTitle}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl">
                    {heroSubtitle}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full" onClick={handleCTAClick} aria-label="Începe să folosești aplicația acum">
                    <Car className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {ctaText}
                  </Button>
                  <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full" onClick={() => scrollToSection('features')} aria-label="Află mai multe despre funcționalități">
                    Află mai multe
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="relative mt-8 lg:mt-0">
                <figure className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12">
                  <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-border">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91504.8544841627!2d26.020923476171447!3d44.43775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f93abf3cad4f%3A0xac0632e37c9ca628!2sBucharest%2C%20Romania!5e0!3m2!1sen!2s!4v1647123456789!5m2!1sen!2s" width="100%" height="100%" style={{
                    border: 0
                  }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Hartă interactivă Bucuresti România - Unde Parchez?" aria-label="Hartă Google Maps cu locația Bucuresti, România" />
                  </div>
                  <figcaption className="sr-only">
                    Ilustrație cu hartă interactivă pentru găsirea locurilor de parcare
                  </figcaption>
                </figure>
                
                {/* Floating elements */}
                <motion.div animate={{
                y: [-10, 10, -10]
              }} transition={{
                duration: 4,
                repeat: Infinity
              }} className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-primary text-primary-foreground p-2 sm:p-3 rounded-full shadow-lg">
                  <Car className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
                </motion.div>
                
                <motion.div animate={{
                y: [10, -10, 10]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1
              }} className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-accent text-accent-foreground p-2 sm:p-3 rounded-full shadow-lg">
                  <MapPin className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
          <FeaturesSection />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4">
          <HowItWorksSection />
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
                Beneficiile comunității noastre
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                Împreună construim un sistem de transport urban mai eficient și mai prietenos cu mediul
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {benefitStats.map((benefit, index) => <motion.div key={benefit.id} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} viewport={{
              once: true
            }}>
                  <Card className="text-center p-6 sm:p-8 h-full border-2 hover:border-primary/20 transition-colors">
                    <CardHeader className="pb-4">
                      <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <benefit.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                        {benefit.value}
                      </CardTitle>
                      <h3 className="text-lg sm:text-xl font-semibold">{benefit.label}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {showTestimonials && <section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4">
            <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
              {/* Testimonials Section */}
              <div className="space-y-12 sm:space-y-16">
                {/* Header */}
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} viewport={{
              once: true
            }} className="text-center mb-12 sm:mb-16">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
                    Ce spun utilizatorii noștri
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Peste 50,000 de șoferi au economisit timp și au redus stresul cu ajutorul aplicației noastre
                  </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {testimonials.map((testimonial, index) => <motion.div key={testimonial.id} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} viewport={{
                once: true
              }}>
                      <Card className="h-full p-6 sm:p-8 bg-gradient-to-br from-background to-muted/30 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl group">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base sm:text-lg">{testimonial.name}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">{testimonial.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-3 sm:mb-4">
                          {Array.from({
                      length: 5
                    }, (_, i) => <motion.div key={i} initial={{
                      scale: 0
                    }} whileInView={{
                      scale: 1
                    }} transition={{
                      delay: index * 0.1 + i * 0.05
                    }} viewport={{
                      once: true
                    }}>
                              <CheckCircle className={cn("h-4 w-4 sm:h-5 sm:w-5", i < testimonial.rating ? "text-yellow-400 fill-current" : "text-muted-foreground/30")} />
                            </motion.div>)}
                        </div>
                        
                        <blockquote className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          &quot;{testimonial.comment}&quot;
                        </blockquote>
                      </Card>
                    </motion.div>)}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-12 sm:space-y-16">
                {/* Pricing Header */}
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} viewport={{
              once: true
            }} className="text-center">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
                    Planuri pentru fiecare nevoie
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Începe gratuit și upgrade-ează când dorești mai multe funcționalități premium
                  </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                  {/* Free Plan */}
                  <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.1
              }} viewport={{
                once: true
              }}>
                    <Card className="p-6 sm:p-8 h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Car className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">Gratuit</h3>
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">0 lei</div>
                        <p className="text-sm sm:text-base text-muted-foreground">Pentru utilizatorii ocazionali</p>
                      </div>
                      
                      <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Căutare locuri de parcare</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Raportare locuri libere</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Până la 5 căutări pe zi</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Suport comunitate</span>
                        </li>
                      </ul>
                      
                      <Button variant="outline" className="w-full rounded-full py-4 sm:py-6">
                        Începe gratuit
                      </Button>
                    </Card>
                  </motion.div>

                  {/* Pro Plan */}
                  <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.2
              }} viewport={{
                once: true
              }}>
                    <Card className="p-6 sm:p-8 h-full border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-xl transition-all duration-300 relative">
                      <Badge className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-1 text-xs sm:text-sm">
                        Cel mai popular
                      </Badge>
                      
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">Pro</h3>
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                          29 lei
                          <span className="text-sm sm:text-base lg:text-lg font-normal text-muted-foreground">/lună</span>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground">Pentru utilizatorii frecvenți</p>
                      </div>
                      
                      <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Toate funcțiile gratuite</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Căutări nelimitate</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Rezervare anticipată</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Notificări push prioritare</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Historicul parcărilor</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Suport prioritar</span>
                        </li>
                      </ul>
                      
                      <Button className="w-full rounded-full py-4 sm:py-6">
                        Începe perioada de probă
                      </Button>
                    </Card>
                  </motion.div>

                  {/* Business Plan */}
                  <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.3
              }} viewport={{
                once: true
              }} className="sm:col-span-2 lg:col-span-1">
                    <Card className="p-6 sm:p-8 h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">Business</h3>
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                          99 lei
                          <span className="text-sm sm:text-base lg:text-lg font-normal text-muted-foreground">/lună</span>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground">Pentru companii și flote</p>
                      </div>
                      
                      <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Toate funcțiile Pro</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Gestionare flote vehicule</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">API integrations</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Rapoarte detaliate</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Manager dedicat</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Suport 24/7</span>
                        </li>
                      </ul>
                      
                      <Button variant="outline" className="w-full rounded-full py-4 sm:py-6">
                        Contactează echipa
                      </Button>
                    </Card>
                  </motion.div>
                </div>

                {/* Pricing Footer */}
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.4
            }} viewport={{
              once: true
            }} className="text-center mt-12 sm:mt-16">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                      Ai întrebări despre planuri?
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                      Toate planurile includ o perioadă de probă de 14 zile și poți anula oricând fără costuri
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <Button variant="outline" className="rounded-full px-6 sm:px-8">
                        Compară planurile
                      </Button>
                      <Button variant="outline" className="rounded-full px-6 sm:px-8">
                        Contactează-ne
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>}

        {/* Newsletter Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Fii primul care află despre noutăți
                </h2>
                <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                  Abonează-te la newsletter-ul nostru pentru a primi actualizări despre noi funcționalități și orașe acoperite
                </p>
              </div>

              <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <Input type="email" placeholder="Adresa ta de email" className="flex-1 bg-primary-foreground text-foreground" aria-label="Adresa de email pentru newsletter" />
                <Button type="submit" variant="secondary" className="px-6 sm:px-8" aria-label="Abonează-te la newsletter">
                  <Mail className="mr-2 h-4 w-4" />
                  Abonează-te
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Logo and description */}
            <div className="sm:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <Car className="h-6 w-6 sm:h-8 sm:w-8 text-primary" aria-hidden="true" />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold">{logoText}</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                Aplicația care revoluționează modul în care găsești locuri de parcare în orașele din România. 
                Simplu, rapid, eficient.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map(social => <a key={social.id} href={social.href} className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label={`Urmărește-ne pe ${social.label}`}>
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </a>)}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base sm:text-lg">Linkuri utile</h3>
              <ul className="space-y-2">
                {footerLinks.map(link => <li key={link.id}>
                    <a href={link.href} className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>)}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base sm:text-lg">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="text-sm sm:text-base">contact@undeparchez.ro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="text-sm sm:text-base">+40 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="text-sm sm:text-base">București, România</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-muted-foreground text-xs sm:text-sm">
              © 2024 Unde Parchez? Toate drepturile rezervate.
            </p>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" aria-hidden="true" />
              <span>Făcut cu dragoste în România</span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}