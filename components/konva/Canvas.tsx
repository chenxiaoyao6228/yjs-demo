import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Circle, Rect, Text, Line, Transformer } from 'react-konva';
import useStore from './store';
import { KonvaShape } from './YjsKonvasBinding';
import { useAwareness } from '@/lib/hooks/useAwareness';
import { KonvaEventObject } from 'konva/lib/Node';
import { debounce } from '@/lib/utils';

const ShapeComponent: React.FC<{
  shape: KonvaShape;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ shape, isSelected, onSelect }) => {
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
    onDragEnd: (e: any) => {
      // Update shape position in store
      useStore.getState().updateShape(shape.id, {
        x: e.target.x(),
        y: e.target.y(),
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
  const { setAwareness } = useAwareness(provider);
  const stageRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: any) => {
      if (stageRef.current) {
        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        if (pos) {
          setAwareness({
            cursor: {
              x: pos.x,
              y: pos.y,
            },
          });
        }
      }
    };

    const stage = stageRef.current;
    if (stage) {
      stage.on('pointermove', handlePointerMove);
    }
    return () => {
      if (stage) {
        stage.off('pointermove', handlePointerMove);
      }
    };
  }, [setAwareness]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleDragMove = debounce((evt: KonvaEventObject<DragEvent>): void => {
    const shape = evt.target;
    if (shape && shape.id) {
      updateShape(shape.id(), {
        x: shape.x(),
        y: shape.y(),
      });
    }
  }, 30);

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
            <ShapeComponent key={shape.id} shape={shape} isSelected={shape.id === selectedId} onSelect={() => handleSelect(shape.id)} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
