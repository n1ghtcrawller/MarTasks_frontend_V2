'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaEdit, 
  FaSave, 
  FaUser, 
  FaCalendarAlt, 
  FaFlag,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaFolder,
  FaTrash
} from 'react-icons/fa';

export default function TaskModal({ 
  isOpen, 
  onClose, 
  task, 
  onSave, 
  onDelete,
  members = [],
  loading = false 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    assigned_to: null
  });

  // Обновляем форму при изменении задачи
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        assigned_to: task.assigned_to?.id || null
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(task.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleCancel = () => {
    // Восстанавливаем исходные данные
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        assigned_to: task.assigned_to?.id || null
      });
    }
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'very_low': return 'text-green-500';
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'blocker': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'very_low': return 'Очень низкий';
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      case 'blocker': return 'Блокер';
      default: return 'Неизвестно';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
      case 'completed': return <FaCheck className="text-green-500" />;
      case 'in_progress': return <FaClock className="text-blue-500" />;
      case 'todo':
      case 'pending': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'backlog': return <FaFolder className="text-gray-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done':
      case 'completed': return 'Выполнено';
      case 'in_progress': return 'В работе';
      case 'todo':
      case 'pending': return 'К выполнению';
      case 'backlog': return 'Бэклог';
      default: return 'Неизвестно';
    }
  };

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {getStatusIcon(task.status)}
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Редактирование задачи' : 'Просмотр задачи'}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-[#7370fd] hover:bg-[#7370fd]/10 rounded-lg transition-colors"
                  title="Редактировать"
                >
                  <FaEdit className="text-lg" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>

          {/* Контент */}
          <div className="p-6 space-y-6">
            {/* Название задачи */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название задачи
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 focus:border-[#7370fd]"
                  placeholder="Введите название задачи"
                />
              ) : (
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              )}
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 focus:border-[#7370fd] resize-none"
                  placeholder="Введите описание задачи"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">
                  {task.description || 'Описание не указано'}
                </p>
              )}
            </div>

            {/* Информация о задаче */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Статус */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <span className="text-gray-800">{getStatusText(task.status)}</span>
                </div>
              </div>

              {/* Приоритет */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                {isEditing ? (
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 focus:border-[#7370fd]"
                  >
                    <option value="very_low">Очень низкий</option>
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="blocker">Блокер</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaFlag className={`text-sm ${getPriorityColor(task.priority)}`} />
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>
                  </div>
                )}
              </div>

              {/* Исполнитель */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Исполнитель
                </label>
                {isEditing ? (
                  <select
                    name="assigned_to"
                    value={formData.assigned_to || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 focus:border-[#7370fd]"
                  >
                    <option value="">Не назначено</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.user?.displayName || 'Пользователь'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-400" />
                    <span className="text-gray-800">
                      {task.assigned_to?.displayName || 'Не назначено'}
                    </span>
                  </div>
                )}
              </div>

              {/* Срок выполнения */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Срок выполнения
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 focus:border-[#7370fd]"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="text-gray-800">
                      {task.due_date 
                        ? new Date(task.due_date).toLocaleDateString('ru-RU')
                        : 'Не указан'
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Метаинформация */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Создано:</span>{' '}
                  {task.created_at ? new Date(task.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                </div>
                <div>
                  <span className="font-medium">Обновлено:</span>{' '}
                  {task.updated_at ? new Date(task.updated_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div>
              {!isEditing && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash className="text-sm" />
                  <span>Удалить</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#7370fd] text-white rounded-lg hover:bg-[#7370fd]/90 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="text-sm" />
                    <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#7370fd] text-white rounded-lg hover:bg-[#7370fd]/90 transition-colors"
                >
                  Закрыть
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
