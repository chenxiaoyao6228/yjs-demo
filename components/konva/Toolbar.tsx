import React from 'react';
import { Button } from '@/components/ui/button';
import useStore from './store';

const shapes = [
  { type: 'circle', label: 'Circle' },
  { type: 'rect', label: 'Rectangle' },
  { type: 'text', label: 'Text' },
  { type: 'triangle', label: 'Triangle' },
] as const;

export default function Toolbar() {
  const addShape = useStore((state) => state.addShape);

  const handleAddShape = (type: (typeof shapes)[number]['type']) => {
    addShape({
      type,
      x: 100,
      y: 100,
      fill: 'lightblue',
      stroke: 'black',
      ...(type === 'text' ? { text: 'New Text' } : {}),
    });
  };

  return (
    <div className="flex justify-center items-center">
      {shapes.map(({ type, label }) => (
        <Button key={type} onClick={() => handleAddShape(type)} className="py-2 px-4 mr-2">
          Add {label}
        </Button>
      ))}
    </div>
  );
}
