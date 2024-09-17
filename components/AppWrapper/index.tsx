import React, { ReactNode } from 'react';
import SideMenu from '../SideMenu';

interface AppWrapperProps {
  children: ReactNode;
  title: string;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children, title }) => {
  return (
    <div className="flex">
      <SideMenu />
      <div className="flex-1 flex justify-center mt-10">
        <main className="w-1/2 p-4">
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppWrapper;