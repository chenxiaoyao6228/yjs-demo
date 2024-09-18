import { create } from 'zustand';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoStore {
    todos: Todo[];
    ydoc: Y.Doc;
    provider: WebsocketProvider;
    clientId: string;
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
}

// Create these outside the store to ensure they're only created once
const ydoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:1234', 'todo-list', ydoc);
const yArray = ydoc.getArray<Todo>('todos');

// Add these log statements
provider.on('synced', () => {
    console.log('Initial sync completed');
});

const useStore = create<TodoStore>((set, get) => {

    yArray.observe(() => {
        console.log('yArray updated:', yArray.toArray());
        set({ todos: yArray.toArray() });
    });

    return {
        todos: yArray.toArray(),
        ydoc,
        provider,
        clientId: localStorage.getItem('clientId') || '',

        addTodo: (text) => {
            const newTodo = { id: Date.now().toString(), text, completed: false };
            yArray.push([newTodo]);
        },
        toggleTodo: (id) => {
            ydoc.transact(() => {
                const index = yArray.toArray().findIndex((todo) => todo.id === id);
                if (index !== -1) {
                    const todo = yArray.get(index);
                    todo.completed = !todo.completed;
                    yArray.delete(index, 1);
                    yArray.insert(index, [todo]);
                }
            });
        },
        deleteTodo: (id) => {
            const index = yArray.toArray().findIndex((todo) => todo.id === id);
            if (index !== -1) {
                yArray.delete(index, 1);
            }
        },

    };
});

export default useStore;