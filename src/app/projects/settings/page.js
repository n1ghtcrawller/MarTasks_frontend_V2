'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaMoon, 
  FaSun, 
  FaLanguage, 
  FaShieldAlt,
  FaDownload,
  FaTrash,
  FaUserCog,
  FaPalette,
  FaMobile
} from 'react-icons/fa';
import VibrationTest from '../../components/VibrationTest';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('ru');
  const [theme, setTheme] = useState('#7370fd');
  const [showVibrationTest, setShowVibrationTest] = useState(false);

  const settingsSections = [
    {
      title: 'Внешний вид',
      icon: FaPalette,
      items: [
        {
          id: 'darkMode',
          title: 'Темная тема',
          description: 'Использовать темную цветовую схему',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          id: 'theme',
          title: 'Цветовая схема',
          description: 'Выберите основной цвет приложения',
          type: 'color',
          value: theme,
          onChange: setTheme,
          options: ['#7370fd', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
        }
      ]
    },
    {
      title: 'Уведомления',
      icon: FaBell,
      items: [
        {
          id: 'notifications',
          title: 'Push-уведомления',
          description: 'Получать уведомления о новых задачах',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          id: 'emailNotifications',
          title: 'Email-уведомления',
          description: 'Отправлять уведомления на email',
          type: 'toggle',
          value: true,
          onChange: () => {}
        },
        {
          id: 'deadlineReminders',
          title: 'Напоминания о дедлайнах',
          description: 'Уведомлять о приближающихся дедлайнах',
          type: 'toggle',
          value: true,
          onChange: () => {}
        }
      ]
    },
    {
      title: 'Вибрация',
      icon: FaMobile,
      items: [
        {
          id: 'vibrationTest',
          title: 'Тест вибрации',
          description: 'Проверить работу вибрации на вашем устройстве',
          type: 'button',
          action: 'vibrationTest',
          icon: FaMobile
        }
      ]
    },
    {
      title: 'Язык и регион',
      icon: FaLanguage,
      items: [
        {
          id: 'language',
          title: 'Язык интерфейса',
          description: 'Выберите язык приложения',
          type: 'select',
          value: language,
          onChange: setLanguage,
          options: [
            { value: 'ru', label: 'Русский' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' }
          ]
        },
        {
          id: 'timezone',
          title: 'Часовой пояс',
          description: 'Москва (UTC+3)',
          type: 'text',
          value: 'UTC+3',
          onChange: () => {}
        }
      ]
    },
    {
      title: 'Безопасность',
      icon: FaShieldAlt,
      items: [
        {
          id: 'twoFactor',
          title: 'Двухфакторная аутентификация',
          description: 'Дополнительная защита аккаунта',
          type: 'toggle',
          value: false,
          onChange: () => {}
        },
        {
          id: 'sessionTimeout',
          title: 'Автоматический выход',
          description: 'Выход из системы через 30 минут неактивности',
          type: 'toggle',
          value: true,
          onChange: () => {}
        }
      ]
    },
    {
      title: 'Данные',
      icon: FaDownload,
      items: [
        {
          id: 'exportData',
          title: 'Экспорт данных',
          description: 'Скачать все ваши данные в формате JSON',
          type: 'button',
          action: 'export',
          icon: FaDownload
        },
        {
          id: 'deleteAccount',
          title: 'Удалить аккаунт',
          description: 'Безвозвратно удалить все данные',
          type: 'button',
          action: 'delete',
          icon: FaTrash,
          danger: true
        }
      ]
    }
  ];

  const handleExportData = () => {
    // Логика экспорта данных
    console.log('Экспорт данных...');
  };

  const handleDeleteAccount = () => {
    // Логика удаления аккаунта
    if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      console.log('Удаление аккаунта...');
    }
  };

  const handleVibrationTest = () => {
    setShowVibrationTest(true);
  };

  const renderSettingItem = (item) => {
    switch (item.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <button
              onClick={() => item.onChange(!item.value)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${item.value ? 'bg-[#7370fd]' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${item.value ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            <select
              value={item.value}
              onChange={(e) => item.onChange(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
            >
              {item.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'color':
        return (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            <div className="flex space-x-2">
              {item.options.map((color) => (
                <button
                  key={color}
                  onClick={() => item.onChange(color)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${item.value === color ? 'border-gray-400 scale-110' : 'border-gray-200'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-800'}`}>
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <button
              onClick={
                item.action === 'export' ? handleExportData : 
                item.action === 'delete' ? handleDeleteAccount :
                item.action === 'vibrationTest' ? handleVibrationTest :
                () => {}
              }
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${item.danger 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-[#7370fd]/10 text-[#7370fd] hover:bg-[#7370fd]/20'
                }
              `}
            >
              <item.icon className="text-sm" />
              <span className="text-sm font-medium">
                {item.action === 'export' ? 'Экспорт' : 
                 item.action === 'delete' ? 'Удалить' :
                 item.action === 'vibrationTest' ? 'Тест' : 'Действие'}
              </span>
            </button>
          </div>
        );

      case 'text':
        return (
          <div>
            <h4 className="font-medium text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 mt-20">
      {/* Заголовок */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white">Настройки</h1>
        <p className="text-white/70 mt-1">Управляйте настройками приложения</p>
      </motion.div>

      {/* Секции настроек */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div 
            key={sectionIndex} 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center mb-4">
              <section.icon className="text-[#7370fd] text-xl mr-3" />
              <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
            </div>
            
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={item.id} className={itemIndex !== section.items.length - 1 ? 'pb-4 border-b border-gray-100' : ''}>
                  {renderSettingItem(item)}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Тест вибрации */}
      {showVibrationTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-6"
        >
          <VibrationTest />
          <div className="text-center mt-4">
            <button
              onClick={() => setShowVibrationTest(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Закрыть тест
            </button>
          </div>
        </motion.div>
      )}

      {/* Информация о версии */}
      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">MarTasks v1.0.0</p>
        <p className="text-white/50 text-xs mt-1">© 2024 MarTasks. Все права защищены.</p>
      </div>
    </div>
  );
}
