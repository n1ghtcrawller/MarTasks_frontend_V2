'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from './contexts/AppContext';
import CustomButton from './components/CustomButton';
import { authAPI } from './utils/api';
import { withVibration, VIBRATION_PATTERNS } from './utils/vibration';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useApp();
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [telegramReady, setTelegramReady] = useState(false);

  // Проверяем доступность Telegram WebApp
  useEffect(() => {
    const checkTelegram = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Запрашиваем полноэкранный режим
        try {
          tg.requestFullscreen();
        } catch (error) {
          console.warn('Failed to request fullscreen:', error);
        }
        
        setTelegramReady(true);
        return true;
      }
      return false;
    };

    // Проверяем сразу
    if (checkTelegram()) {
      return;
    }

    // Если не готов, ждем загрузки
    const interval = setInterval(() => {
      if (checkTelegram()) {
        clearInterval(interval);
      }
    }, 100);

    // Очищаем интервал через 5 секунд
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const isTelegramAvailable = telegramReady;

  const handleTelegramLogin = async () => {
    try {
      setAuthLoading(true);
      setError(null);

      // Получаем initData, если доступен
      let initData = '';
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        initData = window.Telegram.WebApp.initData || '';
      }

      console.log('Telegram initData:', initData); // Для отладки

      const response = await authAPI.telegramLogin(initData);
      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        window.location.reload(); // Перезагружаем для обновления состояния
      }
    } catch (error) {
      console.error('Telegram login failed:', error);
      setError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginWithVibration = withVibration(handleTelegramLogin, VIBRATION_PATTERNS.CONFIRM);

  useEffect(() => {
    // Если пользователь аутентифицирован, перенаправляем на проекты
    if (isAuthenticated && user) {
      router.push('/projects');
    }
  }, [isAuthenticated, user, router]);

  // Показываем загрузку
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Если пользователь аутентифицирован, не показываем главную страницу
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Заголовок */}
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-lg"
        >
          MarTasks
        </motion.h1>
        
        {/* Подзаголовок */}
        <motion.h2 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl text-white/90 mb-8 font-light"
        >
          Ваш персональный трекер задач
        </motion.h2>
        
        {/* Описание */}
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Организуйте свои задачи, отслеживайте прогресс и достигайте целей 
          с помощью нашего интуитивного инструмента управления задачами.
        </motion.p>
        
        {/* Кнопка авторизации */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-md mx-auto space-y-4"
        >
          {/* Ошибка */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Кнопка входа */}
          <CustomButton 
            onClick={handleLoginWithVibration}
            disabled={authLoading}
            vibrationPattern={VIBRATION_PATTERNS.CONFIRM}
            className={'bg-white text-[#7370fd] hover:bg-gray-50'}>
            {authLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-[#7370fd] border-t-transparent rounded-full animate-spin"></div>
                <span>Вход...</span>
              </div>
            ) : (
              'Начать работу'
            )}
          </CustomButton>
        </motion.div>
      </div>
    </div>
  );
}
