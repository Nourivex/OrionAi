import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Trash2, Circle, CheckCircle2 } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('orion-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('orion-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: newTodo.trim(), completed: false, createdAt: new Date() }
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="p-6 bg-theme-bg min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/tool" className="p-2 rounded-lg hover:bg-theme-surface/60 transition-colors text-theme-text/70 hover:text-theme-text">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Todo List</h1>
            <p className="text-sm text-theme-text/60">Manage tasks and track progress</p>
          </div>
        </div>

        <div className="bg-theme-surface/40 border border-theme-primary-dark/10 rounded-2xl overflow-hidden">
          {/* Add Todo */}
          <div className="p-4 border-b border-theme-primary-dark/10">
            <form
              onSubmit={(e) => { e.preventDefault(); addTodo(); }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 bg-theme-bg border border-theme-primary-dark/10 rounded-xl text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
              />
              <button
                type="submit"
                disabled={!newTodo.trim()}
                className="px-4 py-3 bg-theme-primary text-theme-onPrimary rounded-xl hover:bg-theme-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-theme-primary-dark/10 bg-theme-bg/30">
            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    filter === f
                      ? 'bg-theme-primary text-theme-onPrimary'
                      : 'text-theme-text/60 hover:text-theme-text hover:bg-theme-surface'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                Clear completed
              </button>
            )}
          </div>

          {/* Todo Items */}
          <div className="divide-y divide-theme-primary-dark/5">
            {filteredTodos.length === 0 ? (
              <div className="py-12 text-center">
                <Check size={32} className="mx-auto mb-3 text-theme-text/20" />
                <p className="text-theme-text/50">
                  {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks`}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-4 p-4 group hover:bg-theme-surface/30 transition-colors ${
                    todo.completed ? 'bg-theme-primary/5' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 transition-colors ${
                      todo.completed ? 'text-green-500' : 'text-theme-text/30 hover:text-theme-primary'
                    }`}
                  >
                    {todo.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                  <span
                    className={`flex-1 text-theme-text transition-all ${
                      todo.completed ? 'line-through opacity-50' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-theme-text/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          <div className="px-4 py-3 bg-theme-bg/30 border-t border-theme-primary-dark/10">
            <p className="text-sm text-theme-text/50">
              {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
              {completedCount > 0 && ` • ${completedCount} completed`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
