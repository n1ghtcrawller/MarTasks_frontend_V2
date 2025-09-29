// API клиент для Telegram Task Tracker
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://keybasicsneutral.ru';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Установить токен аутентификации
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Получить токен из localStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || this.token;
    }
    return this.token;
  }

  // Базовый метод для HTTP запросов
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET запрос
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  // POST запрос
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT запрос
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE запрос
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // PATCH запрос
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Создаем экземпляр API клиента
const apiClient = new ApiClient();

// API методы для аутентификации
export const authAPI = {
  // Telegram логин
  telegramLogin: (initData) => 
    apiClient.post('/auth/telegram-login', { init_data: initData }),

  // Получить текущего пользователя
  getCurrentUser: () => 
    apiClient.get('/users/me'),

  // Обновить профиль
  updateProfile: (data) => 
    apiClient.put('/users/me', data),
};

// API методы для проектов
export const projectsAPI = {
  // Получить все проекты пользователя
  getProjects: (page = 1, perPage = 10) => 
    apiClient.get('/projects/', { page, per_page: perPage }),

  // Создать новый проект
  createProject: (data) => 
    apiClient.post('/projects/', data),

  // Получить проект по ID
  getProject: (projectId) => 
    apiClient.get(`/projects/${projectId}`),

  // Получить проект по UID
  getProjectByUid: (projectUid) => 
    apiClient.get(`/projects/uid/${projectUid}`),

  // Обновить проект
  updateProject: (projectId, data) => 
    apiClient.put(`/projects/${projectId}`, data),

  // Удалить проект
  deleteProject: (projectId) => 
    apiClient.delete(`/projects/${projectId}`),

  // Получить участников проекта
  getProjectMembers: (projectId) => 
    apiClient.get(`/projects/${projectId}/members`),

  // Пригласить пользователя в проект
  inviteToProject: (projectId, data) => 
    apiClient.post(`/projects/${projectId}/invite`, data),

  // Изменить роль участника
  updateMemberRole: (projectId, userId, role) => 
    apiClient.put(`/projects/${projectId}/members/${userId}/role`, { role }),

  // Удалить участника из проекта
  removeMember: (projectId, userId) => 
    apiClient.delete(`/projects/${projectId}/members/${userId}`),

  // Покинуть проект
  leaveProject: (projectId) => 
    apiClient.post(`/projects/${projectId}/leave`),
};

// API методы для задач
export const tasksAPI = {
  // Получить задачи проекта
  getProjectTasks: (projectId, page = 1, perPage = 10) => 
    apiClient.get(`/tasks/projects/${projectId}/tasks`, { page, per_page: perPage }),

  // Получить мои задачи
  getMyTasks: (page = 1, perPage = 10) => 
    apiClient.get('/tasks/tasks/my', { page, per_page: perPage }),

  // Создать задачу
  createTask: (projectId, data) => 
    apiClient.post(`/tasks/projects/${projectId}/tasks`, data),

  // Получить задачу по ID
  getTask: (taskId) => 
    apiClient.get(`/tasks/tasks/${taskId}`),

  // Обновить задачу
  updateTask: (taskId, data) => 
    apiClient.put(`/tasks/tasks/${taskId}`, data),

  // Удалить задачу
  deleteTask: (taskId) => 
    apiClient.delete(`/tasks/tasks/${taskId}`),

  // Назначить задачу пользователю
  assignTask: (taskId, userId) => 
    apiClient.post(`/tasks/tasks/${taskId}/assign`, { user_id: userId }),

  // Взять задачу себе
  takeTask: (taskId) => 
    apiClient.post(`/tasks/tasks/${taskId}/take`),

  // Изменить статус задачи
  updateTaskStatus: (taskId, status) => 
    apiClient.put(`/tasks/tasks/${taskId}/status`, { status }),

  // Изменить приоритет задачи
  updateTaskPriority: (taskId, priority) => 
    apiClient.put(`/tasks/tasks/${taskId}/priority`, { priority }),

  // Получить статистику задач проекта
  getProjectTaskStatistics: (projectId) => 
    apiClient.get(`/tasks/projects/${projectId}/tasks/statistics`),
};
