import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Bot, FileText, MapPin, Users } from "lucide-react";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { api, BOT_USERNAME, formatDate, Report, User } from "../lib/api";

type HomePageProps = {
  user: User | null;
  navigate: (path: string) => void;
  logout: () => void;
};

const categoryLabels: Record<Report["category"], string> = {
  harassment: "Домогательство",
  suspicious_person: "Подозрительный человек",
  dangerous_area: "Опасная зона",
  other: "Другое",
};

export default function HomePage({ user, navigate, logout }: HomePageProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ reports: Report[] }>("/api/reports")
      .then((data) => setReports(data.reports))
      .catch(() => setError("Не удалось загрузить репорты"))
      .finally(() => setLoading(false));
  }, []);

  const requireAuth = (path: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <Layout user={user} active="home" logout={logout}>
      <main>
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-14 md:pb-12 md:pt-20">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm md:px-10 md:py-20">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-5xl font-black uppercase leading-none tracking-normal text-transparent sm:text-7xl md:text-8xl lg:text-9xl">
              NURAI VOICE
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Помогает быстро сообщить о риске и позвать на помощь
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-4">
            <Button className="h-20 justify-between rounded-xl bg-red-600 px-5 text-base hover:bg-red-700" onClick={() => requireAuth("/sos")}>
              <span className="flex items-center">
                <AlertCircle className="mr-3 h-5 w-5" />
                SOS
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noopener noreferrer">
              <Button className="h-20 w-full justify-between rounded-xl bg-sky-600 px-5 text-base hover:bg-sky-700">
                <span className="flex items-center">
                  <Bot className="mr-3 h-5 w-5" />
                  AI Помощник
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Button className="h-20 justify-between rounded-xl bg-emerald-600 px-5 text-base hover:bg-emerald-700" onClick={() => requireAuth("/contacts")}>
              <span className="flex items-center">
                <Users className="mr-3 h-5 w-5" />
                Доверенные лица
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="h-20 justify-between rounded-xl bg-violet-600 px-5 text-base hover:bg-violet-700" onClick={() => requireAuth("/report/new")}>
              <span className="flex items-center">
                <FileText className="mr-3 h-5 w-5" />
                Сообщить
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-950">Последние репорты</h2>
              <p className="mt-2 text-slate-600">Репорты видны всем, авторы остаются анонимными.</p>
            </div>
          </div>

          {loading && <p className="text-slate-600">Загружаем репорты...</p>}
          {error && <p className="rounded-md bg-red-50 p-4 text-red-700">{error}</p>}
          {!loading && !error && reports.length === 0 && (
            <p className="rounded-md bg-white p-6 text-slate-600 shadow-sm">Пока нет репортов.</p>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden bg-white p-0 shadow-sm">
                {report.photo_url && (
                  <img src={report.photo_url} alt="Фото репорта" className="h-48 w-full object-cover" />
                )}
                <div className="p-5">
                  <div className="mb-3 inline-flex rounded-md bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
                    {categoryLabels[report.category]}
                  </div>
                  {report.description && <p className="mb-4 leading-7 text-slate-700">{report.description}</p>}
                  <div className="mb-3 flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{report.location}</span>
                  </div>
                  <p className="text-sm text-slate-500">{formatDate(report.created_at)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
