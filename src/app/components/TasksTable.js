'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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

// Компонент для отдельной задачи
function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
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
      case 'in-progress': return <FaClock className="text-blue-500" />;
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
      case 'in-progress': return 'В работе';
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
      className="bg-white rounded-xl p-4 shadow-md mb-3 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
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
function StatusColumn({ id, title, tasks, onEdit, onDelete, onToggleComplete }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 min-h-[300px] w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base">{title}</h3>
        <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-xs">
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
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              Нет задач
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
  onDelete, 
  onToggleComplete, 
  onStatusChange 
}) {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Группируем задачи по статусам (согласно API документации)
  const tasksByStatus = {
    backlog: tasks.filter(task => task.status === 'backlog'),
    todo: tasks.filter(task => task.status === 'todo' || task.status === 'pending'),
    'in-progress': tasks.filter(task => task.status === 'in_progress'),
    done: tasks.filter(task => task.status === 'done' || task.status === 'completed'),
  };

  const statusColumns = [
    { id: 'backlog', title: 'Бэклог', tasks: tasksByStatus.backlog },
    { id: 'todo', title: 'К выполнению', tasks: tasksByStatus.todo },
    { id: 'in-progress', title: 'В работе', tasks: tasksByStatus['in-progress'] },
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
    if (typeof overElement === 'string' && ['backlog', 'todo', 'in-progress', 'done'].includes(overElement)) {
      newStatus = overElement;
    } else {
      // Если перетащили на другую задачу, определяем статус по контексту
      const overTask = tasks.find(task => task.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
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
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white rounded-xl p-4 shadow-lg opacity-90 rotate-3 scale-105">
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
