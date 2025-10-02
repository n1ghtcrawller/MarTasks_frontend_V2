'use client';

import { useEffect } from 'react';
import { AppProvider } from '../contexts/AppContext';
import { initTelegramWebApp } from '../utils/telegramWebApp';

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

export default function ClientProviders({ children }) {
  return (
    <>
      <TelegramWebAppInit />
      <AppProvider>
        {children}
      </AppProvider>
    </>
  );
}
