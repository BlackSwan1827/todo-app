'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, loading]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
            <p className="text-gray-600">Stay organized and productive</p>
          </div>

          <TodoForm onAdd={addTodo} />

          <div className="my-6 flex gap-4 text-sm">
            <div className="bg-blue-50 px-4 py-2 rounded text-blue-900">
              <span className="font-semibold">{todos.length}</span> total
            </div>
            <div className="bg-green-50 px-4 py-2 rounded text-green-900">
              <span className="font-semibold">{todos.filter(t => t.completed).length}</span> done
            </div>
            <div className="bg-orange-50 px-4 py-2 rounded text-orange-900">
              <span className="font-semibold">{todos.filter(t => !t.completed).length}</span> pending
            </div>
          </div>

          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

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
