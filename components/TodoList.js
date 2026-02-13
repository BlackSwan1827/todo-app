'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const GROUP_COLORS = {
  'Work': 'blue',
  'School': 'purple',
  'Errands': 'amber',
};

const getGroupColor = (group) => {
  return GROUP_COLORS[group] || 'slate';
};

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-200',
  purple: 'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-200',
  amber: 'bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-700 text-amber-900 dark:text-amber-200',
  slate: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200',
};

const colorButtonClasses = {
  blue: 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800',
  purple: 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800',
  amber: 'text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800',
  slate: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
};

function SortableItem({ todo, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `todo-${todo.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 md:p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 md:text-lg text-base"
          title="Drag to reorder or move to another group"
        >
          ⋮⋮
        </button>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 md:w-6 md:h-6 rounded cursor-pointer accent-blue-500 flex-shrink-0"
        />
        <span
          className={`flex-1 break-words ${
            todo.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-800 dark:text-gray-200'
          } text-sm md:text-base`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-2 md:px-3 py-1 text-xs md:text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors font-medium flex-shrink-0 ml-2"
      >
        Delete
      </button>
    </li>
  );
}

function DropZone({ groupId }) {
  const {
    setNodeRef,
    isOver,
  } = useSortable({ id: `drop-zone-${groupId}` });

  return (
    <li
      ref={setNodeRef}
      className={`text-gray-400 dark:text-gray-500 italic text-xs md:text-sm p-4 md:p-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed transition-all ${
        isOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
          : 'border-gray-300 dark:border-gray-600'
      }`}
    >
      {isOver ? '✓ Drop here' : 'Drop tasks here'}
    </li>
  );
}

export default function TodoList({ todos, groups, onToggle, onDelete, onDeleteGroup, onUpdateTodoGroup, onRenameGroup }) {
  const [expandedGroups, setExpandedGroups] = useState(
    groups.reduce((acc, group) => ({ ...acc, [group]: true }), {})
  );

  const [editingGroup, setEditingGroup] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleGroupExpanded = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const startEditingGroup = (group) => {
    setEditingGroup(group);
    setEditingName(group);
  };

  const saveGroupName = () => {
    if (editingName.trim() && editingName !== editingGroup) {
      onRenameGroup(editingGroup, editingName);
    }
    setEditingGroup(null);
    setEditingName('');
  };

  const groupedTodos = groups.reduce((acc, group) => {
    acc[group] = todos.filter(t => t.group === group);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.replace('todo-', '');
    const activeTodo = todos.find(t => t.id == activeId);

    if (!activeTodo) return;

    if (over.id.startsWith('drop-zone-')) {
      const targetGroup = over.id.replace('drop-zone-', '');
      if (activeTodo.group !== targetGroup) {
        onUpdateTodoGroup(activeId, targetGroup);
      }
      return;
    }

    const overId = over.id.replace('todo-', '');
    const overTodo = todos.find(t => t.id == overId);

    if (!overTodo) return;

    if (activeTodo.group !== overTodo.group) {
      onUpdateTodoGroup(activeId, overTodo.group);
    }
  };

  const activeTodo = activeId ? todos.find(t => `todo-${t.id}` === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {groups.map(group => {
          const groupTodos = groupedTodos[group];
          const color = getGroupColor(group);
          const isExpanded = expandedGroups[group];
          const completedCount = groupTodos.filter(t => t.completed).length;
          const isEditing = editingGroup === group;

          return (
            <div key={group} className={`border-l-4 ${colorClasses[color]} p-3 md:p-4 rounded-lg`}>
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <button
                  onClick={() => toggleGroupExpanded(group)}
                  className="flex items-center gap-2 md:gap-3 flex-1 text-left min-w-0"
                >
                  <span className={`text-lg md:text-xl transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveGroupName}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveGroupName();
                        if (e.key === 'Escape') setEditingGroup(null);
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 text-base md:text-lg font-semibold rounded border border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <h3 className="text-base md:text-lg font-semibold truncate">{group}</h3>
                  )}
                  <span className="text-xs md:text-sm opacity-75 flex-shrink-0">
                    ({completedCount}/{groupTodos.length})
                  </span>
                </button>
                <div className="flex gap-1 flex-shrink-0">
                  {!isEditing && (
                    <button
                      onClick={() => startEditingGroup(group)}
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded transition-colors ${colorButtonClasses[color]}`}
                      title="Edit group name"
                    >
                      ✎
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteGroup(group)}
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded transition-colors ${colorButtonClasses[color]}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isExpanded && (
                <SortableContext
                  items={[`drop-zone-${group}`, ...groupTodos.map(t => `todo-${t.id}`)]}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-2 pl-4 md:pl-8">
                    {groupTodos.length === 0 ? (
                      <DropZone groupId={group} />
                    ) : (
                      <>
                        {groupTodos.map(todo => (
                          <SortableItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggle}
                            onDelete={onDelete}
                          />
                        ))}
                      </>
                    )}
                  </ul>
                </SortableContext>
              )}
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTodo ? (
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg border-2 border-blue-500 cursor-grabbing">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">⋮⋮</span>
              <input type="checkbox" checked={activeTodo.completed} disabled className="w-5 h-5 rounded" />
              <span className={activeTodo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}>
                {activeTodo.text}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
