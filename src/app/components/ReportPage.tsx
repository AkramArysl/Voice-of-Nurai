import { useEffect, useState } from "react";
import { Camera, FileQuestion, MapPinned, ShieldAlert, UserX } from "lucide-react";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { api, ApiError, User } from "../lib/api";

type ReportPageProps = {
  user: User | null;
  navigate: (path: string) => void;
  logout: () => void;
};

const categories = [
  { value: "harassment", label: "Домогательство", icon: UserX },
  { value: "suspicious_person", label: "Подозрительный человек", icon: ShieldAlert },
  { value: "dangerous_area", label: "Опасная зона", icon: MapPinned },
  { value: "other", label: "Другое", icon: FileQuestion },
];

export default function ReportPage({ user, navigate, logout }: ReportPageProps) {
  const [category, setCategory] = useState("harassment");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (category === "other" && !description.trim()) {
      setError("Для категории «Другое» нужно добавить описание");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append("category", category);
      body.append("description", description);
      body.append("location", location);
      if (photo) body.append("photo", photo);
      await api("/api/reports", { method: "POST", body });
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось создать репорт");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} active="report" logout={logout}>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-950">Сообщить о проблеме</h1>
        <p className="mt-2 text-slate-600">Репорт будет опубликован анонимно.</p>

        <Card className="mt-8 bg-white p-6 shadow-sm">
          <form className="space-y-6" onSubmit={submit}>
            <div>
              <Label>Категория</Label>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {categories.map((item) => {
                  const Icon = item.icon;
                  const selected = category === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCategory(item.value)}
                      className={`flex min-h-20 items-center gap-3 rounded-md border p-4 text-left font-medium ${
                        selected ? "border-rose-600 bg-rose-50 text-rose-800" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                className="mt-2 min-h-32"
                placeholder="Опишите, что произошло..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="photo">Фото</Label>
              <label className="mt-2 flex min-h-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-slate-600 hover:bg-slate-100">
                <Camera className="mr-2 h-5 w-5" />
                {photo ? photo.name : "Выбрать изображение"}
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div>
              <Label htmlFor="location">Локация</Label>
              <Input
                id="location"
                className="mt-2"
                placeholder="ул. Чуй 45, Бишкек"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Отправка..." : "Отправить"}
            </Button>
          </form>
        </Card>
      </main>
    </Layout>
  );
}
