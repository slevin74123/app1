import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, MapPin } from 'lucide-react';

interface ParkingOption {
  id: string;
  nume: string;
  adresa: string;
  locuri_disponibile?: number;
  locuri_indisponibile?: number;
  locuri_total?: number;
  pret_pe_ora: number;
  rating: number;
  disponibilitate: boolean;
}

interface ParkingAutocompleteProps {
  onSelect: (parking: ParkingOption) => void;
  placeholder?: string;
  className?: string;
}

export function ParkingAutocomplete({ 
  onSelect, 
  placeholder = "Caută o parcare...", 
  className = "" 
}: ParkingAutocompleteProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<ParkingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce pentru căutare
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const searchParkings = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    try {
      // Caută în parcari_raportate
      const { data, error } = await supabase
        .from('parcari_raportate')
        .select('*')
        .or(`nume.ilike.%${query}%,adresa.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Eroare la căutarea parcărilor:', error);
        setSuggestions([]);
      } else {
        setSuggestions(data || []);
      }
    } catch (error) {
      console.error('Eroare neașteptată:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchParkings(input);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [input]);

  // Închide sugestiile când se face click în afară
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (parking: ParkingOption) => {
    setInput(parking.nume);
    setShowSuggestions(false);
    onSelect(parking);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {showSuggestions && (loading || suggestions.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Se caută...
            </div>
          )}

          {!loading && suggestions.length === 0 && input.length >= 2 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nu s-au găsit parcări pentru &quot;{input}&quot;
            </div>
          )}

          {!loading && suggestions.map((parking) => (
            <div
              key={parking.id}
              onClick={() => handleSelect(parking)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{parking.nume}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={12} />
                    {parking.adresa}
                  </div>
                </div>
                                 <div className="text-right">
                   <div className="text-sm font-medium text-green-600">
                     {parking.disponibilitate ? 'Disponibilă' : 'Ocupată'}
                   </div>
                   <div className="text-xs text-gray-500">
                     {parking.pret_pe_ora} RON/oră
                   </div>
                 </div>
               </div>
               
               <div className="mt-2 flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2">
                   <span className="text-gray-500">
                     Status: {parking.disponibilitate ? '🟢 Liberă' : '🔴 Ocupată'}
                   </span>
                 </div>
                 <div className="flex items-center gap-1">
                   <span className="text-yellow-500">⭐</span>
                   <span className="text-gray-600">{parking.rating}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 