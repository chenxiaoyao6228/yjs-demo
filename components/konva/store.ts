import { create } from 'zustand';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { KonvaShape, YjsKonvasBinding } from './YjsKonvasBinding';

interface StoreState {
  shapes: KonvaShape[];
  yDoc: Y.Doc;
  provider: WebsocketProvider;
  binding: YjsKonvasBinding;
  addShape: (shape: Omit<KonvaShape, 'id'>) => void;
  updateShape: (id: string, updates: Partial<KonvaShape>) => void;
  deleteShape: (id: string) => void;
}

const yDoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:1234', 'konva-room', yDoc);
const binding = new YjsKonvasBinding(provider, yDoc);

const useStore = create<StoreState>((set) => ({
  shapes: [],
  binding,
  yDoc,
  provider,
  addShape: (shape) => binding.addShape(shape),
  updateShape: (id, updates) =>
    set((state) => ({
      shapes: state.shapes.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape)),
    })),
  deleteShape: (id) => binding.deleteShape(id),
}));

binding.on('shapesChanged', (shapes) => {
  useStore.setState({ shapes });
});

export default useStore;
