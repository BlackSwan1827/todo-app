'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';

const DEFAULT_GROUPS = ['Work', 'School', 'Errands'];

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    const savedGroups = localStorage.getItem('groups');
    
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('groups', JSON.stringify(groups));
    }
  }, [todos, groups, loading]);

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

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
            <p className="text-gray-600">Organized by category</p>
          </div>

          <TodoForm onAdd={addTodo} groups={groups} onAddGroup={addGroup} />

          <div className="my-6 flex gap-4 text-sm flex-wrap">
            <div className="bg-blue-50 px-4 py-2 rounded text-blue-900">
              <span className="font-semibold">{totalTodos}</span> total
            </div>
            <div className="bg-green-50 px-4 py-2 rounded text-green-900">
              <span className="font-semibold">{completedTodos}</span> done
            </div>
            <div className="bg-orange-50 px-4 py-2 rounded text-orange-900">
              <span className="font-semibold">{pendingTodos}</span> pending
            </div>
          </div>

          <TodoList
            todos={todos}
            groups={groups}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onDeleteGroup={deleteGroup}
          />

          {todos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
