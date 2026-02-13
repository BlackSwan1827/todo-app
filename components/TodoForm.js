'use client';

import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      setError('Task cannot be empty');
      return;
    }

    if (input.length > 200) {
      setError('Task must be less than 200 characters');
      return;
    }

    onAdd(input.trim());
    setInput('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={200}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <p className="text-gray-500 text-xs">{input.length}/200</p>
    </form>
  );
}
