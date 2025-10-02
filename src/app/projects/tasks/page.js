'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaCheck, 
  FaClock, 
  FaExclamationTriangle,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext.js';
import CreateTaskForm from '../../components/CreateTaskForm';
import { withVibration, VIBRATION_PATTERNS } from '../../utils/vibration';

export default function TasksPage() {
  const { tasks, loading, error, loadTasks, updateTaskStatus, createTask, projects } = useApp();
  
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskToggle = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleTaskToggleWithVibration = withVibration(handleTaskToggle, VIBRATION_PATTERNS.TOGGLE);
  const handleFilterChange = withVibration((filterKey) => setFilter(filterKey), VIBRATION_PATTERNS.BUTTON_TAP);

  const handleCreateTask = async (projectId, taskData) => {
    try {
      await createTask(projectId, taskData);
      // Обновляем список задач
      await loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const handleShowCreateTaskForm = withVibration(() => {
    if (projects.length === 0) {
      alert('У вас нет проектов. Сначала создайте проект.');
      return;
    }
    if (projects.length === 1) {
      setSelectedProjectId(projects[0].id);
    }
    setShowCreateTaskForm(true);
  }, VIBRATION_PATTERNS.BUTTON_TAP);

  const handleCloseCreateTaskForm = withVibration(() => {
    setShowCreateTaskForm(false);
    setSelectedProjectId(null);
  }, VIBRATION_PATTERNS.BUTTON_TAP);

  const filteredTasks = tasks.filter(task => {
    // Фильтр по статусу
    let statusMatch = true;
    if (filter === 'pending') statusMatch = task.status === 'todo' || task.status === 'in_progress';
    if (filter === 'completed') statusMatch = task.status === 'done';
    if (filter === 'overdue') statusMatch = task.isOverdue;
    
    // Поиск по тексту
    const searchMatch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <FaCheck className="text-green-500" />;
      case 'in_progress': return <FaClock className="text-blue-500" />;
      case 'todo': return <FaClock className="text-yellow-500" />;
      case 'backlog': return <FaExclamationTriangle className="text-gray-500" />;
      default: return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done': return 'Выполнено';
      case 'in_progress': return 'В работе';
      case 'todo': return 'К выполнению';
      case 'backlog': return 'Бэклог';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="p-4 mt-20">
      {/* Заголовок */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold text-white">Мои задачи</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShowCreateTaskForm}
          className="bg-white text-[#7370fd] p-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors"
        >
          <FaPlus className="text-xl" />
        </motion.button>
      </motion.div>

      {/* Поиск и фильтры */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6 space-y-4"
      >
        {/* Поиск */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск задач..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
          />
        </div>

        {/* Фильтры */}
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: 'all', label: 'Все', count: tasks.length },
            { key: 'pending', label: 'В работе', count: tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length },
            { key: 'completed', label: 'Выполнено', count: tasks.filter(t => t.status === 'done').length },
            { key: 'overdue', label: 'Просрочено', count: tasks.filter(t => t.isOverdue).length }
          ].map((filterOption, index) => (
            <motion.button
              key={filterOption.key}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange(filterOption.key)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                ${filter === filterOption.key
                  ? 'bg-white text-[#7370fd] shadow-md'
                  : 'bg-white/20 text-[#7370fd] hover:bg-white/30'
                }
              `}
            >
              <span>{filterOption.label}</span>
              <span className={`
                px-2 py-1 rounded-full text-xs
                ${filter === filterOption.key
                  ? 'bg-[#7370fd]/20 text-[#7370fd]'
                  : 'bg-white/20 text-[#7370fd]'
                }
              `}>
                {filterOption.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Список задач */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => (
          <motion.div 
            key={task.id} 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <button 
                  onClick={() => handleTaskToggleWithVibration(task.id, task.status)}
                  className={`
                    mt-1 p-2 rounded-lg transition-colors
                    ${task.isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                    }
                  `}
                >
                  <FaCheck className="text-sm" />
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description || 'Без описания'}</p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">Проект #{task.projectId}</span>
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priorityText}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                {getStatusIcon(task.status)}
                <span className={`
                  ${task.status === 'done' ? 'text-green-600' :
                    task.isOverdue ? 'text-red-600' : 'text-yellow-600'}
                `}>
                  {getStatusText(task.status)}
                </span>
              </div>
            </div>
            
            {/* Дедлайн */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
              <span>
                {task.dueDate ? `До ${new Date(task.dueDate).toLocaleDateString('ru-RU')}` : 'Без дедлайна'}
              </span>
              {task.isOverdue && (
                <span className="text-red-500 font-medium">Просрочено</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Пустое состояние */}
      {!loading && filteredTasks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FaClock className="text-6xl text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Нет задач</h3>
          <p className="text-white/70 mb-6">
            {searchQuery 
              ? 'По вашему запросу ничего не найдено'
              : filter === 'all' 
                ? 'У вас пока нет задач'
                : `Нет задач со статусом "${filter}"`
            }
          </p>
          {!searchQuery && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowCreateTaskForm}
              className="bg-white text-[#7370fd] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Создать задачу
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Состояние загрузки */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Загрузка задач...</p>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Форма создания задачи */}
      {showCreateTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Создать задачу</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseCreateTaskForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaPlus className="text-xl rotate-45" />
              </motion.button>
            </div>

            {/* Выбор проекта */}
            {projects.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Выберите проект
                </label>
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                >
                  <option value="">Выберите проект</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Форма создания задачи */}
            {selectedProjectId && (
              <CreateTaskForm
                isOpen={true}
                onClose={handleCloseCreateTaskForm}
                onSubmit={handleCreateTask}
                projectId={selectedProjectId}
                loading={loading}
                embedded={true}
              />
            )}

            {/* Кнопка отмены если проект не выбран */}
            {projects.length > 1 && !selectedProjectId && (
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseCreateTaskForm}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
