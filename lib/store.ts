import { create } from 'zustand';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoStore {
    todos: Todo[];
    ydoc: Y.Doc;
    provider: WebrtcProvider;
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
}

const useStore = create<TodoStore>((set, get) => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider('todo-list', ydoc);
    const yarray = ydoc.getArray<Todo>('todos');

    yarray.observe(() => {
        set({ todos: yarray.toArray() });
    });

    return {
        todos: [],
        ydoc,
        provider,
        addTodo: (text) => {
            const newTodo = { id: Date.now().toString(), text, completed: false };
            yarray.push([newTodo]);
        },
        toggleTodo: (id) => {
            const index = yarray.toArray().findIndex((todo) => todo.id === id);
            if (index !== -1) {
                yarray.get(index).completed = !yarray.get(index).completed;
            }
        },
        deleteTodo: (id) => {
            const index = yarray.toArray().findIndex((todo) => todo.id === id);
            if (index !== -1) {
                yarray.delete(index, 1);
            }
        },
    };
});

export default useStore;