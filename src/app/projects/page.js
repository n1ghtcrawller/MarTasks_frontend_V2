'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaFolder, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { withVibration, VIBRATION_PATTERNS } from '../utils/vibration';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading, error, loadProjects, createProject } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      await createProject(newProject);
      setNewProject({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleCreateProjectWithVibration = withVibration(handleCreateProject, VIBRATION_PATTERNS.SUCCESS);
  const handleShowCreateForm = withVibration(() => setShowCreateForm(true), VIBRATION_PATTERNS.BUTTON_TAP);
  const handleCancelCreate = withVibration(() => setShowCreateForm(false), VIBRATION_PATTERNS.BUTTON_TAP);
  const handleGoToCreatePage = withVibration(() => router.push('/projects/create'), VIBRATION_PATTERNS.NAVIGATION);

  return (
    <div className="p-4">
      {/* Заголовок */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold text-white">Проекты</h1>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoToCreatePage}
            className="bg-white text-[#7370fd] p-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors"
            title="Создать проект"
          >
            <FaPlus className="text-xl" />
          </motion.button>
        </div>
      </motion.div>

      {/* Форма создания проекта */}
      {showCreateForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl p-6 shadow-md mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Создать новый проект</h3>
          <form onSubmit={handleCreateProjectWithVibration} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название проекта</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                placeholder="Введите название проекта"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7370fd]/20"
                placeholder="Описание проекта (необязательно)"
                rows="3"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#7370fd] text-white px-6 py-3 rounded-lg hover:bg-[#7370fd]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Создание...' : 'Быстрое создание'}
              </button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoToCreatePage}
                className="bg-white text-[#7370fd] border border-[#7370fd] px-6 py-3 rounded-lg hover:bg-[#7370fd]/10 transition-colors"
              >
                Расширенное создание
              </motion.button>
              <button
                type="button"
                onClick={handleCancelCreate}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Ошибка */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Список проектов */}
      <div className="space-y-4">
        {projects.map((project, index) => {
          const progressPercentage = project.progress || 0;
          
          return (
            <motion.div
              key={project.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link href={`/projects/${project.id}`}>
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <FaFolder className="text-[#7370fd] text-xl mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description || 'Без описания'}</p>
                    </div>
                  </div>
                </div>
              
              {/* Прогресс */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Прогресс</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#7370fd] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
                  {/* Информация о проекте */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span>Создан {new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <span>{project.membersCount || 0} участников</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Пустое состояние (если нет проектов) */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <FaFolder className="text-6xl text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Нет проектов</h3>
          <p className="text-white/70 mb-6">Создайте свой первый проект, чтобы начать работу</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoToCreatePage}
            className="bg-white text-[#7370fd] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Создать проект
          </motion.button>
        </div>
      )}
    </div>
  );
}
