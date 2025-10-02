/**
 * HapticFeedback утилита для Telegram Web App
 * Поддерживает различные типы тактильной обратной связи
 * Интегрируется с существующей системой вибрации
 */

/**
 * Класс для работы с HapticFeedback в Telegram Web App
 */
class HapticFeedback {
  constructor() {
    this.webApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
    this.isSupported = this.checkSupport();
  }

  /**
   * Проверяет поддержку HapticFeedback
   * @returns {boolean}
   */
  checkSupport() {
    if (typeof window === 'undefined') return false;
    
    // Проверяем наличие Telegram Web App
    if (!this.webApp) return false;
    
    // Проверяем наличие HapticFeedback API
    if (!this.webApp.HapticFeedback) return false;
    
    // Проверяем платформу (не работает на десктопе)
    if (this.webApp.platform === 'unknown' || this.webApp.platform === 'desktop') {
      return false;
    }
    
    return true;
  }

  /**
   * Тактильная обратная связь при касании
   * @param {'light' | 'medium' | 'heavy' | 'rigid' | 'soft'} style - Стиль вибрации
   */
  impactOccurred(style = 'medium') {
    if (!this.isSupported) {
      console.log('HapticFeedback not supported, style:', style);
      return;
    }

    try {
      this.webApp.HapticFeedback.impactOccurred(style);
    } catch (error) {
      console.warn('HapticFeedback impactOccurred failed:', error);
    }
  }

  /**
   * Тактильная обратная связь для уведомлений
   * @param {'error' | 'success' | 'warning'} type - Тип уведомления
   */
  notificationOccurred(type = 'success') {
    if (!this.isSupported) {
      console.log('HapticFeedback not supported, type:', type);
      return;
    }

    try {
      this.webApp.HapticFeedback.notificationOccurred(type);
    } catch (error) {
      console.warn('HapticFeedback notificationOccurred failed:', error);
    }
  }

  /**
   * Тактильная обратная связь при изменении выбора
   */
  selectionChanged() {
    if (!this.isSupported) {
      console.log('HapticFeedback not supported for selection change');
      return;
    }

    try {
      this.webApp.HapticFeedback.selectionChanged();
    } catch (error) {
      console.warn('HapticFeedback selectionChanged failed:', error);
    }
  }

  /**
   * Получить информацию о поддержке
   * @returns {object}
   */
  getSupportInfo() {
    return {
      isSupported: this.isSupported,
      hasWebApp: !!this.webApp,
      hasHapticFeedback: !!(this.webApp?.HapticFeedback),
      platform: this.webApp?.platform || 'unknown',
      version: this.webApp?.version || 'unknown'
    };
  }
}

// Создаем единственный экземпляр
const hapticFeedback = new HapticFeedback();

// Экспортируем методы для удобного использования
export const impactOccurred = (style) => hapticFeedback.impactOccurred(style);
export const notificationOccurred = (type) => hapticFeedback.notificationOccurred(type);
export const selectionChanged = () => hapticFeedback.selectionChanged();
export const getSupportInfo = () => hapticFeedback.getSupportInfo();

// Удобные методы для разных типов воздействий
export const hapticLight = () => impactOccurred('light');
export const hapticMedium = () => impactOccurred('medium');
export const hapticHeavy = () => impactOccurred('heavy');
export const hapticRigid = () => impactOccurred('rigid');
export const hapticSoft = () => impactOccurred('soft');

// Удобные методы для уведомлений
export const hapticSuccess = () => notificationOccurred('success');
export const hapticError = () => notificationOccurred('error');
export const hapticWarning = () => notificationOccurred('warning');

// Удобные методы для UI действий
export const hapticButtonTap = () => impactOccurred('light');
export const hapticToggle = () => selectionChanged();
export const hapticNavigation = () => impactOccurred('medium');
export const hapticConfirm = () => impactOccurred('heavy');

/**
 * Создает обертку для функции с добавлением тактильной обратной связи
 * @param {Function} onClick - Оригинальная функция
 * @param {string} hapticType - Тип тактильной обратной связи
 * @returns {Function}
 */
export const withHapticFeedback = (onClick, hapticType = 'light') => {
  return (event) => {
    // Выполняем тактильную обратную связь
    switch (hapticType) {
      case 'light':
      case 'medium':
      case 'heavy':
      case 'rigid':
      case 'soft':
        impactOccurred(hapticType);
        break;
      case 'success':
      case 'error':
      case 'warning':
        notificationOccurred(hapticType);
        break;
      case 'selection':
        selectionChanged();
        break;
      default:
        impactOccurred('light');
    }

    // Выполняем оригинальную функцию
    if (onClick) {
      onClick(event);
    }
  };
};

// Экспортируем класс для расширенного использования
export { HapticFeedback };

// Экспортируем экземпляр по умолчанию
export default hapticFeedback;
