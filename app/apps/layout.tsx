'use client'

import React, { useState } from 'react';
import SideMenu from '@/components/sideMenu';

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeTitle, setActiveTitle] = useState('Home');

  const handleActiveChange = (active: string) => {
    switch (active) {
      case '/':
        setActiveTitle('Home');
        break;
      case '/apps/todo':
        setActiveTitle('Todo');
        break;
      case '/apps/fabric':
        setActiveTitle('Fabric');
        break;
      default:
        setActiveTitle('Home');
    }
  };

  return (
    <div className="flex h-screen">
      <SideMenu onActiveChange={handleActiveChange} />
      <div className="flex-1 flex justify-center mt-10">
        <main className="w-1/2 p-4">
          <h1 className="text-3xl font-bold mb-8">{activeTitle}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}