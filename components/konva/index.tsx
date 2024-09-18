'use client';

import React from 'react';
import Toolbar from './Toolbar';
import PropertyPanel from './PropertyPanel';

import Cursor from '@/components/cursors';
import Canvas from './Canvas';
import useStore from './store';
import { useAwareness } from '@/lib/hooks/useAwareness';

export default function KonvaComp() {
  const { shapes,  provider, addShape, updateShape, deleteShape, setAwareness } = useStore();
  const { cursors } = useAwareness(provider);
  return (
    <div className="h-[800px] w-[800px]">
      <div className="flex bg-gray-100 p-2 mb-2">
        <Toolbar />
        <PropertyPanel />
      </div>
      <div className="flex-1 relative w-full">
        <Canvas />
      </div>
        <Cursor cursors={cursors}/>
    </div>
  );
}