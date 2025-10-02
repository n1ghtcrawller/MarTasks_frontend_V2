'use client';

import "./globals.css";
import { AppProvider } from './contexts/AppContext';
import { useEffect } from 'react';
import { initTelegramWebApp } from './utils/telegramWebApp';

export const metadata = {
  title: "MarTasks - Трекер задач",
  description: "Ваш персональный трекер задач для организации работы и достижения целей",
};

// Компонент для инициализации Telegram Web App
function TelegramWebAppInit() {
  useEffect(() => {
    // Инициализируем Telegram Web App с помощью утилиты
    initTelegramWebApp()
      .then((success) => {
        if (success) {
          console.log('🚀 Telegram Web App successfully initialized');
        } else {
          console.log('⚠️ Telegram Web App not available or failed to initialize');
        }
      })
      .catch((error) => {
        console.error('❌ Error initializing Telegram Web App:', error);
      });
  }, []);

  return null;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className="font-sans antialiased mt-20">
        <TelegramWebAppInit />
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
