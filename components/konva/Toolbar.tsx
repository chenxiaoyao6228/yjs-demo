import React from 'react';
import { Button } from '@/components/ui/button';
import useStore from './store';
import { Circle, Square, Trash2, Triangle, Type } from 'lucide-react';

const shapes = [
  { type: 'circle', label: 'Circle', icon: Circle },
  { type: 'rect', label: 'Rectangle', icon: Square },
  { type: 'text', label: 'Text', icon: Type },
  { type: 'triangle', label: 'Triangle', icon: Triangle },
] as const;

export default function Toolbar() {
  const addShape = useStore((state) => state.addShape);
  const clearShapes = useStore((state) => state.clearShapes);

  const handleAddShape = (type: (typeof shapes)[number]['type']) => {
    addShape({
      type,
      x: 100,
      y: 100,
      fill: type === 'text' ? 'rgb(255, 255, 255)' : 'rgb(173, 216, 230)',
      ...(type === 'circle' || type === 'rect' ? { width: 100, height: 100 } : {}),
      ...(type === 'text'
        ? {
            text: 'New Text',
            fontSize: 20,
            fontStyle: 'bold',
          }
        : {}),
    });
  };

  return (
    <div className="flex justify-center items-center">
      {shapes.map(({ type, label }) => (
        <Button key={type} onClick={() => handleAddShape(type)} className="p-2 mr-2" variant="outline" size="icon" title={`Add ${label}`}>
          {shapes.find((shape) => shape.type === type)?.icon &&
            React.createElement(shapes.find((shape) => shape.type === type)!.icon, { className: 'h-4 w-4' })}
        </Button>
      ))}
      <Button onClick={clearShapes} className="ml-2" variant="outline" size="icon" title="Clear All">
        <Trash2 className="h-4 w-4 hover:text-red-500 transition-colors" />
      </Button>
    </div>
  );
}
