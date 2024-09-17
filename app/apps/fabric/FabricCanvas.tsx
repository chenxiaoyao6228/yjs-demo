import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import useStore from './store';

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { shapes, updateAttr, removeShape } = useStore();

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
      });
    }

    return () => {
      fabricRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      shapes.forEach((shape) => {
        let fabricObject;
        if (shape.type === 'rect') {
          fabricObject = new fabric.Rect(shape);
        } else if (shape.type === 'circle') {
          fabricObject = new fabric.Circle(shape);
        }

        if (fabricObject) {
          fabricObject.set('id', shape.id);
          fabricRef.current?.add(fabricObject);

          fabricObject.on('modified', () => {
            const { left, top, width, height, radius } = fabricObject;
            updateAttr(shape.id, 'left', left);
            updateAttr(shape.id, 'top', top);
            if (shape.type === 'rect') {
              updateAttr(shape.id, 'width', width);
              updateAttr(shape.id, 'height', height);
            } else if (shape.type === 'circle') {
              updateAttr(shape.id, 'radius', radius);
            }
          });

          fabricObject.on('removed', () => {
            removeShape(shape.id);
          });
        }
      });
      fabricRef.current.renderAll();
    }
  }, [shapes, updateAttr, removeShape]);

  return (
    <canvas
      ref={canvasRef}
      className="border-2 border-gray-300 rounded-lg shadow-md bg-white"
    />
  );
};

export default FabricCanvas;