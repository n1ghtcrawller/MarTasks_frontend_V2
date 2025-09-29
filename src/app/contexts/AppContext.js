'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, projectsAPI, tasksAPI } from '../utils/api.js';
import { User, Project, Task, ProjectMember, dataUtils } from '../types/api.js';

// Начальное состояние
const initialState = {
  user: null,
  projects: [],
  tasks: [],
  currentProject: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Типы действий
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_TASKS: 'SET_TASKS',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  LOGOUT: 'LOGOUT',
};

// Редьюсер
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        error: null 
      };
    
    case ActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload, loading: false };
    
    case ActionTypes.SET_TASKS:
      return { ...state, tasks: action.payload, loading: false };
    
    case ActionTypes.SET_CURRENT_PROJECT:
      return { ...state, currentProject: action.payload };
    
    case ActionTypes.ADD_PROJECT:
      return { 
        ...state, 
        projects: [...state.projects, action.payload],
        loading: false 
      };
    
    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
        currentProject: state.currentProject?.id === action.payload.id 
          ? action.payload 
          : state.currentProject,
        loading: false
      };
    
    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload 
          ? null 
          : state.currentProject,
        loading: false
      };
    
    case ActionTypes.ADD_TASK:
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload],
        loading: false 
      };
    
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        loading: false
      };
    
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        loading: false
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        isAuthenticated: false
      };
    
    default:
      return state;
  }
}

// Создаем контекст
const AppContext = createContext();

// Провайдер контекста
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Проверяем аутентификацию только при наличии токена
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      checkAuth();
    }
  }, []);

  // Проверка аутентификации
  const checkAuth = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const userData = await authAPI.getCurrentUser();
      dispatch({ type: ActionTypes.SET_USER, payload: new User(userData) });
      await loadProjects();
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: ActionTypes.SET_USER, payload: null });
    }
  };

  // Загрузка проектов
  const loadProjects = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.getProjects();
      const projects = response.projects.map(project => new Project(project));
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: projects });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Загрузка задач
  const loadTasks = async (projectId = null) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      let response;
      
      if (projectId) {
        response = await tasksAPI.getProjectTasks(projectId);
      } else {
        response = await tasksAPI.getMyTasks();
      }
      
      const tasks = response.tasks.map(task => new Task(task));
      dispatch({ type: ActionTypes.SET_TASKS, payload: tasks });
      return tasks;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Загрузка конкретного проекта
  const loadProject = async (projectId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.getProject(projectId);
      const project = new Project(response);
      dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: project });
      return project;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Загрузка задач проекта
  const loadProjectTasks = async (projectId) => {
    try {
      const response = await tasksAPI.getProjectTasks(projectId);
      return response.tasks.map(task => new Task(task));
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Загрузка участников проекта
  const loadProjectMembers = async (projectId) => {
    try {
      const response = await projectsAPI.getProjectMembers(projectId);
      return response.map(member => new ProjectMember(member));
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Создание проекта
  const createProject = async (projectData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.createProject(projectData);
      const project = new Project(response);
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: project });
      return project;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Обновление проекта
  const updateProject = async (projectId, projectData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.updateProject(projectId, projectData);
      const project = new Project(response);
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: project });
      return project;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Удаление проекта
  const deleteProject = async (projectId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await projectsAPI.deleteProject(projectId);
      dispatch({ type: ActionTypes.DELETE_PROJECT, payload: projectId });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Создание задачи
  const createTask = async (projectId, taskData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await tasksAPI.createTask(projectId, taskData);
      const task = new Task(response);
      dispatch({ type: ActionTypes.ADD_TASK, payload: task });
      return task;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Обновление задачи
  const updateTask = async (taskId, taskData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await tasksAPI.updateTask(taskId, taskData);
      const task = new Task(response);
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: task });
      return task;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Удаление задачи
  const deleteTask = async (taskId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await tasksAPI.deleteTask(taskId);
      dispatch({ type: ActionTypes.DELETE_TASK, payload: taskId });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Обновление статуса задачи
  const updateTaskStatus = async (taskId, status) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await tasksAPI.updateTaskStatus(taskId, status);
      const task = new Task(response);
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: task });
      return task;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Обновление приоритета задачи
  const updateTaskPriority = async (taskId, priority) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await tasksAPI.updateTaskPriority(taskId, priority);
      const task = new Task(response);
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: task });
      return task;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Выход из системы
  const logout = () => {
    localStorage.removeItem('auth_token');
    dispatch({ type: ActionTypes.LOGOUT });
  };

  // Очистка ошибки
  const clearError = () => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });
  };

  const value = {
    // Состояние
    ...state,
    
    // Действия
    loadProjects,
    loadTasks,
    loadProject,
    loadProjectTasks,
    loadProjectMembers,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    logout,
    clearError,
    checkAuth,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Хук для использования контекста
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
