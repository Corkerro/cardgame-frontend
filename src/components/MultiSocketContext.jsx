import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext({});

export const MultiSocketProvider = ({ children }) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const [sockets, setSockets] = useState({});

    useEffect(() => {
        const namespaces = ['matchmaking', 'game'];
        const createdSockets = {};

        namespaces.forEach((ns) => {
            const socket = io(`${baseURL}/${ns}`, {
                withCredentials: true,
            });

            socket.on('connect', () => {
                console.log(`✅ Connected to /${ns} with ID: ${socket.id}`);
            });

            socket.on('connect_error', (error) => {
                console.error(`❌ [${ns}] Connection error:`, error);
                toast.error(`${ns} connection error: ${error.message}`);
            });

            socket.onAny((event, ...args) => {
                console.log(`[${ns}] → Event: ${event}`, ...args);
            });

            createdSockets[ns] = socket;
        });

        setSockets(createdSockets);

        return () => {
            Object.values(createdSockets).forEach((socket) => socket.disconnect());
        };
    }, []);

    return <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>;
};

export const useNamespaceSocket = (namespace) => {
    const context = useContext(SocketContext);
    return context[namespace] || null;
};
