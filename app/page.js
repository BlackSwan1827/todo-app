'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';

const DEFAULT_GROUPS = ['Work', 'School', 'Errands'];

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    const savedGroups = localStorage.getItem('groups');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('groups', JSON.stringify(groups));
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }
  }, [todos, groups, darkMode, loading]);

  const addTodo = (text, group) => {
    const newTodo = {
      id: Date.now(),
      text,
      group: group || 'Work',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const addGroup = (groupName) => {
    if (groupName && !groups.includes(groupName)) {
      setGroups([...groups, groupName]);
    }
  };

  const renameGroup = (oldName, newName) => {
    if (newName && newName !== oldName && !groups.includes(newName)) {
      setGroups(groups.map(g => g === oldName ? newName : g));
      setTodos(todos.map(t => t.group === oldName ? { ...t, group: newName } : t));
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const deleteGroup = (groupName) => {
    setGroups(groups.filter(g => g !== groupName));
    setTodos(todos.filter(t => t.group !== groupName));
  };

  const updateTodoGroup = (todoId, newGroup) => {
    setTodos(todos.map(todo =>
      todo.id == todoId ? { ...todo, group: newGroup } : todo
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 md:py-8 px-3 md:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8">
            <div className="flex items-center justify-between mb-6 md:mb-8 gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">My Tasks</h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Drag tasks between groups</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex-shrink-0"
                title="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            <TodoForm onAdd={addTodo} groups={groups} onAddGroup={addGroup} />

            <div className="my-6 flex gap-2 md:gap-4 text-xs md:text-sm flex-wrap">
              <div className="bg-blue-50 dark:bg-blue-900 px-3 md:px-4 py-2 md:py-3 rounded text-blue-900 dark:text-blue-200">
                <span className="font-semibold">{totalTodos}</span> total
              </div>
              <div className="bg-green-50 dark:bg-green-900 px-3 md:px-4 py-2 md:py-3 rounded text-green-900 dark:text-green-200">
                <span className="font-semibold">{completedTodos}</span> done
              </div>
              <div className="bg-orange-50 dark:bg-orange-900 px-3 md:px-4 py-2 md:py-3 rounded text-orange-900 dark:text-orange-200">
                <span className="font-semibold">{pendingTodos}</span> pending
              </div>
            </div>

            <TodoList
              todos={todos}
              groups={groups}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onDeleteGroup={deleteGroup}
              onUpdateTodoGroup={updateTodoGroup}
              onRenameGroup={renameGroup}
            />

            {todos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
