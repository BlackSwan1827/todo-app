'use client';

export default function TodoList({ todos, onToggle, onDelete }) {
  const sortedTodos = [
    ...todos.filter(t => !t.completed),
    ...todos.filter(t => t.completed),
  ];

  return (
    <div className="space-y-2">
      {sortedTodos.map(todo => (
        <div
          key={todo.id}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
          />
          <span
            className={`flex-1 ${
              todo.completed
                ? 'text-gray-400 line-through'
                : 'text-gray-900'
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all font-medium"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
