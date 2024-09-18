import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Rect, Text, Line, Transformer } from 'react-konva';
import useStore from './store';
import { KonvaShape } from './YjsKonvasBinding';
import { useAwareness } from '@/lib/hooks/useAwareness';
import { KonvaEventObject } from 'konva/lib/Node';
import debounce from 'lodash.debounce';

interface ShapeComponentProps {
  shape: KonvaShape;
  isSelected: boolean;
  onSelect: () => void;
  updateShape: (id: string, attrs: Partial<KonvaShape>) => void;
}

const ShapeComponent: React.FC<ShapeComponentProps> = ({ shape, isSelected, onSelect, updateShape }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const commonProps = {
    onClick: onSelect,
    ref: shapeRef,
    draggable: true,
    onDragEnd: (e: KonvaEventObject<DragEvent>) => {
      updateShape(shape.id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e: KonvaEventObject<Event>) => {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      updateShape(shape.id, {
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
      });
    },
  };

  const shapeElement = (() => {
    switch (shape.type) {
      case 'circle':
        return <Circle {...shape} {...commonProps} />;
      case 'rect':
        return <Rect {...shape} {...commonProps} />;
      case 'text':
        return <Text {...shape} {...commonProps} />;
      case 'triangle':
        return <Line {...shape} {...commonProps} points={[0, 0, 50, 50, -50, 50]} closed fill={shape.fill} stroke={shape.stroke} />;
      default:
        return null;
    }
  })();

  return (
    <>
      {shapeElement}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default function Canvas() {
  const shapes = useStore((state) => state.shapes);
  const provider = useStore((state) => state.provider);
  const binding = useStore((state) => state.binding);
  const updateShape = useStore((state) => state.updateShape);
  const deleteShape = useStore((state) => state.deleteShape);
  const { setAwareness } = useAwareness(provider);
  const stageRef = useRef<any>(null);
  const selectedId = useStore((state) => state.selectedId);
  const setSelectedId = useStore((state) => state.setSelectedId);

  useEffect(() => {
    const handlePointerMove = debounce((e: PointerEvent) => {
      setAwareness({
        cursor: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    }, 16);

    window.addEventListener('pointermove', handlePointerMove);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        deleteShape(selectedId);
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      handlePointerMove.cancel(); // Cancel any pending debounced calls on cleanup
    };
  }, [setAwareness, deleteShape, selectedId, setSelectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleDragMove = (evt: KonvaEventObject<DragEvent>): void => {
    const shape = evt.target;
    if (shape && shape.id) {
      updateShape(shape.id(), {
        x: shape.x(),
        y: shape.y(),
      });
    }
  };

  return (
    <div className="inset-0 overflow-hidden">
      <Stage
        width={600}
        height={400}
        ref={stageRef}
        onClick={handleStageClick}
        onMouseDown={handleStageClick}
        onDragMove={handleDragMove}
        className="border border-gray-300 bg-gray"
      >
        <Layer>
          {shapes.map((shape) => (
            <ShapeComponent
              key={shape.id}
              shape={shape}
              isSelected={shape.id === selectedId}
              onSelect={() => handleSelect(shape.id)}
              updateShape={updateShape}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
