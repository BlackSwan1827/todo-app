'use client';

import { useState } from 'react';

export default function TodoForm({ onAdd, groups, onAddGroup }) {
  const [input, setInput] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(groups[0] || 'Work');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input, selectedGroup);
      setInput('');
    }
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onAddGroup(newGroupName);
      setSelectedGroup(newGroupName);
      setNewGroupName('');
      setShowNewGroup(false);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        />
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm md:text-base"
        >
          {groups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm md:text-base"
        >
          Add
        </button>
      </form>

      <div>
        {!showNewGroup ? (
          <button
            onClick={() => setShowNewGroup(true)}
            className="text-sm md:text-base text-blue-500 hover:text-blue-600 font-medium"
          >
            + New Group
          </button>
        ) : (
          <form onSubmit={handleAddGroup} className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name..."
              autoFocus
              className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowNewGroup(false)}
              className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
