// Типы данных на основе OpenAPI схемы Telegram Task Tracker

// Роли в проекте
export const ProjectRole = {
  OWNER: 'owner',
  ADMIN: 'admin', 
  MEMBER: 'member',
  VIEWER: 'viewer'
};

// Статусы задач
export const TaskStatus = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

// Приоритеты задач
export const TaskPriority = {
  VERY_LOW: 'very_low',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  BLOCKER: 'blocker'
};

// Пользователь
export class User {
  constructor(data) {
    this.id = data.id;
    this.telegramId = data.telegram_id;
    this.username = data.username;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.verifiedStatus = data.verified_status;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  get fullName() {
    return [this.firstName, this.lastName].filter(Boolean).join(' ') || this.username || 'Пользователь';
  }

  get displayName() {
    return this.firstName || this.username || 'Пользователь';
  }
}

// Проект
export class Project {
  constructor(data) {
    this.id = data.id;
    this.uid = data.uid;
    this.name = data.name;
    this.description = data.description;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.owner = data.owner ? new User(data.owner) : null;
    this.membersCount = data.members_count;
  }

  get progress() {
    // Вычисляем прогресс на основе задач (если есть статистика)
    return 0; // Будет обновлено при получении статистики
  }
}

// Участник проекта
export class ProjectMember {
  constructor(data) {
    this.id = data.id;
    this.projectId = data.project_id;
    this.userId = data.user_id;
    this.role = data.role;
    this.joinedAt = data.joined_at;
    this.user = data.user ? new User(data.user) : null;
  }
}

// Задача
export class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.projectId = data.project_id;
    this.assignedTo = data.assigned_to;
    this.status = data.status;
    this.priority = data.priority;
    this.dueDate = data.due_date ? new Date(data.due_date) : null;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.creator = data.creator ? new User(data.creator) : null;
    this.assignee = data.assignee ? new User(data.assignee) : null;
  }

  get isCompleted() {
    return this.status === TaskStatus.DONE;
  }

  get isOverdue() {
    if (!this.dueDate || this.isCompleted) return false;
    return new Date() > this.dueDate;
  }

  get statusText() {
    const statusMap = {
      [TaskStatus.BACKLOG]: 'Бэклог',
      [TaskStatus.TODO]: 'К выполнению',
      [TaskStatus.IN_PROGRESS]: 'В работе',
      [TaskStatus.DONE]: 'Выполнено'
    };
    return statusMap[this.status] || this.status;
  }

  get priorityText() {
    const priorityMap = {
      [TaskPriority.VERY_LOW]: 'Очень низкий',
      [TaskPriority.LOW]: 'Низкий',
      [TaskPriority.MEDIUM]: 'Средний',
      [TaskPriority.HIGH]: 'Высокий',
      [TaskPriority.BLOCKER]: 'Блокер'
    };
    return priorityMap[this.priority] || this.priority;
  }

  get priorityColor() {
    const colorMap = {
      [TaskPriority.VERY_LOW]: 'text-gray-500',
      [TaskPriority.LOW]: 'text-green-500',
      [TaskPriority.MEDIUM]: 'text-yellow-500',
      [TaskPriority.HIGH]: 'text-orange-500',
      [TaskPriority.BLOCKER]: 'text-red-500'
    };
    return colorMap[this.priority] || 'text-gray-500';
  }

  get statusColor() {
    const colorMap = {
      [TaskStatus.BACKLOG]: 'text-gray-500',
      [TaskStatus.TODO]: 'text-blue-500',
      [TaskStatus.IN_PROGRESS]: 'text-yellow-500',
      [TaskStatus.DONE]: 'text-green-500'
    };
    return colorMap[this.status] || 'text-gray-500';
  }
}

// Статистика задач проекта
export class ProjectTaskStatistics {
  constructor(data) {
    this.total = data.total || 0;
    this.backlog = data.backlog || 0;
    this.todo = data.todo || 0;
    this.inProgress = data.in_progress || 0;
    this.done = data.done || 0;
  }

  get progressPercentage() {
    if (this.total === 0) return 0;
    return Math.round((this.done / this.total) * 100);
  }
}

// Ответы API с пагинацией
export class PaginatedResponse {
  constructor(data, itemClass) {
    this.items = data.items ? data.items.map(item => new itemClass(item)) : [];
    this.total = data.total || 0;
    this.page = data.page || 1;
    this.perPage = data.per_page || 10;
  }

  get totalPages() {
    return Math.ceil(this.total / this.perPage);
  }

  get hasNextPage() {
    return this.page < this.totalPages;
  }

  get hasPreviousPage() {
    return this.page > 1;
  }
}

// Утилиты для работы с данными
export const dataUtils = {
  // Преобразовать данные пользователя
  transformUser: (data) => new User(data),
  
  // Преобразовать данные проекта
  transformProject: (data) => new Project(data),
  
  // Преобразовать данные задачи
  transformTask: (data) => new Task(data),
  
  // Преобразовать список с пагинацией
  transformPaginated: (data, itemClass) => new PaginatedResponse(data, itemClass),
  
  // Получить цвет статуса
  getStatusColor: (status) => {
    const colorMap = {
      [TaskStatus.BACKLOG]: 'bg-gray-100 text-gray-600',
      [TaskStatus.TODO]: 'bg-blue-100 text-blue-600',
      [TaskStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-600',
      [TaskStatus.DONE]: 'bg-green-100 text-green-600'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-600';
  },
  
  // Получить цвет приоритета
  getPriorityColor: (priority) => {
    const colorMap = {
      [TaskPriority.VERY_LOW]: 'bg-gray-100 text-gray-600',
      [TaskPriority.LOW]: 'bg-green-100 text-green-600',
      [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-600',
      [TaskPriority.HIGH]: 'bg-orange-100 text-orange-600',
      [TaskPriority.BLOCKER]: 'bg-red-100 text-red-600'
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-600';
  },
  
  // Форматировать дату
  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU');
  },
  
  // Форматировать дату и время
  formatDateTime: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('ru-RU');
  }
};
