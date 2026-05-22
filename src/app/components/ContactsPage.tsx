import { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api, ApiError, Contact, User } from "../lib/api";

type ContactsPageProps = {
  user: User | null;
  navigate: (path: string) => void;
  logout: () => void;
};

export default function ContactsPage({ user, navigate, logout }: ContactsPageProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadContacts = () => {
    setLoading(true);
    api<{ contacts: Contact[] }>("/api/contacts")
      .then((data) => setContacts(data.contacts))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Не удалось загрузить контакты"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadContacts();
  }, [user, navigate]);

  const addContact = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const data = await api<{ contact: Contact }>("/api/contacts", {
        method: "POST",
        body: JSON.stringify({ name, surname, email }),
      });
      setContacts((current) => [data.contact, ...current]);
      setName("");
      setSurname("");
      setEmail("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось добавить контакт");
    }
  };

  const deleteContact = async (id: number) => {
    setError("");
    try {
      await api(`/api/contacts/${id}`, { method: "DELETE" });
      setContacts((current) => current.filter((contact) => contact.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось удалить контакт");
    }
  };

  return (
    <Layout user={user} active="contacts" logout={logout}>
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-950">Доверенные лица</h1>
        <p className="mt-2 text-slate-600">Эти люди получат email при SOS. Telegram отправляется подключённым контактам.</p>

        <Card className="mt-8 bg-white p-6 shadow-sm">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1.3fr_auto]" onSubmit={addContact}>
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="surname">Фамилия</Label>
              <Input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button className="self-end" type="submit">
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </form>
          {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </Card>

        <div className="mt-8 space-y-3">
          {loading && <p className="text-slate-600">Загружаем контакты...</p>}
          {!loading && contacts.length === 0 && <p className="rounded-md bg-white p-6 text-slate-600 shadow-sm">Контакты ещё не добавлены.</p>}
          {contacts.map((contact) => (
            <Card key={contact.id} className="flex flex-col gap-4 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">
                  {contact.name} {contact.surname}
                </h2>
                <p className="text-sm text-slate-600">{contact.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-md px-3 py-1 text-sm font-medium ${contact.invite_status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {contact.invite_status === "accepted" ? "Подключён к Telegram" : "Ожидает"}
                </span>
                <Button variant="outline" size="sm" onClick={() => deleteContact(contact.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
