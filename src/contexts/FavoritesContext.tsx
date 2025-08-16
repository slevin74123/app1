'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { FavoritesService, type FavoriteParking as SupabaseFavoriteParking } from '@/lib/favoritesService';

export interface FavoriteParking {
  id: string;
  name: string;
  address: string;
  rating: number;
  price: number;
  distance: number;
  addedDate: string;
}

interface FavoritesContextType {
  favorites: FavoriteParking[];
  isLoading: boolean;
  addToFavorites: (parkingData: {
    parking_spot_id: string;
    parking_name: string;
    parking_address: string;
    parking_type: 'garage' | 'street' | 'lot';
    price: number;
    rating: number;
  }) => Promise<{ success: boolean; error?: string }>;
  removeFromFavorites: (parkingSpotId: string) => Promise<{ success: boolean; error?: string }>;
  isFavorite: (parkingSpotId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<FavoriteParking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      refreshFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const refreshFavorites = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await FavoritesService.getUserFavorites(user);
      if (result.success && result.data) {
        const convertedFavorites: FavoriteParking[] = result.data.map(fav => ({
          id: fav.parking_spot_id,
          name: fav.parking_name,
          address: fav.parking_address,
          rating: fav.rating,
          price: fav.price,
          distance: 0,
          addedDate: new Date(fav.added_at).toLocaleDateString('ro-RO')
        }));
        setFavorites(convertedFavorites);
      } else {
        console.error('Error loading favorites:', result.error);
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error refreshing favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (parkingData: {
    parking_spot_id: string;
    parking_name: string;
    parking_address: string;
    parking_type: 'garage' | 'street' | 'lot';
    price: number;
    rating: number;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Utilizatorul nu este autentificat' };
    }

    try {
      const result = await FavoritesService.addToFavorites(user, parkingData);
      
      if (result.success) {
        // Refresh favorites to get the updated list
        await refreshFavorites();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  };

  const removeFromFavorites = async (parkingSpotId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Utilizatorul nu este autentificat' };
    }

    try {
      const result = await FavoritesService.removeFromFavorites(user, parkingSpotId);
      
      if (result.success) {
        // Refresh favorites to get the updated list
        await refreshFavorites();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  };

  const isFavorite = (parkingSpotId: string): boolean => {
    return favorites.some(fav => fav.id === parkingSpotId);
  };

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 