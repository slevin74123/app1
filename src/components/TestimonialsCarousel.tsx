"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar?: string;
}
export interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  loading?: boolean;
  error?: boolean;
  title?: string;
}
export default function TestimonialsCarousel({
  testimonials = [],
  loading = false,
  error = false,

}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToIndex = useCallback((index: number) => {
    if (scrollRef.current) {
      const cardWidth = 320; // Approximate card width + gap
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  }, []);
  const scrollLeft = useCallback(() => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(newIndex);
  }, [activeIndex, scrollToIndex]);
  
  const scrollRight = useCallback(() => {
    const newIndex = Math.min(testimonials.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  }, [activeIndex, testimonials.length, scrollToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        scrollLeft();
      } else if (event.key === 'ArrowRight') {
        scrollRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollLeft, scrollRight]);
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={cn("h-4 w-4", i < rating ? "text-yellow-400 fill-current" : "text-muted-foreground")} aria-hidden="true" />);
  };

  // Loading state
  if (loading) {
    return <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({
          length: 3
        }, (_, i) => <Card key={i} className="min-w-[300px] p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>;
  }

  // Error state
  if (error) {
    return <div className="w-full text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Nu am putut încărca testimonialele
          </h3>
          <p className="text-muted-foreground mb-4">
            A apărut o eroare la încărcarea recenziilor utilizatorilor. Te rugăm să încerci din nou.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()} aria-label="Reîncarcă testimonialele">
            Încearcă din nou
          </Button>
        </div>
      </div>;
  }

  // Empty state
  if (!testimonials || testimonials.length === 0) {
    return <div className="w-full text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Încă nu avem testimoniale
          </h3>
          <p className="text-muted-foreground">
            Fii primul care lasă o recenzie și ajută-i pe alții să descopere aplicația noastră.
          </p>
        </div>
      </div>;
  }
  return <section className="w-full" aria-label="Testimoniale utilizatori">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} disabled={activeIndex === 0} className="rounded-full" aria-label="Testimonialul anterior">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} disabled={activeIndex >= testimonials.length - 1} className="rounded-full" aria-label="Testimonialul următor">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => <button key={index} onClick={() => scrollToIndex(index)} className={cn("w-2 h-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", index === activeIndex ? "bg-primary" : "bg-muted-foreground/30")} aria-label={`Mergi la testimonialul ${index + 1}`} />)}
        </div>
      </div>

      {/* Testimonials Carousel */}
      <ScrollArea className="w-full">
        <div ref={scrollRef} className="flex gap-6 pb-4" role="region" aria-label="Carusel testimoniale">
          {testimonials.map((testimonial, index) => <motion.div key={testimonial.id} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.4,
          delay: index * 0.1
        }} className="min-w-[300px] max-w-[300px]">
              <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {testimonial.avatar ? <Image src={testimonial.avatar} alt={`Fotografia utilizatorului ${testimonial.name}`} width={48} height={48} className="w-full h-full object-cover" /> : <User className="h-6 w-6 text-muted-foreground" aria-hidden="true" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{testimonial.name}</h3>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1" aria-label={`Rating: ${testimonial.rating} din 5 stele`}>
                    {renderStars(testimonial.rating)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <blockquote className="text-sm text-muted-foreground leading-relaxed">
                    &quot;{testimonial.comment}&quot;
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>
      </ScrollArea>
    </section>;
}