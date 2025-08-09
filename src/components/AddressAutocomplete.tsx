
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

interface AddressAutocompleteProps {
  onSelectAddress: (
    address: string,
    lat: number | null,
    lng: number | null
  ) => void;
  value: string;
  onChange: (value: string) => void;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelectAddress,
  value,
  onChange,
}) => {
  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here, e.g., componentRestrictions: { country: 'ro' } */
    },
    debounce: 300,
  });

  const handleSelect =
    ({ description }: { description: string }) =>
    async () => {
      setValue(description, false);
      clearSuggestions();
      onChange(description);

      try {
        const results = await getGeocode({ address: description });
        const { lat, lng } = await getLatLng(results[0]);
        onSelectAddress(description, lat, lng);
      } catch (error) {
        console.error("Error: ", error);
        onSelectAddress(description, null, null);
      }
    };

  return (
    <Command className="relative">
      <CommandInput
        value={value}
        onValueChange={(search) => {
          setValue(search);
          onChange(search);
        }}
        disabled={!ready}
        placeholder="Caută o adresă..."
        className="w-full"
      />
      {status === "OK" && (
        <CommandList className="absolute z-10 top-full mt-1 w-full bg-card border rounded-md shadow-lg">
          {data.map((suggestion) => (
            <CommandItem
              key={suggestion.place_id}
              onSelect={handleSelect(suggestion)}
              value={suggestion.description}
            >
              {suggestion.description}
            </CommandItem>
          ))}
        </CommandList>
      )}
      {status !== "OK" && status !== "ZERO_RESULTS" && value.length > 2 && (
        <CommandEmpty>Nu s-au găsit rezultate.</CommandEmpty>
      )}
    </Command>
  );
}; 