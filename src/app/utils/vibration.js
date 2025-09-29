/**
 * Утилита для вибрации в Telegram Web App
 * Поддерживает различные типы вибрации для разных действий
 * Учитывает ограничения iOS и использует Telegram Web App API
 */

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
 * @param {number[]} pattern - Паттерн вибрации в миллисекундах
 * @param {boolean} force - Принудительно выполнить вибрацию
 */
export const vibrate = (pattern = VIBRATION_PATTERNS.BUTTON_TAP, force = false) => {
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
 */
export const withVibration = (onClick, pattern = VIBRATION_PATTERNS.BUTTON_TAP) => {
  return (event) => {
    vibrate(pattern);
    if (onClick) {
      onClick(event);
    }
  };
};

/**
 * Вибрация для успешных действий
 */
export const vibrateSuccess = () => {
  vibrate(VIBRATION_PATTERNS.SUCCESS);
};

/**
 * Вибрация для ошибок
 */
export const vibrateError = () => {
  vibrate(VIBRATION_PATTERNS.ERROR);
};

/**
 * Вибрация для переключения состояний
 */
export const vibrateToggle = () => {
  vibrate(VIBRATION_PATTERNS.TOGGLE);
};

/**
 * Вибрация для навигации
 */
export const vibrateNavigation = () => {
  vibrate(VIBRATION_PATTERNS.NAVIGATION);
};

/**
 * Вибрация для подтверждения
 */
export const vibrateConfirm = () => {
  vibrate(VIBRATION_PATTERNS.CONFIRM);
};

/**
 * Легкая вибрация (для iOS, если поддерживается)
 */
export const vibrateLight = () => {
  vibrate(VIBRATION_PATTERNS.LIGHT);
};

/**
 * Средняя вибрация
 */
export const vibrateMedium = () => {
  vibrate(VIBRATION_PATTERNS.MEDIUM);
};

/**
 * Тяжелая вибрация
 */
export const vibrateHeavy = () => {
  vibrate(VIBRATION_PATTERNS.HEAVY);
};

/**
 * Проверяет, поддерживается ли вибрация на текущем устройстве
 */
export const checkVibrationSupport = () => {
  const support = {
    standardAPI: 'vibrate' in navigator,
    telegramWebApp: typeof window !== 'undefined' && !!window.Telegram?.WebApp,
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
