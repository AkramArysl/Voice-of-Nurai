import { useEffect, useMemo } from "react";
import { divIcon } from "leaflet";
import type { DivIcon, LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LeafletMapProps = {
  lat: number | null;
  lng: number | null;
  label?: string;
};

const BISHKEK_CENTER: LatLngExpression = [42.8746, 74.5698];

function createRedPinIcon(): DivIcon {
  return divIcon({
    className: "nurai-red-pin-wrapper",
    html: '<span class="nurai-red-pin"><span class="nurai-red-pin-dot"></span></span>',
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    popupAnchor: [0, -36],
  });
}

function MapUpdater({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);

  return null;
}

export default function LeafletMap({ lat, lng, label = "Текущая позиция" }: LeafletMapProps) {
  const hasPosition = lat !== null && lng !== null && Number.isFinite(lat) && Number.isFinite(lng);
  const center = useMemo<LatLngExpression>(() => (hasPosition ? [lat, lng] : BISHKEK_CENTER), [hasPosition, lat, lng]);
  const redPinIcon = useMemo(() => createRedPinIcon(), []);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      <MapContainer center={center} zoom={hasPosition ? 16 : 12} scrollWheelZoom className="h-[420px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={hasPosition ? 16 : 12} />
        {hasPosition && (
          <Marker position={[lat, lng]} icon={redPinIcon}>
            <Popup>{label}</Popup>
          </Marker>
        )}
      </MapContainer>
      {!hasPosition && <p className="px-4 py-3 text-sm text-slate-600">Ожидаем координаты для отображения пина.</p>}
    </div>
  );
}
