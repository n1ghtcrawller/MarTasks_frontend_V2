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
        
        // Ждем, пока initData станет доступным
        if (tg.initData || tg.initDataUnsafe) {
          console.log('Telegram WebApp ready with data:', {
            initData: tg.initData,
            initDataUnsafe: tg.initDataUnsafe
          });
          setTelegramReady(true);
          return true;
        } else {
          console.log('Telegram WebApp loaded but no initData yet');
          return false;
        }
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

    // Очищаем интервал через 10 секунд (увеличили время ожидания)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log('Telegram WebApp timeout - proceeding anyway');
      setTelegramReady(true); // Устанавливаем ready даже без данных
    }, 10000);

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

      // Детальная отладка Telegram WebApp
      console.log('=== Telegram Debug Info ===');
      console.log('window.Telegram:', window.Telegram);
      console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
      
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        console.log('WebApp object:', tg);
        console.log('initData:', tg.initData);
        console.log('initDataUnsafe:', tg.initDataUnsafe);
        console.log('version:', tg.version);
        console.log('platform:', tg.platform);
        console.log('colorScheme:', tg.colorScheme);
        console.log('themeParams:', tg.themeParams);
        console.log('isExpanded:', tg.isExpanded);
        console.log('viewportHeight:', tg.viewportHeight);
        console.log('viewportStableHeight:', tg.viewportStableHeight);
        console.log('headerColor:', tg.headerColor);
        console.log('backgroundColor:', tg.backgroundColor);
        console.log('isClosingConfirmationEnabled:', tg.isClosingConfirmationEnabled);
        console.log('isVerticalSwipesEnabled:', tg.isVerticalSwipesEnabled);
        console.log('isHorizontalSwipesEnabled:', tg.isHorizontalSwipesEnabled);
        console.log('user:', tg.initDataUnsafe?.user);
        console.log('chat:', tg.initDataUnsafe?.chat);
        console.log('auth_date:', tg.initDataUnsafe?.auth_date);
        console.log('hash:', tg.initDataUnsafe?.hash);
      }

      // Получаем initData разными способами
      let initData = '';
      
      // Способ 1: Из Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        initData = window.Telegram.WebApp.initData || '';
        
        // Если initData пустой, попробуем получить из initDataUnsafe
        if (!initData && window.Telegram.WebApp.initDataUnsafe) {
          const unsafe = window.Telegram.WebApp.initDataUnsafe;
          console.log('Trying to reconstruct initData from initDataUnsafe');
          
          // Попробуем реконструировать initData
          const params = new URLSearchParams();
          if (unsafe.user) params.append('user', JSON.stringify(unsafe.user));
          if (unsafe.chat) params.append('chat', JSON.stringify(unsafe.chat));
          if (unsafe.auth_date) params.append('auth_date', unsafe.auth_date);
          if (unsafe.hash) params.append('hash', unsafe.hash);
          
          initData = params.toString();
          console.log('Reconstructed initData:', initData);
        }
      }
      
      // Способ 2: Из URL параметров (если Telegram передает данные через URL)
      if (!initData && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlInitData = urlParams.get('tgWebAppData') || urlParams.get('initData');
        if (urlInitData) {
          initData = urlInitData;
          console.log('Found initData in URL:', initData);
        }
      }
      
      // Способ 3: Из hash параметров
      if (!initData && typeof window !== 'undefined' && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashInitData = hashParams.get('tgWebAppData') || hashParams.get('initData');
        if (hashInitData) {
          initData = hashInitData;
          console.log('Found initData in hash:', initData);
        }
      }

      console.log('Final initData to send:', initData);

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
