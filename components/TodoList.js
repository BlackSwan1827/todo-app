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
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  purple: 'bg-purple-50 border-purple-200 text-purple-900',
  amber: 'bg-amber-50 border-amber-200 text-amber-900',
  slate: 'bg-slate-50 border-slate-200 text-slate-900',
};

const colorButtonClasses = {
  blue: 'text-blue-600 hover:bg-blue-100',
  purple: 'text-purple-600 hover:bg-purple-100',
  amber: 'text-amber-600 hover:bg-amber-100',
  slate: 'text-slate-600 hover:bg-slate-100',
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
      className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
    >
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 md:text-lg text-base"
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
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          } text-sm md:text-base`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-2 md:px-3 py-1 text-xs md:text-sm text-red-500 hover:bg-red-50 rounded transition-colors font-medium flex-shrink-0 ml-2"
      >
        Delete
      </button>
    </li>
  );
}

export default function TodoList({ todos, groups, onToggle, onDelete, onDeleteGroup, onUpdateTodoGroup }) {
  const [expandedGroups, setExpandedGroups] = useState(
    groups.reduce((acc, group) => ({ ...acc, [group]: true }), {})
  );

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
    const overId = over.id.replace('todo-', '');

    const activeTodo = todos.find(t => t.id == activeId);
    const overTodo = todos.find(t => t.id == overId);

    if (!activeTodo) return;

    // Check if dropping into a group header
    if (over.id.startsWith('group-')) {
      const targetGroup = over.id.replace('group-', '');
      if (activeTodo.group !== targetGroup) {
        onUpdateTodoGroup(activeId, targetGroup);
      }
      return;
    }

    // Check if dropping onto another todo
    if (overTodo && activeTodo.group === overTodo.group) {
      const groupTodos = groupedTodos[activeTodo.group];
      const oldIndex = groupTodos.findIndex(t => t.id == activeId);
      const newIndex = groupTodos.findIndex(t => t.id == overId);

      if (oldIndex !== newIndex) {
        const reorderedTodos = arrayMove(groupTodos, oldIndex, newIndex);
        const reorderedIds = reorderedTodos.map(t => t.id);
        
        const otherTodos = todos.filter(t => t.group !== activeTodo.group);
        const newTodos = [
          ...otherTodos,
          ...reorderedTodos,
        ];
        
        setTodos(newTodos);
      }
    } else if (overTodo && activeTodo.group !== overTodo.group) {
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
                  <h3 className="text-base md:text-lg font-semibold truncate">{group}</h3>
                  <span className="text-xs md:text-sm opacity-75 flex-shrink-0">
                    ({completedCount}/{groupTodos.length})
                  </span>
                </button>
                <button
                  onClick={() => onDeleteGroup(group)}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded transition-colors flex-shrink-0 ${colorButtonClasses[color]}`}
                >
                  Delete
                </button>
              </div>

              {isExpanded && (
                <SortableContext
                  items={[`group-${group}`, ...groupTodos.map(t => `todo-${t.id}`)]}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-2 pl-4 md:pl-8" id={`group-${group}`}>
                    {groupTodos.length === 0 ? (
                      <li className="text-gray-400 italic text-xs md:text-sm p-3 bg-white rounded-lg border border-dashed border-gray-300">
                        Drop tasks here
                      </li>
                    ) : (
                      groupTodos.map(todo => (
                        <SortableItem
                          key={todo.id}
                          todo={todo}
                          onToggle={onToggle}
                          onDelete={onDelete}
                        />
                      ))
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
          <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-blue-500 cursor-grabbing">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">⋮⋮</span>
              <input type="checkbox" checked={activeTodo.completed} disabled className="w-5 h-5 rounded" />
              <span className={activeTodo.completed ? 'line-through text-gray-400' : 'text-gray-800'}>
                {activeTodo.text}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
