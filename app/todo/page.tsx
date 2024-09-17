'use client'

import Todo from '@/components/todo';
import AppWrapper from '@/components/AppWrapper';

export default function TodoPage() {
  return (
    <AppWrapper title="Collaborative Todo List">
      <Todo />
    </AppWrapper>
  );
}