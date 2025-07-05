"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Map, Car, Users, CheckCircle, Timer, TrendingUp, MessageCircle, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock, Leaf, Heart } from "lucide-react";

// Import subcomponents (to be created)
import HeaderNavigation from "./HeaderNavigation";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsCarousel from "./TestimonialsCarousel";

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
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Simulate testimonials loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonialsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
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
        <section id="home" className="relative py-20 lg:py-32 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    {heroTitle}
                  </h1>
                  <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
                    {heroSubtitle}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full" onClick={handleCTAClick} aria-label="Începe să folosești aplicația acum">
                    <Car className="mr-2 h-5 w-5" />
                    {ctaText}
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full" onClick={() => scrollToSection('features')} aria-label="Află mai multe despre funcționalități">
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
            }} className="relative">
                <figure className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 lg:p-12">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-border">
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
              }} className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                  <Car className="h-6 w-6" aria-hidden="true" />
                </motion.div>
                
                <motion.div animate={{
                y: [10, -10, 10]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1
              }} className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground p-3 rounded-full shadow-lg">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-muted/30">
          <FeaturesSection />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4">
          <HowItWorksSection />
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 px-4 bg-muted/30">
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
          }} className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Beneficiile comunității noastre
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Împreună construim un sistem de transport urban mai eficient și mai prietenos cu mediul
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
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
                  <Card className="text-center p-8 h-full border-2 hover:border-primary/20 transition-colors">
                    <CardHeader className="pb-4">
                      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <benefit.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-4xl font-bold text-primary mb-2">
                        {benefit.value}
                      </CardTitle>
                      <h3 className="text-xl font-semibold">{benefit.label}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {showTestimonials && <section id="testimonials" className="py-20 px-4">
            <div className="max-w-7xl mx-auto space-y-24">
              {/* Testimonials Section */}
              <div className="space-y-16">
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
            }} className="text-center mb-16">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                    Ce spun utilizatorii noștri
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Peste 50,000 de șoferi au economisit timp și au redus stresul cu ajutorul aplicației noastre
                  </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
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
                      <Card className="h-full p-8 bg-gradient-to-br from-background to-muted/30 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{testimonial.name}</h3>
                            <p className="text-muted-foreground">{testimonial.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-4">
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
                              <CheckCircle className={cn("h-5 w-5", i < testimonial.rating ? "text-yellow-400 fill-current" : "text-muted-foreground/30")} />
                            </motion.div>)}
                        </div>
                        
                        <blockquote className="text-muted-foreground leading-relaxed text-lg group-hover:text-foreground transition-colors">
                          "{testimonial.comment}"
                        </blockquote>
                      </Card>
                    </motion.div>)}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-16">
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
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                    Planuri pentru fiecare nevoie
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Începe gratuit și upgrade-ează când dorești mai multe funcționalități premium
                  </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    <Card className="p-8 h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
                        <div className="text-4xl font-bold mb-2">0 lei</div>
                        <p className="text-muted-foreground">Pentru utilizatorii ocazionali</p>
                      </div>
                      
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Căutare locuri de parcare</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Raportare locuri libere</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Până la 5 căutări pe zi</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Suport comunitate</span>
                        </li>
                      </ul>
                      
                      <Button variant="outline" className="w-full rounded-full py-6">
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
                    <Card className="p-8 h-full border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-xl transition-all duration-300 relative">
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-6 py-1">
                        Cel mai popular
                      </Badge>
                      
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>
                        <div className="text-4xl font-bold mb-2">
                          29 lei
                          <span className="text-lg font-normal text-muted-foreground">/lună</span>
                        </div>
                        <p className="text-muted-foreground">Pentru utilizatorii frecvenți</p>
                      </div>
                      
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Toate funcțiile gratuite</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Căutări nelimitate</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Rezervare anticipată</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Notificări push prioritare</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Historicul parcărilor</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Suport prioritar</span>
                        </li>
                      </ul>
                      
                      <Button className="w-full rounded-full py-6">
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
              }}>
                    <Card className="p-8 h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Business</h3>
                        <div className="text-4xl font-bold mb-2">
                          99 lei
                          <span className="text-lg font-normal text-muted-foreground">/lună</span>
                        </div>
                        <p className="text-muted-foreground">Pentru companii și flote</p>
                      </div>
                      
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Toate funcțiile Pro</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Gestionare flote vehicule</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>API integrations</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Rapoarte detaliate</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Manager dedicat</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Suport 24/7</span>
                        </li>
                      </ul>
                      
                      <Button variant="outline" className="w-full rounded-full py-6">
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
            }} className="text-center mt-16">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4">
                      Ai întrebări despre planuri?
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Toate planurile includ o perioadă de probă de 14 zile și poți anula oricând fără costuri
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="outline" className="rounded-full px-8">
                        Compară planurile
                      </Button>
                      <Button variant="outline" className="rounded-full px-8">
                        Contactează-ne
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>}

        {/* Newsletter Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
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
          }} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Fii primul care află despre noutăți
                </h2>
                <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                  Abonează-te la newsletter-ul nostru pentru a primi actualizări despre noi funcționalități și orașe acoperite
                </p>
              </div>

              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input type="email" placeholder="Adresa ta de email" className="flex-1 bg-primary-foreground text-foreground" aria-label="Adresa de email pentru newsletter" />
                <Button type="submit" variant="secondary" className="px-8" aria-label="Abonează-te la newsletter">
                  <Mail className="mr-2 h-4 w-4" />
                  Abonează-te
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Logo and description */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-primary" aria-hidden="true" />
                <span className="text-2xl font-bold">{logoText}</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Aplicația care revoluționează modul în care găsești locuri de parcare în orașele din România. 
                Simplu, rapid, eficient.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map(social => <a key={social.id} href={social.href} className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label={`Urmărește-ne pe ${social.label}`}>
                    <social.icon className="h-5 w-5" aria-hidden="true" />
                  </a>)}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Linkuri utile</h3>
              <ul className="space-y-2">
                {footerLinks.map(link => <li key={link.id}>
                    <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>)}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>contact@undeparchez.ro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>+40 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>București, România</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Unde Parchez? Toate drepturile rezervate.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" aria-hidden="true" />
              <span>Făcut cu dragoste în România</span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}