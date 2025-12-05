import React from 'react';
import { Link } from 'react-router-dom';

const TodoList: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold">Todo List</h2>
        <p className="text-sm text-theme-text/70 mb-4">A simple todo list to capture tasks. (Placeholder)</p>
        <div className="border border-theme-primary-dark/5 rounded-md p-4 bg-theme-surface">This is a placeholder for the Todo List tool.</div>
        <div className="mt-4"><Link to="/tools" className="text-sm text-theme-primary">← Back to Tools</Link></div>
      </div>
    </div>
  );
};

export default TodoList;
