import { useState, useEffect, useCallback, useMemo } from 'react';
import { WebsocketProvider } from 'y-websocket';
import { nanoid } from 'nanoid';

export interface UserAwareness {
    clientId: string;
    name: string;
    color: string;
    cursor: { x: number; y: number } | null;
}

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

const getClientId = () => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
        return storedClientId;
    }
    const newClientId = nanoid();
    localStorage.setItem('clientId', newClientId);
    return newClientId;
};

export function useAwareness(provider: WebsocketProvider) {
    const [cursors, setCursors] = useState<UserAwareness[]>([]);

    const localUserAwareness = useMemo(() => ({
        clientId: getClientId(),
        name: getRandomElement(randomNames),
        color: getRandomElement(randomColors),
        cursor: null,
    }), []); // Empty dependency array means this will only be created once

    const setAwareness = useCallback((awareness: Partial<UserAwareness>) => {
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
    }, [provider]);

    useEffect(() => {
        provider.awareness.setLocalStateField('user', localUserAwareness);

        const handleAwarenessUpdate = () => {
            const awarenessStates = Array.from(provider.awareness.getStates().entries());
            setCursors(awarenessStates.map(([clientId, userState]) => ({
                clientId,
                ...userState.user,
            }))
                .filter(cursor => cursor.clientId !== localUserAwareness.clientId));
        };

        provider.awareness.on('change', handleAwarenessUpdate);

        return () => {
            provider.awareness.off('change', handleAwarenessUpdate);
        };
    }, [provider, localUserAwareness]);

    return { cursors, setAwareness };
}