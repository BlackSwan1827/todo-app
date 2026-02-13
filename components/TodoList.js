'use client';

export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul className="space-y-2">
      {todos.length === 0 ? (
        <li className="text-gray-400 italic text-center py-4">
          No todos yet. Add one to get started!
        </li>
      ) : (
        todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
                className="w-5 h-5 text-blue-500 rounded cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  todo.done
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
  );
}
