'use client'

import React, { useEffect, useRef, useState } from 'react';

import useStore from './store';
import TodoItem from './TodoItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Cursors from '@/components/cursors';

const Todo: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const { todos, addTodo, toggleTodo, deleteTodo, setAwareness, cursors } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setAwareness({
          cursor: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },    
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setAwareness]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow"
        />
        <Button type="submit">Add</Button>
      </form>
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
      <Cursors cursors={cursors} />
    </div>
  );
};

export default Todo;