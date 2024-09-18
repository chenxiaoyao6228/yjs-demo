'use client';

import React, { useState } from 'react';
import SideMenu from '@/components/sideMenu';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  const [activeTitle, setActiveTitle] = useState('Home');

  const handleActiveChange = (active: string) => {
    switch (active) {
      case '/':
        setActiveTitle('Home');
        break;
      case '/apps/todo':
        setActiveTitle('Todo');
        break;
      case '/apps/konva':
        setActiveTitle('Konva');
        break;
      default:
        setActiveTitle('Todo');
    }
  };

  return (
    <div className="flex h-screen">
      <SideMenu onActiveChange={handleActiveChange} />
      <div className="h-full flex-1 flex justify-center ">
        <main className="w-1/2 p-4">
          <h1 className="font-bold mb-4 text-3xl">{activeTitle}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
