'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { TaskPriority } from '../types/api';
import { withVibration, VIBRATION_PATTERNS } from '../utils/vibration';

export default function CreateTaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  projectId, 
  loading = false,
  embedded = false
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    due_date: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название задачи обязательно';
    }
    
    if (formData.due_date && new Date(formData.due_date) < new Date()) {
      newErrors.due_date = 'Дата не может быть в прошлом';
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
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        priority: formData.priority,
        due_date: formData.due_date || null
      };

      await onSubmit(projectId, taskData);
      
      // Сбрасываем форму
      setFormData({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        due_date: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      due_date: ''
    });
    setErrors({});
    onClose();
  };

  const handleSubmitWithVibration = withVibration(handleSubmit, VIBRATION_PATTERNS.SUCCESS);
  const handleCloseWithVibration = withVibration(handleClose, VIBRATION_PATTERNS.BUTTON_TAP);

  const priorityOptions = [
    { value: TaskPriority.VERY_LOW, label: 'Очень низкий', color: 'text-gray-500' },
    { value: TaskPriority.LOW, label: 'Низкий', color: 'text-green-500' },
    { value: TaskPriority.MEDIUM, label: 'Средний', color: 'text-yellow-500' },
    { value: TaskPriority.HIGH, label: 'Высокий', color: 'text-orange-500' },
    { value: TaskPriority.BLOCKER, label: 'Блокер', color: 'text-red-500' }
  ];

  if (!isOpen) return null;

  const formContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`${embedded ? 'w-full' : 'bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'}`}
    >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Создать задачу</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCloseWithVibration}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </motion.button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmitWithVibration} className="space-y-4">
          {/* Название задачи */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название задачи *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 ${
                errors.title ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Введите название задачи"
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
              placeholder="Описание задачи (необязательно)"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Приоритет */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Приоритет
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('priority', option.value)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === option.value
                      ? 'border-[#7370fd] bg-[#7370fd]/10 text-[#7370fd]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <FaExclamationTriangle className={option.color} />
                    <span>{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Дедлайн */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дедлайн
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 ${
                  errors.due_date ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={loading}
              />
            </div>
            {errors.due_date && (
              <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex space-x-3 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-[#7370fd] text-white py-3 rounded-lg hover:bg-[#7370fd]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать задачу'}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleCloseWithVibration}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Отмена
            </motion.button>
          </div>
        </form>
      </motion.div>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {formContent}
    </div>
  );
}
