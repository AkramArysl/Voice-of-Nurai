import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertCircle, MapPin } from "lucide-react";
import Logo from "./Logo";
import { useState } from "react";

interface SOSPageProps {
  user: { username: string } | null;
}

export default function SOSPage({ user }: SOSPageProps) {
  const [sosActive, setSosActive] = useState(true);

  const handleSOSClick = () => {
    if (sosActive) {
      alert("SOS сигнал остановлен!");
      setSosActive(false);
    } else {
      alert("SOS сигнал активирован! Ваше местоположение отправлено доверенным лицам.");
      setSosActive(true);
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
            <a href="/sos" className="text-purple-900 font-medium">
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

      {/* Main Content - SOS ЭКРАН */}
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
            🚨 АВАРИЙНЫЙ РЕЖИМ
          </h1>
          <p className="text-gray-700 text-lg">
            {sosActive ? "Вы нажали кнопку для отправки экстренного сигнала" : "SOS сигнал остановлен"}
          </p>
        </div>

        {/* ОГРОМНАЯ КНОПКА SOS */}
        <div className="flex justify-center mb-12">
          <button 
            onClick={handleSOSClick}
            className={`relative w-72 h-72 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group ${
              sosActive 
                ? 'bg-gradient-to-br from-green-500 to-green-700 hover:shadow-green-500/50 animate-pulse' 
                : 'bg-gradient-to-br from-gray-400 to-gray-600 hover:shadow-gray-500/50'
            }`}
          >
            <div className="absolute inset-4 rounded-full border-4 border-white/30"></div>
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="w-24 h-24 text-white mb-4" />
              <span className="text-5xl font-bold text-white">SOS</span>
              <span className="text-white/90 text-lg mt-3">
                {sosActive ? "STOP SOS" : "ЗАПУСТИТЬ"}
              </span>
            </div>
          </button>
        </div>

        {/* Статус локации */}
        {sosActive && (
          <Card className="p-6 bg-green-50 border-green-200 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Статус локации</h3>
                  <p className="text-sm text-green-700 font-medium">Ваше местоположение передано</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-green-100 rounded-full">
                <span className="text-green-700 font-semibold">📍 ВКЛ</span>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}