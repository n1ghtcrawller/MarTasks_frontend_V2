'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  vibrate, 
  vibrateSuccess, 
  vibrateError, 
  vibrateToggle, 
  vibrateNavigation, 
  vibrateConfirm,
  vibrateLight,
  vibrateMedium,
  vibrateHeavy,
  checkVibrationSupport,
  VIBRATION_PATTERNS 
} from '../utils/vibration';

export default function VibrationTest() {
  const [supportInfo, setSupportInfo] = useState(null);

  const handleCheckSupport = () => {
    const info = checkVibrationSupport();
    setSupportInfo(info);
  };

  const vibrationTests = [
    { name: 'Обычная кнопка', action: () => vibrate(VIBRATION_PATTERNS.BUTTON_TAP), color: 'bg-blue-500' },
    { name: 'Успех', action: vibrateSuccess, color: 'bg-green-500' },
    { name: 'Ошибка', action: vibrateError, color: 'bg-red-500' },
    { name: 'Переключение', action: vibrateToggle, color: 'bg-yellow-500' },
    { name: 'Навигация', action: vibrateNavigation, color: 'bg-purple-500' },
    { name: 'Подтверждение', action: vibrateConfirm, color: 'bg-indigo-500' },
    { name: 'Легкая', action: vibrateLight, color: 'bg-gray-400' },
    { name: 'Средняя', action: vibrateMedium, color: 'bg-gray-600' },
    { name: 'Тяжелая', action: vibrateHeavy, color: 'bg-gray-800' }
  ];

  return (
    <div className="p-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Тест вибрации</h2>
        
        {/* Информация о поддержке */}
        <div className="mb-6">
          <button
            onClick={handleCheckSupport}
            className="bg-[#7370fd] text-white px-4 py-2 rounded-lg hover:bg-[#7370fd]/90 transition-colors mb-3"
          >
            Проверить поддержку вибрации
          </button>
          
          {supportInfo && (
            <div className="bg-gray-100 rounded-lg p-4 text-sm">
              <h3 className="font-semibold mb-2">Информация о поддержке:</h3>
              <ul className="space-y-1">
                <li>Стандартный API: {supportInfo.standardAPI ? '✅' : '❌'}</li>
                <li>Telegram Web App: {supportInfo.telegramWebApp ? '✅' : '❌'}</li>
                <li>iOS: {supportInfo.isIOS ? '✅' : '❌'}</li>
                <li>Android: {supportInfo.isAndroid ? '✅' : '❌'}</li>
                <li>Мобильное устройство: {supportInfo.isMobile ? '✅' : '❌'}</li>
              </ul>
            </div>
          )}
        </div>

        {/* Кнопки тестирования */}
        <div className="grid grid-cols-2 gap-3">
          {vibrationTests.map((test, index) => (
            <motion.button
              key={test.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={test.action}
              className={`${test.color} text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity`}
            >
              {test.name}
            </motion.button>
          ))}
        </div>

        {/* Инструкции */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Инструкции:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Нажмите на кнопки выше, чтобы протестировать разные типы вибрации</li>
            <li>• Вибрация работает только на мобильных устройствах</li>
            <li>• На iOS вибрация может не работать в Safari, но может работать в Telegram Web App</li>
            <li>• Убедитесь, что звук включен (вибрация может быть связана с настройками звука)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
