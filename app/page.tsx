'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TodoItem from '@/components/TodoItem';
import useStore from '@/lib/store';
import Cursors from '@/components/Cursors'; // Import the Cursors component

export default function Home() {
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
    <div ref={containerRef} className="container mx-auto mt-10 max-w-md p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Collaborative Todo List</h1>
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
}