import { useState } from "react";
import type { ComponentType } from "react";
import { AlertTriangle, FileQuestion, MapPinned, Send, UserX } from "lucide-react";
import { apiRequest, type ReportCategory } from "../api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ReportPageProps {
  onCreated: () => void;
}

const categories: Array<{ value: ReportCategory; label: string; icon: ComponentType<{ className?: string }> }> = [
  { value: "harassment", label: "Домогательство", icon: UserX },
  { value: "suspicious_person", label: "Подозрительный человек", icon: AlertTriangle },
  { value: "dangerous_area", label: "Опасная зона", icon: MapPinned },
  { value: "other", label: "Другое", icon: FileQuestion },
];

export default function ReportPage({ onCreated }: ReportPageProps) {
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!category) {
      setError("Выберите категорию");
      return;
    }

    if (category === "other" && !description.trim()) {
      setError("Для категории «Другое» нужно заполнить описание");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("location", location);
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      if (photo) {
        formData.append("photo", photo);
      }

      await apiRequest<{ message: string }>("/api/reports", {
        method: "POST",
        body: formData,
      });
      onCreated();
    } catch (reportError: unknown) {
      setError(reportError instanceof Error ? reportError.message : "Не удалось создать репорт");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950">Создать репорт</h1>
        <p className="mt-3 text-slate-600">Опишите проблему. Имя автора не будет отображаться в списке репортов.</p>
      </div>

      <Card className="p-6">
        <form className="space-y-6" onSubmit={submitReport}>
          <div>
            <Label>Категория</Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.value}
                    type="button"
                    variant={category === item.value ? "default" : "outline"}
                    className="h-20 justify-start gap-3"
                    onClick={() => setCategory(item.value)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={category === "other" ? "Описание обязательно для категории «Другое»" : "Описание можно оставить пустым"}
              className="mt-2 min-h-32"
            />
          </div>

          <div>
            <Label htmlFor="location">Локация</Label>
            <Input
              id="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="ул. Чуй 45, Бишкек"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="photo">Фото</Label>
            <Input id="photo" type="file" accept="image/*" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} className="mt-2" />
          </div>

          {error && <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-700">{error}</p>}

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <Send className="h-4 w-4" />
            {loading ? "Отправка..." : "Отправить репорт"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
