'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  PointerEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  FaCheck, 
  FaClock, 
  FaExclamationTriangle, 
  FaEdit, 
  FaTrash,
  FaGripVertical,
  FaFolder
} from 'react-icons/fa';

// Компонент для отдельной задачи
function TaskCard({ task, onEdit, onView, onDelete, onToggleComplete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  };

  const handleClick = (e) => {
    // Предотвращаем клик при перетаскивании
    if (isDragging) {
      e.preventDefault();
      return;
    }
    
    // Предотвращаем открытие модального окна при клике на кнопки
    if (e.target.closest('button')) return;
    
    onView(task.id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl p-4 shadow-md mb-3 transition-all select-none ${
        isDragging 
          ? 'cursor-grabbing scale-105 shadow-lg' 
          : 'cursor-pointer hover:shadow-lg'
      }`}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className={`
              mt-1 p-2 rounded-lg transition-colors
              ${task.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
              }
            `}
          >
            <FaCheck className="text-sm" />
          </button>
          
          <div className="flex-1">
            <h4 className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{task.description || 'Без описания'}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {task.assignee ? task.assignee.displayName : 'Не назначено'}
              </span>
              <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                {task.priorityText}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          {getStatusIcon(task.status)}
          <span className={`
            ${task.status === 'completed' ? 'text-green-600' :
              task.status === 'in-progress' ? 'text-blue-600' : 'text-yellow-600'}
          `}>
            {getStatusText(task.status)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
        <span>
          {task.dueDate ? `До ${task.dueDate.toLocaleDateString('ru-RU')}` : 'Без дедлайна'}
        </span>
        <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task.id);
            }}
            className="text-[#7370fd] hover:text-[#7370fd]/80"
          >
            <FaEdit className="text-sm" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-red-500 hover:text-red-600"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Компонент для колонки статуса
function StatusColumn({ id, title, tasks, onEdit, onView, onDelete, onToggleComplete }) {
  // Определяем, является ли колонка активной для перетаскивания
  const isDragTarget = ['todo', 'in_progress', 'done'].includes(id);
  
  // Настраиваем droppable зону только для активных колонок
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    disabled: !isDragTarget,
  });
  
  return (
    <div 
      ref={setNodeRef}
      className={`rounded-xl p-4 min-h-[300px] w-full transition-colors ${
        isDragTarget 
          ? isOver 
            ? 'bg-blue-50 border-2 border-blue-300' 
            : 'bg-gray-50'
          : 'bg-gray-100 opacity-75'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-sm md:text-base ${
          isDragTarget 
            ? 'text-gray-800' 
            : 'text-gray-500'
        }`}>
          {title}
          {!isDragTarget && (
            <span className="ml-2 text-xs text-gray-400">(только просмотр)</span>
          )}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs ${
          isDragTarget 
            ? 'bg-white text-gray-600' 
            : 'bg-gray-200 text-gray-500'
        }`}>
          {tasks.length}
        </span>
      </div>
      
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
          {tasks.length === 0 && (
            <div className={`text-center text-sm py-8 ${
              isDragTarget 
                ? 'text-gray-400' 
                : 'text-gray-300'
            }`}>
              {isOver ? 'Отпустите задачу здесь' : 'Нет задач'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// Основной компонент таблицы задач
export default function TasksTable({ 
  tasks, 
  onEdit, 
  onView,
  onDelete, 
  onToggleComplete, 
  onStatusChange 
}) {
  const [activeId, setActiveId] = useState(null);
  
  // Кастомный сенсор для long press
  const longPressSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 500, // 500ms задержка для long press
      tolerance: 5, // Допустимое движение во время задержки
    },
  });

  const sensors = useSensors(
    longPressSensor,
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Группируем задачи по статусам (согласно API документации)
  const tasksByStatus = {
    backlog: tasks.filter(task => task.status === 'backlog'),
    todo: tasks.filter(task => task.status === 'todo' || task.status === 'pending'),
    'in_progress': tasks.filter(task => task.status === 'in_progress'),
    done: tasks.filter(task => task.status === 'done' || task.status === 'completed'),
  };

  const statusColumns = [
    { id: 'backlog', title: 'Бэклог', tasks: tasksByStatus.backlog },
    { id: 'todo', title: 'К выполнению', tasks: tasksByStatus.todo },
    { id: 'in_progress', title: 'В работе', tasks: tasksByStatus['in_progress'] },
    { id: 'done', title: 'Выполнено', tasks: tasksByStatus.done },
  ];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    // Определяем новый статус на основе того, в какую колонку перетащили
    let newStatus = activeTask.status;
    
    // Проверяем, в какую колонку перетащили задачу
    const overElement = over.id;
    
    // Если перетащили в колонку (droppable зону)
    if (typeof overElement === 'string' && ['todo', 'in_progress', 'done'].includes(overElement)) {
      newStatus = overElement;
    } 
    // Если перетащили на другую задачу, определяем статус по контексту
    else {
      const overTask = tasks.find(task => task.id === over.id);
      if (overTask && ['todo', 'in_progress', 'done'].includes(overTask.status)) {
        newStatus = overTask.status;
      } else {
        // Если перетащили в недопустимую колонку, не меняем статус
        return;
      }
    }

    // Если статус изменился, вызываем callback
    if (newStatus !== activeTask.status) {
      onStatusChange(active.id, newStatus);
    }
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusColumns.map((column) => (
            <StatusColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white rounded-xl p-4 shadow-lg opacity-90 scale-105">
              <div className="flex items-center space-x-2 mb-2">
                <FaGripVertical className="text-gray-400" />
                <span className="font-semibold text-gray-800">{activeTask.title}</span>
              </div>
              <p className="text-sm text-gray-600">{activeTask.description || 'Без описания'}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
