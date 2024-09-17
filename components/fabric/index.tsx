'use client'

import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import useStore from './store';
import FabricCanvas from './FabricCanvas';
import Cursors from '../todo/Cursors';


const Fabric: React.FC = () => {
  const { addShape, cursors, setAwareness } = useStore();
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

  const handleAddRectangle = () => {
    addShape({
      type: 'rect',
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'red',
    });
  };

  const handleAddCircle = () => {
    addShape({
      type: 'circle',
      left: 200,
      top: 200,
      radius: 50,
      fill: 'blue',
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-4 space-x-2">
        <Button onClick={handleAddRectangle}>Add Rectangle</Button>
        <Button onClick={handleAddCircle}>Add Circle</Button>
      </div>
      <FabricCanvas />
      {/* <Cursors cursors={cursors} /> */}
    </div>
  );
};

export default Fabric;