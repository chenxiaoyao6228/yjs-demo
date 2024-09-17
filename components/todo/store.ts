'use client'

import { create } from 'zustand';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { nanoid } from 'nanoid';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export interface UserAwareness {
    clientId: string;
    name: string;
    color: string;
    cursor: { x: number; y: number } | null;
}

interface TodoStore {
    todos: Todo[];
    ydoc: Y.Doc;
    provider: WebsocketProvider;
    clientId: string;
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    setAwareness: (awareness: Partial<UserAwareness>) => void;
    cursors: UserAwareness[];
}

// Create these outside the store to ensure they're only created once
const ydoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:1234', 'todo-list', ydoc);
const yArray = ydoc.getArray<Todo>('todos');

// Add these log statements
provider.on('synced', () => {
    console.log('Initial sync completed');
});

provider.awareness.on('change', () => {
    console.log('Awareness update');
});

const randomColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF8A65', '#7986CB',
    '#9575CD', '#4DB6AC', '#81C784', '#64B5F6', '#BA68C8',
    '#4DD0E1', '#FFB74D', '#E57373', '#9CCC65', '#4FC3F7',
];

const randomNames = [
    'Alice', 'Bob', 'Charlie', 'David', 'Emma',
    'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kate', 'Liam', 'Mia', 'Noah', 'Olivia',
    'Paul', 'Quinn', 'Rachel', 'Sam', 'Tara'
];

const getRandomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// 修改clientId的生成逻辑
const getClientId = () => {
    if (typeof window === 'undefined') {
        return nanoid(); // Generate a new ID for SSR
    }

    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
        return storedClientId;
    }
    const newClientId = nanoid();
    localStorage.setItem('clientId', newClientId);
    return newClientId;
};


const useStore = create<TodoStore>((set, get) => {

    yArray.observe(() => {
        console.log('yArray updated:', yArray.toArray());
        set({ todos: yArray.toArray() });
    });

    // Initialize local user awareness
    const localUserAwareness: UserAwareness = {
        clientId: getClientId(),
        name: getRandomElement(randomNames),
        color: getRandomElement(randomColors),
        cursor: null,
    };
    provider.awareness.setLocalStateField('user', localUserAwareness);

    // Set up awareness event listener
    provider.awareness.on('change', () => {
        const awarenessStates = Array.from(provider.awareness.getStates().entries());
        set((state) => ({
            ...state,
            cursors: awarenessStates.map(([clientId, userState]) => ({
                clientId,
                ...userState.user,
            })).filter(cursor => cursor.clientId !== get().clientId),
        }));
    });

    return {
        todos: yArray.toArray(),
        ydoc,
        provider,
        clientId: getClientId(),
        cursors: [],
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
        setAwareness: (awareness: Partial<UserAwareness>) => {
            const currentAwareness = provider.awareness.getLocalState()?.user || {};
            const mergedAwareness = {
                ...currentAwareness,
                ...awareness,
                clientId: getClientId(),
                cursor: {
                    ...currentAwareness.cursor,
                    ...awareness.cursor
                }
            };
            provider.awareness.setLocalStateField('user', mergedAwareness);
        },
    };
});

export default useStore;