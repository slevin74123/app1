import React, { useState, useRef, useEffect } from "react";

// Helper pentru debounce pentru funcții cu un singur parametru string
function debounce(fn: (value: string) => void, ms: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), ms);
  };
}

export function GoogleMapsAutocomplete({
  onSelect,
  placeholder = "Caută o adresă...",
  className = "",
}: {
  onSelect: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  className?: string;
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const attributionRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const fetchSuggestions = React.useCallback((value: string) => {
    const debouncedFn = debounce((searchValue: string) => {
      if (!window.google?.maps?.places?.AutocompleteService) return;
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      }
      setLoading(true);
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: searchValue,
          sessionToken: sessionTokenRef.current!,
        },
        (preds: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
          setLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
            setSuggestions(preds);
          } else {
            setSuggestions([]);
          }
        }
      );
    }, 350);
    
    debouncedFn(value);
  }, []);

  useEffect(() => {
    if (input.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    fetchSuggestions(input);
  }, [input, fetchSuggestions]);

  // Select sugestie => detalii loc
  const handleSelect = (suggestion: google.maps.places.AutocompletePrediction) => {
    setInput(suggestion.description);
    setSuggestions([]);
    if (!window.google?.maps?.places?.PlacesService) return;
    const placesService = new window.google.maps.places.PlacesService(
      attributionRef.current || document.createElement("div")
    );
    placesService.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ["geometry.location", "formatted_address", "name", "place_id"],
        sessionToken: sessionTokenRef.current!,
      },
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        // Reset session token după select
        sessionTokenRef.current = null;
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          onSelect(
            suggestion.description,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        } else {
          onSelect(suggestion.description, 0, 0);
        }
      }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded"
        autoComplete="off"
      />
      {loading && <div className="absolute left-0 right-0 bg-white p-2">Caut...</div>}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border z-10 max-h-60 overflow-auto">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(s)}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
      {/* Container pentru Google attribution */}
      <div ref={attributionRef} style={{ display: "none" }} />
    </div>
  );
} 