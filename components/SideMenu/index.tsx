import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, ListTodo, PenTool } from 'lucide-react';

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface SideMenuProps {
  onActiveChange: (active: string) => void;
}

const menuItems: MenuItem[] = [
  { href: '/', icon: <Home size={24} />, label: 'Home' },
  { href: '/apps/todo', icon: <ListTodo size={24} />, label: 'Todo' },
  { href: '/apps/fabric', icon: <PenTool size={24} />, label: 'Fabric' },
];

const SideMenu: React.FC<SideMenuProps> = ({ onActiveChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sideMenuCollapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [activeItem, setActiveItem] = useState('/');

  useEffect(() => {
    localStorage.setItem('sideMenuCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    onActiveChange(activeItem);
  }, [activeItem, onActiveChange]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (href: string) => {
    setActiveItem(href);
  };

  return (
    <nav className={`bg-gray-800 h-screen p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-40'}`}>
      <div className="flex justify-end mb-4">
        <button onClick={toggleCollapse} className="text-white hover:text-gray-300">
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center text-white hover:text-gray-300 ${isCollapsed ? 'justify-center' : ''} ${activeItem === item.href ? 'bg-gray-700' : ''}`}
              onClick={() => handleItemClick(item.href)}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-2">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideMenu;