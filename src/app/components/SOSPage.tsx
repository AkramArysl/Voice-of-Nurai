import { useEffect, useRef, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { api, ApiError, User } from "../lib/api";

type SOSPageProps = {
  user: User | null;
  navigate: (path: string) => void;
  logout: () => void;
};

type Position = {
  lat: number;
  lng: number;
};

function getPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Для работы SOS необходимо разрешить доступ к геолокации"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => reject(new Error("Для работы SOS необходимо разрешить доступ к геолокации")),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

export default function SOSPage({ user, navigate, logout }: SOSPageProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown === 0) {
      triggerSOS();
      return undefined;
    }

    timerRef.current = window.setTimeout(() => setCountdown((value) => (value === null ? null : value - 1)), 1000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [countdown]);

  const startCountdown = () => {
    setError("");
    setCountdown(3);
  };

  const cancelCountdown = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setCountdown(null);
  };

  const triggerSOS = async () => {
    setCountdown(null);
    setLoading(true);
    setError("");
    try {
      const position = await getPosition();
      const data = await api<{ sessionId: string }>("/api/sos/trigger", {
        method: "POST",
        body: JSON.stringify(position),
      });
      localStorage.setItem("active_sos_session", data.sessionId);
      localStorage.setItem("active_sos_position", JSON.stringify(position));
      navigate("/sos/active");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Не удалось отправить SOS";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} active="sos" logout={logout}>
      <main className="mx-auto flex min-h-[calc(100vh-82px)] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-slate-950">Экстренный SOS</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          После подтверждения доверенным лицам будет отправлена ссылка на отслеживание вашего местоположения.
        </p>

        <button
          type="button"
          onClick={startCountdown}
          disabled={loading || countdown !== null}
          className="mt-10 flex h-64 w-64 flex-col items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-200 transition hover:bg-red-700 active:scale-95 disabled:opacity-70"
        >
          <AlertCircle className="mb-4 h-20 w-20" />
          <span className="text-5xl font-bold">SOS</span>
        </button>

        {countdown !== null && (
          <Card className="mt-8 w-full bg-white p-5 shadow-sm">
            <p className="text-xl font-semibold text-red-700">Отправка через {countdown}...</p>
            <Button className="mt-4" variant="outline" onClick={cancelCountdown}>
              <X className="mr-2 h-4 w-4" />
              Отменить
            </Button>
          </Card>
        )}

        {loading && <p className="mt-6 text-slate-600">Отправляем SOS...</p>}
        {error && <p className="mt-6 rounded-md bg-red-50 p-4 text-red-700">{error}</p>}
      </main>
    </Layout>
  );
}
