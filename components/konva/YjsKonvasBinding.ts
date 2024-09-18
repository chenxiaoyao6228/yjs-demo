import { EventEmitter } from 'events';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { nanoid } from 'nanoid';

export interface KonvaShape {
  id: string;
  type: 'circle' | 'rect' | 'text' | 'triangle';
  x: number;
  y: number;
  fill: string;
  stroke: string;
  [key: string]: unknown;
}

export class YjsKonvasBinding extends EventEmitter {
  private yShapes: Y.Array<KonvaShape>;

  constructor(
    private provider: WebsocketProvider,
    private yDoc: Y.Doc
  ) {
    super();
    this.yShapes = yDoc.getArray<KonvaShape>('shapes');
    this.bindEvents();
  }

  private bindEvents() {
    this.yShapes.observe(() => {
      this.emit('shapesChanged', this.yShapes.toArray());
    });
  }

  addShape(shape: Omit<KonvaShape, 'id'>) {
    const newShape = { ...shape, id: nanoid() } as KonvaShape;
    this.yShapes.push([newShape]);
  }

  updateShape(id: string, attrs: Partial<KonvaShape>) {
    const index = this.yShapes.toArray().findIndex((shape) => shape.id === id);
    if (index !== -1) {
      const shape = this.yShapes.get(index);
      const updatedShape = { ...shape, ...attrs };
      this.yShapes.delete(index, 1);
      this.yShapes.insert(index, [updatedShape]);
    }
  }

  deleteShape(id: string) {
    const index = this.yShapes.toArray().findIndex((shape) => shape.id === id);
    if (index !== -1) {
      this.yShapes.delete(index, 1);
    }
  }

  getShapes(): KonvaShape[] {
    return this.yShapes.toArray();
  }
}
