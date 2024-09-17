'use client'

import Todo from '@/components/todo';

export default function TodoPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Collaborative Todo List</h1>
      <Todo />
    </div>
  );
}