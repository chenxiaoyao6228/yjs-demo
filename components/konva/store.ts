import { create } from 'zustand';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { KonvaShape, YjsKonvasBinding } from './YjsKonvasBinding';

interface StoreState {
  shapes: KonvaShape[];
  selectedId: string | null;
  yDoc: Y.Doc;
  provider: WebsocketProvider;
  binding: YjsKonvasBinding;
  addShape: (shape: Omit<KonvaShape, 'id'>) => void;
  updateShape: (id: string, updates: Partial<KonvaShape>) => void;
  deleteShape: (id: string) => void;
  clearShapes: () => void;
  setSelectedId: (id: string | null) => void;
}

// Separate Yjs setup
const setupYjs = () => {
  const yDoc = new Y.Doc();
  const provider = new WebsocketProvider('ws://localhost:1234', 'konva-room', yDoc);
  const binding = new YjsKonvasBinding(provider, yDoc);
  return { yDoc, provider, binding };
};

// Separate store logic
const createStore = (yjs: ReturnType<typeof setupYjs>) =>
  create<StoreState>((set) => ({
    shapes: [],
    selectedId: null,
    ...yjs,
    addShape: (shape) => yjs.binding.addShape(shape),
    updateShape: (id, updates) => yjs.binding.updateShape(id, updates),
    deleteShape: (id) => yjs.binding.deleteShape(id),
    clearShapes: () => yjs.binding.clearShapes(),
    setSelectedId: (id) => set({ selectedId: id }),
  }));

const yjs = setupYjs();
const useStore = createStore(yjs);

yjs.binding.on('shapesChanged', (shapes) => {
  useStore.setState({ shapes });
});

export default useStore;
