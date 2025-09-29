'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEdit, 
  FaCamera, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrophy,
  FaChartLine,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Александр Иванов',
    email: 'alexander.ivanov@example.com',
    phone: '+7 (999) 123-45-67',
    position: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Москва, Россия',
    joinDate: '2023-01-15',
    avatar: null
  });

  const [editForm, setEditForm] = useState(user);

  const stats = [
    {
      title: 'Проектов завершено',
      value: '12',
      icon: FaTrophy,
      color: 'text-yellow-500'
    },
    {
      title: 'Задач выполнено',
      value: '156',
      icon: FaChartLine,
      color: 'text-green-500'
    },
    {
      title: 'Дней в команде',
      value: '365',
      icon: FaCalendarAlt,
      color: 'text-blue-500'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Веб-приложение',
      role: 'Lead Developer',
      status: 'completed',
      completionDate: '2024-01-20'
    },
    {
      id: 2,
      name: 'Мобильное приложение',
      role: 'Frontend Developer',
      status: 'in-progress',
      completionDate: null
    },
    {
      id: 3,
      name: 'Дизайн система',
      role: 'UI/UX Designer',
      status: 'completed',
      completionDate: '2024-01-15'
    }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(user);
  };

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'in-progress': return 'В работе';
      default: return 'Планируется';
    }
  };

  return (
    <div className="p-4">
      {/* Заголовок */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold text-white">Профиль</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEdit}
          className="bg-white text-[#7370fd] p-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors"
        >
          <FaEdit className="text-xl" />
        </motion.button>
      </motion.div>

      {/* Информация о пользователе */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md mb-6"
      >
        <div className="flex items-start space-x-4">
          {/* Аватар */}
          <div className="relative">
            <div className="w-20 h-20 bg-[#7370fd] rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <FaUser className="text-white text-2xl" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <FaCamera className="text-[#7370fd] text-sm" />
            </button>
          </div>

          {/* Основная информация */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="bg-[#7370fd] text-white px-4 py-2 rounded-lg hover:bg-[#7370fd]/90 transition-colors"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-[#7370fd] font-medium">{user.position}</p>
                <p className="text-gray-600">{user.company}</p>
              </div>
            )}
          </div>
        </div>

        {/* Контактная информация */}
        {!isEditing && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-400" />
              <span className="text-gray-600">{user.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-gray-400" />
              <span className="text-gray-600">{user.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-gray-400" />
              <span className="text-gray-600">
                В команде с {new Date(user.joinDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
              <stat.icon className={`text-2xl ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Последние проекты */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Последние проекты</h3>
        <div className="space-y-3">
          {recentProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">{project.name}</h4>
                <p className="text-sm text-gray-600">{project.role}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                {project.completionDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(project.completionDate).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Действия */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="space-y-3"
      >
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white text-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3"
        >
          <FaCog className="text-[#7370fd]" />
          <span>Настройки аккаунта</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-red-50 text-red-600 p-4 rounded-xl shadow-md hover:bg-red-100 transition-colors flex items-center justify-center space-x-3"
        >
          <FaSignOutAlt />
          <span>Выйти из аккаунта</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
