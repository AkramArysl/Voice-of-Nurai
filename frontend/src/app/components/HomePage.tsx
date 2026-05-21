import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, Bot, FileText, Phone, Users, Plus } from "lucide-react";
import Logo from "./Logo";
import { useState } from "react";

interface HomePageProps {
  user: { username: string } | null;
}

export default function HomePage({ user }: HomePageProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleTrustedPersonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && email) {
      alert(`Доверенное лицо добавлено: ${firstName} ${lastName} (${email})`);
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Logo className="h-14 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-purple-900 font-medium">
              ГЛАВНАЯ
            </a>
            <a href="/sos" className="text-gray-600 hover:text-purple-600">
              SOS
            </a>
            <a href="/ai" className="text-gray-600 hover:text-purple-600">
              AI
            </a>
            <a href="/report" className="text-gray-600 hover:text-purple-600">
              СООБЩИТЬ
            </a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Добро пожаловать,</span>
                <span className="font-semibold text-purple-600">{user.username}</span>
              </div>
            ) : (
              <a href="/login">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Войти
                </Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            VOICE OF NURAI
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Платформа безопасности, которая помогает быстро отправить сигнал тревоги, делиться геолокацией и получать помощь в нужный момент.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SOS */}
          <a href="/sos">
            <Card className="p-8 bg-gradient-to-br from-red-500 to-red-600 border-0 hover:shadow-2xl transition-all cursor-pointer group">
              <div className="flex flex-col items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">SOS</h3>
                <p className="text-white/90 text-center">Экстренный сигнал помощи</p>
              </div>
            </Card>
          </a>

          {/* AI */}
          <a href="/ai">
            <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 border-0 hover:shadow-2xl transition-all cursor-pointer group">
              <div className="flex flex-col items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">AI</h3>
                <p className="text-white/90 text-center">Помощник безопасности</p>
              </div>
            </Card>
          </a>

          {/* Сообщить */}
          <a href="/report">
            <Card className="p-8 bg-gradient-to-br from-blue-500 to-blue-600 border-0 hover:shadow-2xl transition-all cursor-pointer group">
              <div className="flex flex-col items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Сообщить</h3>
                <p className="text-white/90 text-center">Отправить жалобу</p>
              </div>
            </Card>
          </a>
        </div>
      </section>

      {/* About / Mission */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-900">О проекте</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
            Мы помогаем девушкам оставаться в безопасности с помощью SOS-сигналов, отслеживания и поддержки в реальном времени.
          </p>
        </div>
      </section>

      {/* Доверенные лица */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-900">Доверенные лица</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Добавьте близких людей, которые получат уведомление в случае опасности
          </p>
        </div>

        {/* Форма добавления доверенного лица */}
        <Card className="p-8 bg-white shadow-xl max-w-2xl mx-auto mb-8">
          <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Добавить доверенное лицо
          </h3>
          <form className="space-y-4" onSubmit={handleTrustedPersonSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name" className="text-gray-700">Имя</Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="Введите имя"
                  className="mt-2 h-12 rounded-xl"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last-name" className="text-gray-700">Фамилия</Label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Введите фамилию"
                  className="mt-2 h-12 rounded-xl"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                className="mt-2 h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить доверенное лицо
            </Button>
          </form>
        </Card>

        {/* Список доверенных лиц */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900">Контакт {i}</h4>
                  <p className="text-sm text-gray-500">Не добавлен</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Возьмите безопасность под контроль уже сегодня
          </h2>
          <a href="/login">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg">
              Создать аккаунт
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <Logo className="h-16 w-auto" />
              </div>
              <p className="text-purple-200">Платформа безопасности для защиты и поддержки</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <div className="flex items-center gap-2 text-purple-200">
                <Phone className="w-4 h-4" />
                <span>Экстренный номер: 112</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Социальные сети</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  T
                </a>
                <a href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  I
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-300">
            <p>&copy; 2024 Voice of Nurai. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}