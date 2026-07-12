"use client";

import { useEffect, useState } from "react";

// Minimal typings for the slice of the Places API we use — avoids pulling in
// @types/google.maps (or a wrapper package) for one autocomplete widget.
export interface PlaceResult {
  name?: string;
  formatted_address?: string;
  geometry?: { location?: { lat(): number; lng(): number } };
}

interface PlacesAutocomplete {
  getPlace(): PlaceResult;
  addListener(event: "place_changed", handler: () => void): { remove(): void };
}

interface GoogleMapsGlobal {
  maps?: {
    places?: {
      Autocomplete: new (
        input: HTMLInputElement,
        options?: {
          componentRestrictions?: { country: string };
          fields?: string[];
          types?: string[];
        }
      ) => PlacesAutocomplete;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleMapsGlobal;
  }
}

let loadPromise: Promise<void> | null = null;

/**
 * Loads the Google Maps Places script once (keyed by
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) and reports readiness. Returns false
 * forever when the key isn't configured — callers fall back to a plain
 * input, so the form never depends on Google being available.
 */
export function useGooglePlaces(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    if (!loadPromise) {
      loadPromise = new Promise<void>((resolve, reject) => {
        if (window.google?.maps?.places) return resolve();
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          loadPromise = null;
          reject(new Error("Google Maps script failed to load"));
        };
        document.head.appendChild(script);
      });
    }

    let cancelled = false;
    loadPromise
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        // Script blocked/failed — silently keep the plain-input fallback.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
