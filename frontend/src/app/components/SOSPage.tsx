import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { apiRequest, requestGeolocation, type User } from "../api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SOSPageProps {
  user: User | null;
  onStarted: (sessionId: string) => void;
}

export default function SOSPage({ user, onStarted }: SOSPageProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (countdown === null) {
      return undefined;
    }

    if (countdown === 0) {
      void triggerSos();
      return undefined;
    }

    const timer = window.setTimeout(() => setCountdown((value) => (value === null ? null : value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const startCountdown = () => {
    setError("");
    setCountdown(3);
  };

  const triggerSos = async () => {
    if (!user || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const position = await requestGeolocation();
      const data = await apiRequest<{ message: string; sessionId: string }>("/api/sos/trigger", {
        method: "POST",
        body: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      });

      sessionStorage.setItem("activeSosSessionId", data.sessionId);
      onStarted(data.sessionId);
    } catch (sosError: unknown) {
      setCountdown(null);
      const message = sosError instanceof Error ? sosError.message : "";
      setError(message.includes("Geolocation") ? "Для работы SOS необходимо разрешить доступ к геолокации" : message || "Не удалось отправить SOS");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950 md:text-5xl">Экстренный SOS</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          После подтверждения ваши доверенные лица получат ссылку на live-отслеживание местоположения.
        </p>
      </div>

      <button
        type="button"
        onClick={startCountdown}
        disabled={countdown !== null || submitting}
        className="flex h-64 w-64 flex-col items-center justify-center rounded-full bg-rose-600 text-white shadow-2xl shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400"
      >
        <AlertCircle className="mb-4 h-20 w-20" />
        <span className="text-5xl font-bold">SOS</span>
      </button>

      {countdown !== null && (
        <Card className="mt-8 w-full max-w-md p-5">
          <p className="text-xl font-semibold text-slate-950">{countdown > 0 ? `Отправка через ${countdown}...` : "Отправляем SOS..."}</p>
          {countdown > 0 && (
            <Button variant="outline" className="mt-4 gap-2" onClick={() => setCountdown(null)}>
              <X className="h-4 w-4" />
              Отменить
            </Button>
          )}
        </Card>
      )}

      {error && <p className="mt-6 rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>}
    </section>
  );
}
