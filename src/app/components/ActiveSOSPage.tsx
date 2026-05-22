import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "./Layout";
import LeafletMap from "./LeafletMap";
import { Button } from "./ui/button";
import { api, ApiError, User, wsUrl } from "../lib/api";

type ActiveSOSPageProps = {
  user: User | null;
  navigate: (path: string) => void;
  logout: () => void;
};

export default function ActiveSOSPage({ user, navigate, logout }: ActiveSOSPageProps) {
  const [sessionId] = useState(() => localStorage.getItem("active_sos_session") || "");
  const initialPosition = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("active_sos_position") || "null") as { lat: number; lng: number } | null;
    } catch {
      return null;
    }
  }, []);
  const [lat, setLat] = useState<number | null>(initialPosition?.lat || null);
  const [lng, setLng] = useState<number | null>(initialPosition?.lng || null);
  const [error, setError] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) navigate("/login");
    if (!sessionId) navigate("/sos");
  }, [user, sessionId, navigate]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "SOS активен. Сначала нажмите «Я в безопасности — остановить».";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  useEffect(() => {
    if (!sessionId) return undefined;
    if (!navigator.geolocation) {
      setError("Для работы SOS необходимо разрешить доступ к геолокации");
      return undefined;
    }

    const socket = new WebSocket(wsUrl());
    socketRef.current = socket;
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "join", role: "sender", sessionId }));
    });
    socket.addEventListener("error", () => setError("Не удалось подключиться к трансляции"));

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextLat = position.coords.latitude;
        const nextLng = position.coords.longitude;
        setLat(nextLat);
        setLng(nextLng);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "location", lat: nextLat, lng: nextLng }));
        }
      },
      () => setError("Для работы SOS необходимо разрешить доступ к геолокации"),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 },
    );

    const interval = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const nextLat = position.coords.latitude;
        const nextLng = position.coords.longitude;
        setLat(nextLat);
        setLng(nextLng);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "location", lat: nextLat, lng: nextLng }));
        }
      });
    }, 3000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.clearInterval(interval);
      socket.close();
    };
  }, [sessionId]);

  const resolve = async () => {
    setError("");
    try {
      await api("/api/sos/resolve", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "resolved", sessionId }));
      }
      localStorage.removeItem("active_sos_session");
      localStorage.removeItem("active_sos_position");
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось завершить SOS");
    }
  };

  return (
    <Layout user={user} active="sos" logout={logout}>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-red-700">Идёт передача местоположения</h1>
          <p className="mt-2 text-slate-600">Оставайтесь на этой странице до завершения SOS.</p>
        </div>
        <LeafletMap lat={lat} lng={lng} label="Ваше местоположение" />
        <p className="mt-4 text-sm text-slate-600">
          Координаты: {lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "ожидаем геолокацию"}
        </p>
        {error && <p className="mt-4 rounded-md bg-red-50 p-4 text-red-700">{error}</p>}
        <Button className="mt-8 w-full bg-emerald-600 py-6 text-lg hover:bg-emerald-700" onClick={resolve}>
          Я в безопасности — остановить
        </Button>
      </main>
    </Layout>
  );
}
