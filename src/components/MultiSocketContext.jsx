import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

const SocketContext = createContext({});

export const MultiSocketProvider = ({ children }) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const [sockets, setSockets] = useState({});
    const [jwt, setJwt] = useState(getCookie('jwt'));

    useEffect(() => {
        const checkJwt = () => {
            const token = getCookie('jwt');
            if (token !== jwt) setJwt(token);
        };

        const interval = setInterval(checkJwt, 1000);
        return () => clearInterval(interval);
    }, [jwt]);

    useEffect(() => {
        if (!jwt) return;

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
    }, [jwt]);

    return <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>;
};

export const useNamespaceSocket = (namespace) => {
    const context = useContext(SocketContext);
    return context[namespace] || null;
};
