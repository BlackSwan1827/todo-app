'use client';

import { useState } from 'react';

const FUNNY_TODOS = [
  'Contemplate the meaning of life',
  'Pet a cat (if you have one)',
  'Stare at the ceiling for 10 minutes',
  'Practice your evil laugh',
  'Eat snacks while pretending to work',
  'Convince a plant to grow faster',
  'Have a staring contest with yourself',
  'Reorganize your bookshelf for no reason',
  'Teach your pet to do taxes',
  'Become best friends with your rubber duck',
  'Question all your life choices',
  'Learn to walk backwards',
  'Argue with autocorrect',
  'Make a sandwich with your eyes closed',
  'Pretend you\'re in a movie scene',
  'Find the meaning of "Wednesday"',
  'Yell at clouds (optional)',
  'Invent a new dance move',
  'Talk to plants about their feelings',
  'Wonder why we park in driveways',
  'Count how many times you blink today',
  'Write a poem about socks',
  'Befriend a cloud',
  'Try to lick your own elbow',
  'Make friends with the dust bunnies',
];

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

  const addRandomTodo = () => {
    const randomTodo = FUNNY_TODOS[Math.floor(Math.random() * FUNNY_TODOS.length)];
    onAdd(randomTodo, selectedGroup);
  };

  return (
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
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
        <button
          type="button"
          onClick={addRandomTodo}
          className="px-3 md:px-4 py-2 md:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm md:text-base"
          title="Add a funny random todo"
        >
          🎲
        </button>
      </form>

      <div>
        {!showNewGroup ? (
          <button
            onClick={() => setShowNewGroup(true)}
            className="text-sm md:text-base text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium"
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
              className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
              className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
