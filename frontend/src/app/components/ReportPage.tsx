import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Camera, MapPin, Phone, UserX, AlertTriangle, MapPinned, FileQuestion } from "lucide-react";
import Logo from "./Logo";
import { useState } from "react";

interface ReportPageProps {
  user: { username: string } | null;
}

export default function ReportPage({ user }: ReportPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && description) {
      alert(`Отчет отправлен!\nКатегория: ${selectedCategory}\nОписание: ${description}`);
      setSelectedCategory("");
      setDescription("");
    } else {
      alert("Пожалуйста, выберите категорию и добавьте описание");
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
            <a href="/" className="text-gray-600 hover:text-purple-600">
              ГЛАВНАЯ
            </a>
            <a href="/sos" className="text-gray-600 hover:text-purple-600">
              SOS
            </a>
            <a href="/ai" className="text-gray-600 hover:text-purple-600">
              AI
            </a>
            <a href="/report" className="text-purple-900 font-medium">
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

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-900 mb-3">Сообщить о проблеме</h1>
          <p className="text-gray-600">Опишите ситуацию, и мы поможем вам</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">

          {/* Категории */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Выберите категорию</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-2 hover:border-purple-600 hover:bg-purple-50 transition-all"
                onClick={() => setSelectedCategory("Домогательство")}
              >
                <UserX className="w-6 h-6 text-purple-600" />
                <span className="font-semibold">Домогательство</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-2 hover:border-purple-600 hover:bg-purple-50 transition-all"
                onClick={() => setSelectedCategory("Подозрительный человек")}
              >
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <span className="font-semibold">Подозрительный человек</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-2 hover:border-purple-600 hover:bg-purple-50 transition-all"
                onClick={() => setSelectedCategory("Опасная зона")}
              >
                <MapPinned className="w-6 h-6 text-red-600" />
                <span className="font-semibold">Опасная зона</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-2 hover:border-purple-600 hover:bg-purple-50 transition-all"
                onClick={() => setSelectedCategory("Другое")}
              >
                <FileQuestion className="w-6 h-6 text-blue-600" />
                <span className="font-semibold">Другое</span>
              </Button>
            </div>
          </div>

          {/* Описание */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Описание</h3>
            <Textarea
              placeholder="Опишите, что произошло..."
              className="min-h-32 resize-none text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Фото */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Фото (необязательно)</h3>
            <Button
              variant="outline"
              className="w-full h-24 border-2 border-dashed hover:border-purple-600 hover:bg-purple-50 transition-all"
            >
              <Camera className="w-6 h-6 mr-2 text-purple-600" />
              <span className="font-semibold">Добавить фото</span>
            </Button>
          </div>

          {/* Локация */}
          <div className="mb-8">
            <Card className="p-5 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Геолокация</h4>
                    <p className="text-sm text-gray-600">Ваше местоположение будет отправлено</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-green-100 rounded-full">
                  <span className="text-green-700 font-semibold">Включена</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Кнопка отправить */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg"
            onClick={handleSubmit}
          >
            Отправить
          </Button>

        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            ℹ️ Все сообщения обрабатываются конфиденциально. Ваши данные защищены.
          </p>
        </div>
      </div>

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