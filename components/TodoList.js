'use client';

import { useState } from 'react';

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

export default function TodoList({ todos, groups, onToggle, onDelete, onDeleteGroup }) {
  const [expandedGroups, setExpandedGroups] = useState(
    groups.reduce((acc, group) => ({ ...acc, [group]: true }), {})
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

  return (
    <div className="space-y-4">
      {groups.map(group => {
        const groupTodos = groupedTodos[group];
        const color = getGroupColor(group);
        const isExpanded = expandedGroups[group];
        const completedCount = groupTodos.filter(t => t.completed).length;

        return (
          <div key={group} className={`border-l-4 ${colorClasses[color]} p-4 rounded-lg`}>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => toggleGroupExpanded(group)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <span className={`text-lg transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                <h3 className="text-lg font-semibold">{group}</h3>
                <span className="text-sm opacity-75">
                  ({completedCount}/{groupTodos.length})
                </span>
              </button>
              <button
                onClick={() => onDeleteGroup(group)}
                className={`px-2 py-1 text-sm font-medium rounded transition-colors ${colorButtonClasses[color]}`}
              >
                Delete Group
              </button>
            </div>

            {isExpanded && (
              <ul className="space-y-2 pl-8">
                {groupTodos.length === 0 ? (
                  <li className="text-gray-400 italic text-sm">No tasks in this group</li>
                ) : (
                  groupTodos.map(todo => (
                    <li
                      key={todo.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => onToggle(todo.id)}
                          className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                        />
                        <span
                          className={`flex-1 ${
                            todo.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-800'
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <button
                        onClick={() => onDelete(todo.id)}
                        className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
