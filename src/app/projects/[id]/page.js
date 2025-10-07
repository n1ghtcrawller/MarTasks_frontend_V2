'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import CreateTaskForm from '../../components/CreateTaskForm';
import TasksTable from '../../components/TasksTable';
import TaskModal from '../../components/TaskModal';
import { withVibration, VIBRATION_PATTERNS } from '../../utils/vibration';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUsers, 
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaFolder,
  FaChartBar,
  FaComments
} from 'react-icons/fa';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tasks');

  // Получаем данные проекта из контекста
  const { 
    currentProject, 
    loadProject, 
    loadProjectTasks, 
    loadProjectMembers, 
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask: deleteTaskAPI
  } = useApp();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const projectData = await loadProject(params.id);
        setProject(projectData);
        
        const tasksData = await loadProjectTasks(params.id);
        setTasks(tasksData);
        
        const membersData = await loadProjectMembers(params.id);
        setMembers(membersData);
      } catch (error) {
        console.error('Failed to load project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [params.id]);

  const handleCreateTask = async (projectId, taskData) => {
    try {
      const newTask = await createTask(projectId, taskData);
      // Обновляем список задач
      const updatedTasks = await loadProjectTasks(projectId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      // Обновляем статус задачи через API
      await updateTaskStatus(taskId, newStatus);
      
      // Обновляем локальное состояние задач
      const updatedTasks = await loadProjectTasks(params.id);
      setTasks(updatedTasks);
      
      setSuccessMessage(`Статус задачи обновлен на "${getStatusText(newStatus)}"`);
      
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update task status:', error);
      setError(`Ошибка при обновлении статуса: ${error.message}`);
      
      // Автоматически скрываем ошибку через 5 секунд
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleTaskEdit = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowTaskModal(true);
    }
  };

  const handleTaskView = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowTaskModal(true);
    }
  };

  const handleTaskSave = async (taskId, taskData) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      // Обновляем задачу через API
      await updateTask(taskId, taskData);
      
      // Обновляем локальное состояние задач
      const updatedTasks = await loadProjectTasks(params.id);
      setTasks(updatedTasks);
      
      setSuccessMessage('Задача успешно обновлена');
      
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update task:', error);
      setError(`Ошибка при обновлении задачи: ${error.message}`);
      
      // Автоматически скрываем ошибку через 5 секунд
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleTaskDelete = async (taskId) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      // Удаляем задачу через API
      await deleteTaskAPI(taskId);
      
      // Обновляем локальное состояние задач
      const updatedTasks = await loadProjectTasks(params.id);
      setTasks(updatedTasks);
      
      setSuccessMessage('Задача успешно удалена');
      
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError(`Ошибка при удалении задачи: ${error.message}`);
      
      // Автоматически скрываем ошибку через 5 секунд
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleTaskToggleComplete = async (taskId) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      // Находим задачу и определяем новый статус
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newStatus = (task.status === 'done' || task.status === 'completed') ? 'todo' : 'done';
      
      // Обновляем статус задачи через API
      await updateTaskStatus(taskId, newStatus);
      
      // Обновляем локальное состояние задач
      const updatedTasks = await loadProjectTasks(params.id);
      setTasks(updatedTasks);
      
      const statusText = newStatus === 'completed' ? 'выполнена' : 'возвращена в работу';
      setSuccessMessage(`Задача ${statusText}`);
      
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      setError(`Ошибка при изменении статуса: ${error.message}`);
      
      // Автоматически скрываем ошибку через 5 секунд
      setTimeout(() => setError(null), 5000);
    }
  };
  const generateInviteLink = () => {
    const inviteLink = `https://t.me/share/url?url=https://t.me/MarTasksBot&text=Приглащаю тебя принять участие в проекте ${project?.name}!`;

    // Открываем ссылку в новой вкладке
    window.open(inviteLink);

    // Обновляем сообщения для пользователя
    setLoading(false);
    setSuccessMessage('Ссылка для приглашения скопирована и готова для отправки!');
};

const handleInviteClick = () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    generateInviteLink();
};


  const handleShowCreateTaskForm = withVibration(() => setShowCreateTaskForm(true), VIBRATION_PATTERNS.BUTTON_TAP);
  const handleCloseCreateTaskForm = withVibration(() => setShowCreateTaskForm(false), VIBRATION_PATTERNS.BUTTON_TAP);

  const tabs = [
    { id: 'tasks', label: 'Задачи', count: tasks.length },
    { id: 'team', label: 'Команда', count: members.length },
    { id: 'progress', label: 'Прогресс', count: null },
    { id: 'comments', label: 'Обсуждения', count: 0 }
  ];

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



  const renderTeam = () => (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#7370fd] rounded-full flex items-center justify-center">
              {member.avatar ? (
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaUsers className="text-white" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{member.user ? member.user.displayName : 'Пользователь'}</h4>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
            <button className="text-[#7370fd] hover:text-[#7370fd]/80">
              <FaEdit className="text-sm" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Общий прогресс */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Общий прогресс</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Выполнено</span>
            <span>{project?.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#7370fd] h-3 rounded-full transition-all duration-300"
              style={{ width: `${project?.progress || 0}%` }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-500">
              {tasks.filter(t => t.status === 'done').length}
            </p>
            <p className="text-sm text-gray-600">Выполнено</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">
              {tasks.filter(t => t.status === 'in_progress').length}
            </p>
            <p className="text-sm text-gray-600">В работе</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-500">
              {tasks.filter(t => t.status === 'todo' || t.status === 'backlog').length}
            </p>
            <p className="text-sm text-gray-600">Ожидает</p>
          </div>
        </div>
      </div>

      {/* Статистика по приоритетам */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Задачи по приоритетам</h3>
        <div className="space-y-3">
          {[
            { priority: 'high', label: 'Высокий', color: 'text-red-500', count: tasks.filter(t => t.priority === 'high').length },
            { priority: 'medium', label: 'Средний', color: 'text-yellow-500', count: tasks.filter(t => t.priority === 'medium').length },
            { priority: 'low', label: 'Низкий', color: 'text-green-500', count: tasks.filter(t => t.priority === 'low').length }
          ].map((item) => (
            <div key={item.priority} className="flex items-center justify-between">
              <span className={item.color}>{item.label} приоритет</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderComments = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-[#7370fd] rounded-full flex items-center justify-center">
            <FaUsers className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-800">Александр Иванов</span>
              <span className="text-xs text-gray-500">2 часа назад</span>
            </div>
            <p className="text-gray-600">Отличная работа над авторизацией! Нужно только добавить валидацию email.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-[#7370fd] rounded-full flex items-center justify-center">
            <FaUsers className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-800">Мария Петрова</span>
              <span className="text-xs text-gray-500">5 часов назад</span>
            </div>
            <p className="text-gray-600">Дизайн главной страницы готов. Файлы загружены в Figma.</p>
          </div>
        </div>
      </div>

      {/* Форма для нового комментария */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-[#7370fd] rounded-full flex items-center justify-center">
            <FaUsers className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Добавить комментарий..."
              className="w-full p-3 text-[#7370fd] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20 resize-none"
              rows="3"
            />
            <div className="flex justify-end mt-2">
              <button className="bg-[#7370fd] text-white px-4 py-2 rounded-lg hover:bg-[#7370fd]/90 transition-colors">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 mt-20">
      {/* Заголовок */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center space-x-4 mb-6"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="bg-white text-[#7370fd] p-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{project?.name || 'Загрузка...'}</h1>
          <p className="text-white/70">{project?.description || ''}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-[#7370fd] p-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors"
        >
          <FaEdit className="text-xl" />
        </motion.button>
      </motion.div>

      {/* Информация о проекте */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-white rounded-xl p-4 shadow-md mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-[#7370fd]" />
            <div>
              <p className="text-sm text-gray-600">Создан</p>
              <p className="font-semibold text-[#7370fd]">{project?.createdAt ? new Date(project.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaChartBar className="text-[#7370fd]" />
            <div>
              <p className="text-sm text-gray-600">Прогресс</p>
              <p className="font-semibold text-[#7370fd]">{project?.progress || 0}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaUsers className="text-[#7370fd]" />
            <div>
              <p className="text-sm text-gray-600">Команда</p>
              <p className="font-semibold text-[#7370fd]">{members.length} участников</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Табы */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex space-x-2 mb-6 overflow-x-auto"
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
              ${activeTab === tab.id
                ? 'bg-white text-[#7370fd] shadow-md'
                : 'bg-white/20 text-[#7370fd] hover:bg-white/30'
              }
            `}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`
                px-2 py-1 rounded-full text-xs
                ${activeTab === tab.id
                  ? 'bg-[#7370fd]/20 text-[#7370fd]'
                  : 'bg-white/20 text-[#7370fd]'
                }
              `}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Контент табов */}
      <div className="mb-20">
        {activeTab === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Задачи проекта</h2>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowCreateTaskForm}
                className="bg-white text-[#7370fd] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <FaPlus className="text-sm" />
                <span>Добавить задачу</span>
              </motion.button>
            </div>
            <TasksTable
              tasks={tasks}
              onEdit={handleTaskEdit}
              onView={handleTaskView}
              onDelete={handleTaskDelete}
              onToggleComplete={handleTaskToggleComplete}
              onStatusChange={handleTaskStatusChange}
            />
          </div>
        )}
        
        {activeTab === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Команда проекта</h2>
              <button className="bg-white text-[#7370fd] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2" onClick={handleInviteClick}>
                <FaPlus className="text-sm" />
                <span>Добавить участника</span>
              </button>
            </div>
            {renderTeam()}
          </div>
        )}
        
        {activeTab === 'progress' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Прогресс проекта</h2>
            {renderProgress()}
          </div>
        )}
        
        {activeTab === 'comments' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Обсуждения</h2>
            {renderComments()}
          </div>
        )}
      </div>

      {/* Форма создания задачи */}
      <CreateTaskForm
        isOpen={showCreateTaskForm}
        onClose={handleCloseCreateTaskForm}
        onSubmit={handleCreateTask}
        projectId={params.id}
        loading={loading}
      />

      {/* Модальное окно задачи */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={handleCloseTaskModal}
        task={selectedTask}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
        members={members}
        loading={loading}
      />

      {/* Уведомления */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
