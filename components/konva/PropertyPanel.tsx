import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useStore from './store';

export default function PropertyPanel() {
  const selectedId = useStore((state) => state.selectedId);
  const shapes = useStore((state) => state.shapes);
  const updateShape = useStore((state) => state.updateShape);

  const selectedShape = shapes.find((shape) => shape.id === selectedId);

  const handleChange = (attr: string, value: string | number) => {
    if (selectedId) {
      updateShape(selectedId, { [attr]: value });
    }
  };

  if (!selectedShape) return null;

  return (
    <div className="ml-4 space-y-4">
      <h2 className="text-lg font-semibold">Properties</h2>
      <div className="space-y-2">
        <Label htmlFor="x">X</Label>
        <Input id="x" type="number" value={selectedShape.x} onChange={(e) => handleChange('x', Number(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="y">Y</Label>
        <Input id="y" type="number" value={selectedShape.y} onChange={(e) => handleChange('y', Number(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fill">Fill Color</Label>
        <Input id="fill" type="color" value={selectedShape.fill || '#000000'} onChange={(e) => handleChange('fill', e.target.value)} />
      </div>
    </div>
  );
}
