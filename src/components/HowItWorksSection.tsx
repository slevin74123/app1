"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Users, ArrowRight } from "lucide-react";
interface Step {
  id: string;
  number: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}
export interface HowItWorksSectionProps {
  title?: string;
  subtitle?: string;
}

// Steps data
const steps: Step[] = [{
  id: "1",
  number: 1,
  icon: MapPin,
  title: "Raportează un loc liber",
  description: "Când părăsești un loc de parcare, raportează-l rapid în aplicație. Ajuți astfel alți șoferi să-l găsească mai ușor."
}, {
  id: "2",
  number: 2,
  icon: Car,
  title: "Găsește un loc",
  description: "Caută pe hartă locurile disponibile în zona dorită. Filtrează după distanță, preț sau tipul de parcare."
}, {
  id: "3",
  number: 3,
  icon: Users,
  title: "Informează comunitatea",
  description: "Confirmă disponibilitatea locurilor găsite și contribuie la acuratețea informațiilor pentru toți utilizatorii."
}];
export default function HowItWorksSection({
  title = "Cum funcționează?",
  subtitle = "Trei pași simpli pentru a găsi și a raporta locuri de parcare în comunitatea noastră"
}: HowItWorksSectionProps) {
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

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => <React.Fragment key={step.id}>
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.2
          }} viewport={{
            once: true
          }} className="relative">
                <Card className="h-full p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 group">
                  <CardHeader className="pb-4">
                    <div className="relative mx-auto mb-4">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors relative">
                        <step.icon className="h-10 w-10 text-primary" aria-hidden="true" />
                        <Badge className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center p-0 bg-primary text-primary-foreground font-bold">
                          {step.number}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Arrow between steps (desktop only) */}
              {index < steps.length - 1 && <div className="hidden md:flex items-center justify-center absolute top-1/2 transform -translate-y-1/2" style={{
            left: `${(index + 1) * 33.33 - 16.66}%`
          }}>
                  <motion.div initial={{
              opacity: 0,
              scale: 0
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.4,
              delay: index * 0.2 + 0.3
            }} viewport={{
              once: true
            }} className="bg-primary/10 rounded-full p-2">
                    <ArrowRight className="h-6 w-6 text-primary" aria-hidden="true" />
                  </motion.div>
                </div>}
            </React.Fragment>)}
        </div>

        {/* Call to Action */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.8
      }} viewport={{
        once: true
      }} className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Gata să începi?
            </h3>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Alătură-te comunității de șoferi care își ajută reciproc să găsească locuri de parcare. 
              Cu cât suntem mai mulți, cu atât sistemul devine mai eficient pentru toți.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Descarcă aplicația acum">
                Descarcă aplicația
              </motion.button>
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="border border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Află mai multe despre aplicație">
                Află mai multe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
}