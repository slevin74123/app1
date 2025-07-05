"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Users, CheckCircle } from "lucide-react";
interface Feature {
  id: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  badge?: string;
}
export interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
}

// Features data
const features: Feature[] = [{
  id: "1",
  icon: Map,
  title: "Monitorizare în timp real",
  description: "Informații actualizate constant despre disponibilitatea locurilor de parcare din orașul tău. Știi exact unde să mergi înainte să pleci de acasă.",
  badge: "Live"
}, {
  id: "2",
  icon: Users,
  title: "Sistem colaborativ",
  description: "Comunitatea de șoferi raportează și confirmă locurile libere. Cu cât suntem mai mulți, cu atât informațiile sunt mai precise și utile pentru toți.",
  badge: "Comunitate"
}, {
  id: "3",
  icon: CheckCircle,
  title: "Reducerea stresului și a traficului",
  description: "Elimină timpul pierdut căutând parcare și contribuie la reducerea aglomerației urbane. Mai puțin stres, mai mult timp pentru lucrurile importante.",
  badge: "Eficiență"
}];
export default function FeaturesSection({
  title = "Funcționalitățile care fac diferența",
  subtitle = "Descoperă cum tehnologia și comunitatea lucrează împreună pentru a-ți simplifica experiența de parcare"
}: FeaturesSectionProps) {
  return <section className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
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
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => <motion.div key={feature.id} initial={{
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
              <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 group">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    {feature.badge && <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                        {feature.badge}
                      </Badge>}
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>

        {/* Additional Info */}
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
          <div className="bg-primary/5 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              De ce să alegi Unde Parchez?
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Suntem prima aplicație din România care combină tehnologia cu puterea comunității pentru a rezolva 
              problema parcării urbane. Fiecare utilizator contribuie la un sistem mai inteligent și mai eficient.
            </p>
          </div>
        </motion.div>
      </div>
    </section>;
}