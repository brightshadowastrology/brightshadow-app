"use client";

import { cn } from "@/shared/lib/css";
import { SewingPinFilledIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Input, { type InputProps } from "../Form/Input";

const PLACES_API_BASE = "https://places.googleapis.com/v1";

export type PlacePrediction = {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
};

export type PlaceDetails = {
  placeId: string;
  formattedAddress: string;
  displayName: string;
  location: { latitude: number; longitude: number } | null;
  addressComponents: Array<{
    longText: string;
    shortText: string;
    types: string[];
  }>;
};

export type PlacesAutocompleteProps = Omit<InputProps, "onSelect"> & {
  onSelect?: (place: PlaceDetails) => void;
};

async function fetchPredictions(
  input: string,
  sessionToken: string,
): Promise<PlacePrediction[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(`${PLACES_API_BASE}/places:autocomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      input,
      includedPrimaryTypes: ["(cities)"],
      sessionToken,
    }),
  });

  if (!res.ok) return [];

  const data = await res.json();
  const suggestions: PlacePrediction[] = (data.suggestions ?? [])
    .filter((s: Record<string, unknown>) => s.placePrediction)
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: any) => ({
        placeId: s.placePrediction.placeId,
        text: s.placePrediction.text?.text ?? "",
        mainText: s.placePrediction.structuredFormat?.mainText?.text ?? "",
        secondaryText:
          s.placePrediction.structuredFormat?.secondaryText?.text ?? "",
      }),
    );

  return suggestions;
}

async function fetchPlaceDetails(
  placeId: string,
): Promise<PlaceDetails | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "id,formattedAddress,displayName,location,addressComponents",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return {
    placeId: data.id,
    formattedAddress: data.formattedAddress ?? "",
    displayName: data.displayName?.text ?? "",
    location: data.location ?? null,
    addressComponents: (data.addressComponents ?? []).map(
      (c: { longText: string; shortText: string; types: string[] }) => ({
        longText: c.longText,
        shortText: c.shortText,
        types: c.types,
      }),
    ),
  };
}

function generateSessionToken(): string {
  return crypto.randomUUID();
}

export const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onSelect,
  className,
  label,
  onKeyDown: userOnKeyDown,
  ...props
}) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const sessionTokenRef = useRef(generateSessionToken());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (value: string) => {
    if (value.length < 2) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    const results = await fetchPredictions(value, sessionTokenRef.current);
    setPredictions(results);
    setIsOpen(results.length > 0);
    setActiveIndex(-1);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = async (prediction: PlacePrediction) => {
    setInputValue(prediction.text);
    setIsOpen(false);
    setPredictions([]);

    const details = await fetchPlaceDetails(prediction.placeId);

    // Start a new session after a selection
    sessionTokenRef.current = generateSessionToken();

    if (details) {
      onSelect?.(details);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!isOpen) {
      userOnKeyDown?.(e);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < predictions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : predictions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && predictions[activeIndex]) {
          handleSelect(predictions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }

    userOnKeyDown?.(e);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        data-1p-ignore
        label={label || "L'Addresse"}
        type="text"
        autoComplete="off"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        {...props}
        className={cn(
          "focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border-1 border-gray-300 px-(--custom-xs) py-(--custom-xs) pl-8",
          className,
        )}
      >
        <span className="pointer-none text-primary-300 absolute top-0 bottom-0 left-2 flex items-center">
          <SewingPinFilledIcon className="w-6" />
        </span>
      </Input>

      {isOpen && predictions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {predictions.map((prediction, index) => (
            <li
              key={prediction.placeId}
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm",
                index === activeIndex
                  ? "bg-primary-100 text-black"
                  : "hover:bg-primary-100",
              )}
              onMouseDown={() => handleSelect(prediction)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="font-medium">{prediction.mainText}</span>
              {prediction.secondaryText && (
                <span className="text-gray-400">
                  {" "}
                  {prediction.secondaryText}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
