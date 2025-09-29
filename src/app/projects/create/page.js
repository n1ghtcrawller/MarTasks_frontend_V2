'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaFolder, 
  FaUsers, 
  FaCalendarAlt, 
  FaTag,
  FaPalette,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import { withVibration, VIBRATION_PATTERNS } from '../../utils/vibration';

export default function CreateProjectPage() {
  const router = useRouter();
  const { createProject, loading } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priority: 'medium',
    color: '#7370fd',
    startDate: '',
    endDate: '',
    teamSize: 1,
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'work', label: 'Работа' },
    { value: 'personal', label: 'Личные' },
    { value: 'education', label: 'Обучение' },
    { value: 'health', label: 'Здоровье' },
    { value: 'finance', label: 'Финансы' },
    { value: 'hobby', label: 'Хобби' },
    { value: 'other', label: 'Другое' }
  ];

  const priorities = [
    { value: 'low', label: 'Низкий', color: 'text-green-500' },
    { value: 'medium', label: 'Средний', color: 'text-yellow-500' },
    { value: 'high', label: 'Высокий', color: 'text-orange-500' },
    { value: 'urgent', label: 'Срочный', color: 'text-red-500' }
  ];

  const colors = [
    '#7370fd', '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff',
    '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название проекта обязательно';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Дата окончания не может быть раньше даты начала';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createProject(formData);
      router.push('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrors({ submit: 'Ошибка при создании проекта' });
    }
  };

  const handleGoBack = withVibration(() => router.back(), VIBRATION_PATTERNS.NAVIGATION);
  const handleSubmitWithVibration = withVibration(handleSubmit, VIBRATION_PATTERNS.SUCCESS);
  const handleAddTagWithVibration = withVibration(handleAddTag, VIBRATION_PATTERNS.BUTTON_TAP);

  return (
    <div className="min-h-screen p-4">
      {/* Заголовок */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="bg-white text-[#7370fd] p-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors mr-4"
        >
          <FaArrowLeft className="text-xl" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-white">Создать проект</h1>
          <p className="text-white/70 mt-1">Заполните информацию о новом проекте</p>
        </div>
      </motion.div>

      {/* Форма */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <form onSubmit={handleSubmitWithVibration} className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaFolder className="text-[#7370fd] mr-2" />
              Основная информация
            </h2>

            {/* Название проекта */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название проекта *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Введите название проекта"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                placeholder="Опишите цели и задачи проекта"
                rows="4"
              />
            </div>

            {/* Категория и приоритет */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Временные рамки */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaCalendarAlt className="text-[#7370fd] mr-2" />
              Временные рамки
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата начала
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата окончания
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 ${
                    errors.endDate ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Команда */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaUsers className="text-[#7370fd] mr-2" />
              Команда
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Размер команды
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.teamSize}
                onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
              />
            </div>
          </div>

          {/* Теги */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaTag className="text-[#7370fd] mr-2" />
              Теги
            </h2>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTagWithVibration())}
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                placeholder="Добавить тег"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTagWithVibration}
                className="bg-[#7370fd] text-white px-4 py-3 rounded-lg hover:bg-[#7370fd]/90 transition-colors"
              >
                Добавить
              </motion.button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-[#7370fd]/10 text-[#7370fd] px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#7370fd]/70 hover:text-[#7370fd]"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Цветовая схема */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaPalette className="text-[#7370fd] mr-2" />
              Цветовая схема
            </h2>

            <div className="grid grid-cols-6 gap-3">
              {colors.map((color) => (
                <motion.button
                  key={color}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleInputChange('color', color)}
                  className={`w-12 h-12 rounded-lg border-2 ${
                    formData.color === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Ошибка отправки */}
          {errors.submit && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {errors.submit}
            </motion.div>
          )}

          {/* Кнопки */}
          <div className="flex space-x-4 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-[#7370fd] text-white px-6 py-3 rounded-lg hover:bg-[#7370fd]/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <FaSave className="text-sm" />
              <span>{loading ? 'Создание...' : 'Создать проект'}</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
