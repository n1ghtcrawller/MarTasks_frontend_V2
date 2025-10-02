/**
 * Утилита для работы с Telegram Web App
 * Централизованное управление функциями expand, requestFullscreen и другими возможностями
 */

/**
 * Класс для управления Telegram Web App
 */
class TelegramWebAppManager {
  constructor() {
    this.webApp = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Инициализация Telegram Web App
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }

      const checkAndInit = () => {
        const tg = window.Telegram?.WebApp;
        if (!tg) {
          console.log('Telegram Web App not available');
          resolve(false);
          return;
        }

        this.webApp = tg;
        this.setupWebApp();
        this.isInitialized = true;
        resolve(true);
      };

      // Проверяем сразу
      if (window.Telegram?.WebApp) {
        checkAndInit();
      } else {
        // Ждем загрузки
        const interval = setInterval(() => {
          if (window.Telegram?.WebApp) {
            checkAndInit();
            clearInterval(interval);
          }
        }, 100);

        // Таймаут через 5 секунд
        setTimeout(() => {
          clearInterval(interval);
          resolve(false);
        }, 5000);
      }
    });

    return this.initPromise;
  }

  /**
   * Настройка Telegram Web App
   */
  setupWebApp() {
    if (!this.webApp) return;

    console.log('Setting up Telegram Web App...');

    try {
      // Расширяем приложение на весь экран
      this.expand();
      
      // Запрашиваем полноэкранный режим
      this.requestFullscreen();
      
      // Включаем подтверждение закрытия
      this.enableClosingConfirmation();
      
      // Настраиваем цвета
      this.setThemeColors();
      
      // Готовим приложение
      this.ready();
      
      // Подписываемся на события
      this.setupEventListeners();
      
      this.logInfo();
      
    } catch (error) {
      console.error('Error setting up Telegram Web App:', error);
    }
  }

  /**
   * Расширяет приложение на весь доступный экран
   */
  expand() {
    if (!this.webApp) return false;
    
    try {
      if (typeof this.webApp.expand === 'function') {
        this.webApp.expand();
        console.log('✅ Telegram Web App expanded');
        return true;
      } else {
        console.log('❌ expand() not available');
        return false;
      }
    } catch (error) {
      console.error('Error expanding Telegram Web App:', error);
      return false;
    }
  }

  /**
   * Запрашивает полноэкранный режим
   */
  requestFullscreen() {
    if (!this.webApp) return false;
    
    try {
      if (typeof this.webApp.requestFullscreen === 'function') {
        this.webApp.requestFullscreen();
        console.log('✅ Fullscreen requested');
        return true;
      } else {
        console.log('❌ requestFullscreen() not available');
        return false;
      }
    } catch (error) {
      console.error('Error requesting fullscreen:', error);
      return false;
    }
  }

  /**
   * Включает подтверждение при закрытии приложения
   */
  enableClosingConfirmation() {
    if (!this.webApp) return false;
    
    try {
      if (typeof this.webApp.enableClosingConfirmation === 'function') {
        this.webApp.enableClosingConfirmation();
        console.log('✅ Closing confirmation enabled');
        return true;
      } else {
        console.log('❌ enableClosingConfirmation() not available');
        return false;
      }
    } catch (error) {
      console.error('Error enabling closing confirmation:', error);
      return false;
    }
  }

  /**
   * Отключает подтверждение при закрытии приложения
   */
  disableClosingConfirmation() {
    if (!this.webApp) return false;
    
    try {
      if (typeof this.webApp.disableClosingConfirmation === 'function') {
        this.webApp.disableClosingConfirmation();
        console.log('✅ Closing confirmation disabled');
        return true;
      } else {
        console.log('❌ disableClosingConfirmation() not available');
        return false;
      }
    } catch (error) {
      console.error('Error disabling closing confirmation:', error);
      return false;
    }
  }

  /**
   * Настраивает цвета темы
   */
  setThemeColors(headerColor = '#7370fd', backgroundColor = '#ffffff') {
    if (!this.webApp) return false;
    
    try {
      let success = true;
      
      if (typeof this.webApp.setHeaderColor === 'function') {
        this.webApp.setHeaderColor(headerColor);
        console.log(`✅ Header color set to ${headerColor}`);
      } else {
        console.log('❌ setHeaderColor() not available');
        success = false;
      }
      
      if (typeof this.webApp.setBackgroundColor === 'function') {
        this.webApp.setBackgroundColor(backgroundColor);
        console.log(`✅ Background color set to ${backgroundColor}`);
      } else {
        console.log('❌ setBackgroundColor() not available');
        success = false;
      }
      
      return success;
    } catch (error) {
      console.error('Error setting theme colors:', error);
      return false;
    }
  }

  /**
   * Сообщает Telegram, что приложение готово
   */
  ready() {
    if (!this.webApp) return false;
    
    try {
      if (typeof this.webApp.ready === 'function') {
        this.webApp.ready();
        console.log('✅ Telegram Web App ready');
        return true;
      } else {
        console.log('❌ ready() not available');
        return false;
      }
    } catch (error) {
      console.error('Error calling ready:', error);
      return false;
    }
  }

  /**
   * Настраивает обработчики событий
   */
  setupEventListeners() {
    if (!this.webApp) return;

    // Обработчик изменения viewport
    const handleViewportChanged = () => {
      console.log('📱 Viewport changed:', {
        viewportHeight: this.webApp.viewportHeight,
        viewportStableHeight: this.webApp.viewportStableHeight,
        isExpanded: this.webApp.isExpanded
      });
    };

    // Обработчик изменения темы
    const handleThemeChanged = () => {
      console.log('🎨 Theme changed:', {
        colorScheme: this.webApp.colorScheme,
        themeParams: this.webApp.themeParams
      });
    };

    try {
      this.webApp.onEvent('viewportChanged', handleViewportChanged);
      this.webApp.onEvent('themeChanged', handleThemeChanged);
      console.log('✅ Event listeners set up');
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  /**
   * Логирует информацию о Telegram Web App
   */
  logInfo() {
    if (!this.webApp) return;

    console.log('📋 Telegram Web App Info:', {
      platform: this.webApp.platform,
      version: this.webApp.version,
      colorScheme: this.webApp.colorScheme,
      themeParams: this.webApp.themeParams,
      isExpanded: this.webApp.isExpanded,
      viewportHeight: this.webApp.viewportHeight,
      viewportStableHeight: this.webApp.viewportStableHeight,
      headerColor: this.webApp.headerColor,
      backgroundColor: this.webApp.backgroundColor,
      isClosingConfirmationEnabled: this.webApp.isClosingConfirmationEnabled
    });
  }

  /**
   * Получает информацию о поддержке функций
   */
  getSupportInfo() {
    if (!this.webApp) {
      return {
        isAvailable: false,
        features: {}
      };
    }

    return {
      isAvailable: true,
      isInitialized: this.isInitialized,
      platform: this.webApp.platform,
      version: this.webApp.version,
      features: {
        expand: typeof this.webApp.expand === 'function',
        requestFullscreen: typeof this.webApp.requestFullscreen === 'function',
        enableClosingConfirmation: typeof this.webApp.enableClosingConfirmation === 'function',
        setHeaderColor: typeof this.webApp.setHeaderColor === 'function',
        setBackgroundColor: typeof this.webApp.setBackgroundColor === 'function',
        hapticFeedback: !!this.webApp.HapticFeedback,
        ready: typeof this.webApp.ready === 'function'
      },
      state: {
        isExpanded: this.webApp.isExpanded,
        viewportHeight: this.webApp.viewportHeight,
        viewportStableHeight: this.webApp.viewportStableHeight,
        colorScheme: this.webApp.colorScheme
      }
    };
  }

  /**
   * Получает экземпляр Telegram Web App
   */
  getWebApp() {
    return this.webApp;
  }

  /**
   * Проверяет, инициализирован ли Telegram Web App
   */
  isReady() {
    return this.isInitialized && this.webApp;
  }
}

// Создаем единственный экземпляр
const telegramWebAppManager = new TelegramWebAppManager();

// Экспортируем методы для удобного использования
export const initTelegramWebApp = () => telegramWebAppManager.init();
export const expandTelegramWebApp = () => telegramWebAppManager.expand();
export const requestFullscreen = () => telegramWebAppManager.requestFullscreen();
export const enableClosingConfirmation = () => telegramWebAppManager.enableClosingConfirmation();
export const disableClosingConfirmation = () => telegramWebAppManager.disableClosingConfirmation();
export const setThemeColors = (headerColor, backgroundColor) => telegramWebAppManager.setThemeColors(headerColor, backgroundColor);
export const getTelegramWebApp = () => telegramWebAppManager.getWebApp();
export const getTelegramSupportInfo = () => telegramWebAppManager.getSupportInfo();
export const isTelegramReady = () => telegramWebAppManager.isReady();

// Экспортируем класс для расширенного использования
export { TelegramWebAppManager };

// Экспортируем экземпляр по умолчанию
export default telegramWebAppManager;
