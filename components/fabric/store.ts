import { create } from 'zustand';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { nanoid } from 'nanoid';

interface Shape {
    id: string;
    type: string;
    [key: string]: any;
}

interface FabricStore {
    shapes: Shape[];
    cursors: { [key: string]: { x: number; y: number } };
    addShape: (shape: Omit<Shape, 'id'>) => void;
    removeShape: (id: string) => void;
    updateAttr: (id: string, attr: string, value: any) => void;
    setAwareness: (data: { cursor: { x: number; y: number } }) => void;
}

const yDoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:1234', 'fabric-room', yDoc);
const yShapes = yDoc.getArray<Shape>('shapes');
const awareness = provider.awareness;

const useStore = create<FabricStore>((set) => ({
    shapes: [],
    cursors: {},
    addShape: (shape) => {
        const newShape = { ...shape, id: nanoid() } as Shape;
        yShapes.push([newShape]);
    },
    removeShape: (id) => {
        const index = yShapes.toArray().findIndex((shape) => shape.id === id);
        if (index !== -1) {
            yShapes.delete(index, 1);
        }
    },
    updateAttr: (id, attr, value) => {
        const index = yShapes.toArray().findIndex((shape) => shape.id === id);
        if (index !== -1) {
            const shape = yShapes.get(index);
            shape[attr] = value;
            yShapes.delete(index, 1);
            yShapes.insert(index, [shape]);
        }
    },
    setAwareness: (data) => {
        awareness.setLocalStateField('user', data);
    },
}));

yShapes.observe(() => {
    useStore.setState({ shapes: yShapes.toArray() });
});

awareness.on('change', () => {
    const cursors: { [key: string]: { x: number; y: number } } = {};
    awareness.getStates().forEach((state, clientId) => {
        if (state.user && state.user.cursor) {
            cursors[clientId] = state.user.cursor;
        }
    });
    useStore.setState({ cursors });
});

export default useStore;