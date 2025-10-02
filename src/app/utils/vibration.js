/**
 * Утилита для вибрации в Telegram Web App
 * Поддерживает различные типы вибрации для разных действий
 * Учитывает ограничения iOS и использует Telegram Web App API
 * Интегрируется с HapticFeedback для улучшенной тактильной обратной связи
 */

import { 
  impactOccurred, 
  notificationOccurred, 
  selectionChanged, 
  getSupportInfo as getHapticSupportInfo 
} from './hapticFeedback.js';

// Проверяем доступность вибрации
const isVibrationSupported = () => {
  if (typeof window === 'undefined') return false;
  
  // Проверяем поддержку стандартного API вибрации
  const hasVibrateAPI = 'vibrate' in navigator;
  
  // Проверяем, находимся ли мы в Telegram Web App
  const isTelegramWebApp = window.Telegram?.WebApp;
  
  // На iOS в Safari navigator.vibrate не работает, но может работать в Telegram Web App
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  return hasVibrateAPI || (isTelegramWebApp && !isIOS);
};

// Типы вибрации для разных действий
export const VIBRATION_PATTERNS = {
  // Короткая вибрация для обычных кнопок
  BUTTON_TAP: [50],
  
  // Двойная вибрация для важных действий
  SUCCESS: [100, 50, 100],
  
  // Длинная вибрация для ошибок
  ERROR: [200],
  
  // Вибрация для переключения состояний
  TOGGLE: [30, 30, 30],
  
  // Вибрация для навигации
  NAVIGATION: [80],
  
  // Вибрация для подтверждения
  CONFIRM: [150, 50, 150],
  
  // Легкая вибрация для iOS (если поддерживается)
  LIGHT: [25],
  
  // Средняя вибрация
  MEDIUM: [50],
  
  // Тяжелая вибрация
  HEAVY: [100]
};

/**
 * Выполняет вибрацию с указанным паттерном
 * Автоматически использует HapticFeedback если доступен, иначе стандартную вибрацию
 * @param {number[]} pattern - Паттерн вибрации в миллисекундах
 * @param {boolean} force - Принудительно выполнить вибрацию
 * @param {string} hapticType - Тип HapticFeedback ('light', 'medium', 'heavy', 'success', 'error', 'warning', 'selection')
 */
export const vibrate = (pattern = VIBRATION_PATTERNS.BUTTON_TAP, force = false, hapticType = null) => {
  // Сначала пытаемся использовать HapticFeedback
  if (hapticType && typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
    try {
      switch (hapticType) {
        case 'light':
        case 'medium':
        case 'heavy':
        case 'rigid':
        case 'soft':
          impactOccurred(hapticType);
          return; // Успешно использовали HapticFeedback
        case 'success':
        case 'error':
        case 'warning':
          notificationOccurred(hapticType);
          return; // Успешно использовали HapticFeedback
        case 'selection':
          selectionChanged();
          return; // Успешно использовали HapticFeedback
      }
    } catch (error) {
      console.warn('HapticFeedback failed, falling back to vibration:', error);
    }
  }

  // Fallback к стандартной вибрации
  if (!isVibrationSupported() && !force) {
    console.log('Vibration not supported on this device');
    return;
  }

  // Проверяем настройки пользователя в Telegram Web App
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Не вибрируем на десктопе
    if (tg.platform === 'unknown' || tg.platform === 'desktop') {
      return;
    }
    
    // Проверяем, включены ли уведомления (может влиять на вибрацию)
    if (tg.isExpanded === false) {
      // Если приложение свернуто, вибрация может не работать
      return;
    }
  }

  try {
    // Пытаемся использовать стандартный API
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    } else {
      console.log('Vibration API not available');
    }
  } catch (error) {
    console.warn('Vibration failed:', error);
  }
};

/**
 * Вибрация для кнопок с анимацией
 * @param {Function} onClick - Оригинальная функция onClick
 * @param {number[]} pattern - Паттерн вибрации
 * @param {string} hapticType - Тип HapticFeedback
 */
export const withVibration = (onClick, pattern = VIBRATION_PATTERNS.BUTTON_TAP, hapticType = 'light') => {
  return (event) => {
    vibrate(pattern, false, hapticType);
    if (onClick) {
      onClick(event);
    }
  };
};

/**
 * Вибрация для успешных действий
 */
export const vibrateSuccess = () => {
  vibrate(VIBRATION_PATTERNS.SUCCESS, false, 'success');
};

/**
 * Вибрация для ошибок
 */
export const vibrateError = () => {
  vibrate(VIBRATION_PATTERNS.ERROR, false, 'error');
};

/**
 * Вибрация для переключения состояний
 */
export const vibrateToggle = () => {
  vibrate(VIBRATION_PATTERNS.TOGGLE, false, 'selection');
};

/**
 * Вибрация для навигации
 */
export const vibrateNavigation = () => {
  vibrate(VIBRATION_PATTERNS.NAVIGATION, false, 'medium');
};

/**
 * Вибрация для подтверждения
 */
export const vibrateConfirm = () => {
  vibrate(VIBRATION_PATTERNS.CONFIRM, false, 'heavy');
};

/**
 * Легкая вибрация (для iOS, если поддерживается)
 */
export const vibrateLight = () => {
  vibrate(VIBRATION_PATTERNS.LIGHT, false, 'light');
};

/**
 * Средняя вибрация
 */
export const vibrateMedium = () => {
  vibrate(VIBRATION_PATTERNS.MEDIUM, false, 'medium');
};

/**
 * Тяжелая вибрация
 */
export const vibrateHeavy = () => {
  vibrate(VIBRATION_PATTERNS.HEAVY, false, 'heavy');
};

/**
 * Проверяет, поддерживается ли вибрация на текущем устройстве
 */
export const checkVibrationSupport = () => {
  const hapticSupport = getHapticSupportInfo();
  const support = {
    standardAPI: 'vibrate' in navigator,
    telegramWebApp: typeof window !== 'undefined' && !!window.Telegram?.WebApp,
    hapticFeedback: hapticSupport,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
  
  console.log('Vibration support:', support);
  return support;
};

export default {
  vibrate,
  withVibration,
  vibrateSuccess,
  vibrateError,
  vibrateToggle,
  vibrateNavigation,
  vibrateConfirm,
  vibrateLight,
  vibrateMedium,
  vibrateHeavy,
  VIBRATION_PATTERNS,
  isVibrationSupported,
  checkVibrationSupport
};
