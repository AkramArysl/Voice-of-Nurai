import { useEffect, useMemo, useState } from "react";
import Layout from "./Layout";
import LeafletMap from "./LeafletMap";
import { api, User, wsUrl } from "../lib/api";

type TrackPageProps = {
  user: User | null;
  logout: () => void;
  sessionId: string;
};

type TrackEvent = {
  session_id: string;
  lat: string | number | null;
  lng: string | number | null;
  status: "active" | "resolved";
  user_name: string;
  resolved_at: string | null;
};

export default function TrackPage({ user, logout, sessionId }: TrackPageProps) {
  const [event, setEvent] = useState<TrackEvent | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "live" | "resolved" | "lost" | "error">("loading");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    api<{ event: TrackEvent }>(`/api/sos/track/${sessionId}`)
      .then((data) => {
        setEvent(data.event);
        const nextLat = data.event.lat === null ? null : Number(data.event.lat);
        const nextLng = data.event.lng === null ? null : Number(data.event.lng);
        setLat(Number.isFinite(nextLat) ? nextLat : null);
        setLng(Number.isFinite(nextLng) ? nextLng : null);
        setLastUpdate(Date.now());
        setStatus(data.event.status === "resolved" ? "resolved" : "live");
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !event || event.status === "resolved") return undefined;

    const socket = new WebSocket(wsUrl());
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "join", role: "watcher", sessionId }));
    });
    socket.addEventListener("message", (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "location") {
        setLat(Number(data.lat));
        setLng(Number(data.lng));
        setLastUpdate(data.timestamp || Date.now());
        setStatus("live");
      }
      if (data.type === "resolved") setStatus("resolved");
      if (data.type === "sender_disconnected") setStatus("lost");
    });
    return () => {
      socket.close();
    };
  }, [event, sessionId]);

  const updatedText = useMemo(() => {
    if (!lastUpdate) return "обновлений ещё нет";
    const seconds = Math.max(0, Math.round((now - lastUpdate) / 1000));
    return `Обновлено ${seconds} сек. назад`;
  }, [lastUpdate, now]);

  return (
    <Layout user={user} active="" logout={logout}>
      <main className="mx-auto max-w-4xl px-4 py-10">
        {status === "error" ? (
          <p className="rounded-md bg-red-50 p-4 text-red-700">SOS-сессия не найдена</p>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-950">
                  Отслеживание SOS: {event?.user_name || "пользователь"}
                </h1>
                <p className="mt-2 text-slate-600">{updatedText}</p>
              </div>
              {status === "live" && <span className="w-fit rounded-md bg-red-600 px-3 py-1 text-sm font-bold text-white">LIVE</span>}
            </div>

            {status === "resolved" && (
              <p className="mb-4 rounded-md bg-emerald-50 p-4 text-emerald-700">
                {event?.user_name || "Пользователь"} в безопасности. SOS завершён.
              </p>
            )}
            {status === "lost" && <p className="mb-4 rounded-md bg-amber-50 p-4 text-amber-700">Соединение потеряно</p>}

            <LeafletMap lat={lat} lng={lng} label="Местоположение SOS" />
            <p className="mt-4 text-sm text-slate-600">
              Координаты: {lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "ожидаем данные"}
            </p>
          </>
        )}
      </main>
    </Layout>
  );
}
