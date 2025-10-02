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
import { 
  impactOccurred, 
  notificationOccurred, 
  selectionChanged,
  hapticLight,
  hapticMedium,
  hapticHeavy,
  hapticRigid,
  hapticSoft,
  hapticSuccess,
  hapticError,
  hapticWarning,
  getSupportInfo
} from '../utils/hapticFeedback';
import { 
  getTelegramSupportInfo,
  expandTelegramWebApp,
  requestFullscreen,
  enableClosingConfirmation,
  disableClosingConfirmation,
  setThemeColors
} from '../utils/telegramWebApp';

export default function VibrationTest() {
  const [supportInfo, setSupportInfo] = useState(null);

  const handleCheckSupport = () => {
    const vibrationInfo = checkVibrationSupport();
    const hapticInfo = getSupportInfo();
    const telegramInfo = getTelegramSupportInfo();
    setSupportInfo({ 
      vibration: vibrationInfo, 
      haptic: hapticInfo,
      telegram: telegramInfo
    });
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

  const hapticTests = [
    { name: 'Haptic Light', action: hapticLight, color: 'bg-cyan-400' },
    { name: 'Haptic Medium', action: hapticMedium, color: 'bg-cyan-600' },
    { name: 'Haptic Heavy', action: hapticHeavy, color: 'bg-cyan-800' },
    { name: 'Haptic Rigid', action: hapticRigid, color: 'bg-teal-500' },
    { name: 'Haptic Soft', action: hapticSoft, color: 'bg-teal-300' },
    { name: 'Haptic Success', action: hapticSuccess, color: 'bg-emerald-500' },
    { name: 'Haptic Error', action: hapticError, color: 'bg-rose-500' },
    { name: 'Haptic Warning', action: hapticWarning, color: 'bg-amber-500' },
    { name: 'Selection Changed', action: selectionChanged, color: 'bg-violet-500' }
  ];

  const telegramTests = [
    { name: 'Expand App', action: expandTelegramWebApp, color: 'bg-indigo-500' },
    { name: 'Request Fullscreen', action: requestFullscreen, color: 'bg-indigo-600' },
    { name: 'Enable Closing Confirmation', action: enableClosingConfirmation, color: 'bg-purple-500' },
    { name: 'Disable Closing Confirmation', action: disableClosingConfirmation, color: 'bg-purple-600' },
    { name: 'Set Blue Theme', action: () => setThemeColors('#7370fd', '#ffffff'), color: 'bg-blue-600' },
    { name: 'Set Green Theme', action: () => setThemeColors('#10b981', '#f0fdf4'), color: 'bg-green-600' }
  ];

  return (
    <div className="p-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Тест вибрации и HapticFeedback</h2>
        
        {/* Информация о поддержке */}
        <div className="mb-6">
          <button
            onClick={handleCheckSupport}
            className="bg-[#7370fd] text-white px-4 py-2 rounded-lg hover:bg-[#7370fd]/90 transition-colors mb-3"
          >
            Проверить поддержку
          </button>
          
          {supportInfo && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 text-sm">
                <h3 className="font-semibold mb-2">Поддержка вибрации:</h3>
                <ul className="space-y-1">
                  <li>Стандартный API: {supportInfo.vibration.standardAPI ? '✅' : '❌'}</li>
                  <li>Telegram Web App: {supportInfo.vibration.telegramWebApp ? '✅' : '❌'}</li>
                  <li>iOS: {supportInfo.vibration.isIOS ? '✅' : '❌'}</li>
                  <li>Android: {supportInfo.vibration.isAndroid ? '✅' : '❌'}</li>
                  <li>Мобильное устройство: {supportInfo.vibration.isMobile ? '✅' : '❌'}</li>
                </ul>
              </div>
              
              <div className="bg-blue-100 rounded-lg p-4 text-sm">
                <h3 className="font-semibold mb-2">Поддержка HapticFeedback:</h3>
                <ul className="space-y-1">
                  <li>Поддерживается: {supportInfo.haptic.isSupported ? '✅' : '❌'}</li>
                  <li>WebApp доступен: {supportInfo.haptic.hasWebApp ? '✅' : '❌'}</li>
                  <li>HapticFeedback API: {supportInfo.haptic.hasHapticFeedback ? '✅' : '❌'}</li>
                  <li>Платформа: {supportInfo.haptic.platform}</li>
                  <li>Версия: {supportInfo.haptic.version}</li>
                </ul>
              </div>
              
              <div className="bg-indigo-100 rounded-lg p-4 text-sm">
                <h3 className="font-semibold mb-2">Telegram Web App:</h3>
                <ul className="space-y-1">
                  <li>Доступен: {supportInfo.telegram.isAvailable ? '✅' : '❌'}</li>
                  <li>Инициализирован: {supportInfo.telegram.isInitialized ? '✅' : '❌'}</li>
                  <li>Платформа: {supportInfo.telegram.platform || 'N/A'}</li>
                  <li>Версия: {supportInfo.telegram.version || 'N/A'}</li>
                  {supportInfo.telegram.features && (
                    <>
                      <li>Expand: {supportInfo.telegram.features.expand ? '✅' : '❌'}</li>
                      <li>Fullscreen: {supportInfo.telegram.features.requestFullscreen ? '✅' : '❌'}</li>
                      <li>Closing Confirmation: {supportInfo.telegram.features.enableClosingConfirmation ? '✅' : '❌'}</li>
                    </>
                  )}
                  {supportInfo.telegram.state && (
                    <>
                      <li>Expanded: {supportInfo.telegram.state.isExpanded ? '✅' : '❌'}</li>
                      <li>Viewport Height: {supportInfo.telegram.state.viewportHeight || 'N/A'}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки тестирования вибрации */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Тест стандартной вибрации</h3>
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
        </div>

        {/* Кнопки тестирования HapticFeedback */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Тест HapticFeedback (Telegram Web App)</h3>
          <div className="grid grid-cols-2 gap-3">
            {hapticTests.map((test, index) => (
              <motion.button
                key={test.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (vibrationTests.length + index) * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={test.action}
                className={`${test.color} text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity`}
              >
                {test.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Кнопки тестирования Telegram Web App функций */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Тест Telegram Web App функций</h3>
          <div className="grid grid-cols-2 gap-3">
            {telegramTests.map((test, index) => (
              <motion.button
                key={test.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (vibrationTests.length + hapticTests.length + index) * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={test.action}
                className={`${test.color} text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm`}
              >
                {test.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Инструкции */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Инструкции:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Нажмите на кнопки выше, чтобы протестировать разные типы вибрации</li>
            <li>• <strong>Стандартная вибрация</strong> работает на мобильных устройствах с поддержкой Vibration API</li>
            <li>• <strong>HapticFeedback</strong> работает только в Telegram Web App на поддерживаемых устройствах</li>
            <li>• <strong>Telegram Web App функции</strong> позволяют управлять поведением приложения в Telegram</li>
            <li>• На iOS стандартная вибрация может не работать в Safari, но HapticFeedback работает в Telegram</li>
            <li>• HapticFeedback обеспечивает более точную и качественную тактильную обратную связь</li>
            <li>• Expand и Fullscreen автоматически применяются при запуске приложения</li>
            <li>• Убедитесь, что звук включен (вибрация может быть связана с настройками звука)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
