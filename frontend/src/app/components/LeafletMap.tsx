import { useEffect, useRef, useState } from "react";

interface LeafletMapProps {
  lat: number | null;
  lng: number | null;
  height?: string;
}

interface LeafletGlobal {
  map: (element: HTMLElement) => LeafletMapInstance;
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: LeafletMapInstance) => void };
  marker: (coords: [number, number], options?: Record<string, unknown>) => LeafletMarker;
  divIcon: (options: Record<string, unknown>) => unknown;
}

interface LeafletMapInstance {
  setView: (coords: [number, number], zoom: number) => LeafletMapInstance;
  remove: () => void;
}

interface LeafletMarker {
  addTo: (map: LeafletMapInstance) => LeafletMarker;
  setLatLng: (coords: [number, number]) => void;
}

declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

const DEFAULT_POSITION: [number, number] = [42.8746, 74.5698];

function loadLeaflet(): Promise<LeafletGlobal> {
  if (window.L) {
    return Promise.resolve(window.L);
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-leaflet]");
    const existingLink = document.querySelector<HTMLLinkElement>("link[data-leaflet]");

    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.leaflet = "true";
      document.head.appendChild(link);
    }

    const finish = () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(new Error("Не удалось загрузить карту"));
      }
    };

    if (existingScript) {
      existingScript.addEventListener("load", finish, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Не удалось загрузить карту")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.leaflet = "true";
    script.onload = finish;
    script.onerror = () => reject(new Error("Не удалось загрузить карту"));
    document.body.appendChild(script);
  });
}

export default function LeafletMap({ lat, lng, height = "420px" }: LeafletMapProps) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const map = useRef<LeafletMapInstance | null>(null);
  const marker = useRef<LeafletMarker | null>(null);
  const [error, setError] = useState("");
  const hasPosition = typeof lat === "number" && typeof lng === "number";
  const currentPosition: [number, number] | null = hasPosition ? [lat as number, lng as number] : null;

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapElement.current || map.current) {
          return;
        }

        const startPosition: [number, number] = currentPosition ?? DEFAULT_POSITION;
        const pin = L.divIcon({
          className: "nur-map-pin",
          html: "<span></span>",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        map.current = L.map(mapElement.current).setView(startPosition, 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
        }).addTo(map.current);
        marker.current = L.marker(startPosition, { icon: pin }).addTo(map.current);
      })
      .catch((mapError: unknown) => {
        setError(mapError instanceof Error ? mapError.message : "Не удалось загрузить карту");
      });

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hasPosition || !map.current || !marker.current) {
      return;
    }

    const nextPosition: [number, number] = [lat as number, lng as number];
    marker.current.setLatLng(nextPosition);
    map.current.setView(nextPosition, 16);
  }, [hasPosition, lat, lng]);

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700" style={{ height }}>
        {error}
      </div>
    );
  }

  return <div ref={mapElement} className="nur-map-shell overflow-hidden rounded-lg border border-slate-200" style={{ height }} />;
}
