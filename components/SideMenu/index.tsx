import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, ListTodo, PenTool } from 'lucide-react';

const SideMenu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`bg-gray-800 h-screen p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex justify-end mb-4">
        <button onClick={toggleCollapse} className="text-white hover:text-gray-300">
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <ul className="space-y-4">
        <li>
          <Link href="/" className={`flex items-center text-white hover:text-gray-300 ${isCollapsed ? 'justify-center' : ''}`}>
            <Home size={24} />
            {!isCollapsed && <span className="ml-2">Home</span>}
          </Link>
        </li>
        <li>
          <Link href="/todo" className={`flex items-center text-white hover:text-gray-300 ${isCollapsed ? 'justify-center' : ''}`}>
            <ListTodo size={24} />
            {!isCollapsed && <span className="ml-2">Todo</span>}
          </Link>
        </li>
        <li>
          <Link href="/fabric" className={`flex items-center text-white hover:text-gray-300 ${isCollapsed ? 'justify-center' : ''}`}>
            <PenTool size={24} />
            {!isCollapsed && <span className="ml-2">Fabric</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideMenu;