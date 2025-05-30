import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const socketIo = io(baseURL, {
            withCredentials: true,
        });

        socketIo.on('connect', () => {
            console.log('Connected with ID:', socketIo.id);
        });

        socketIo.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            toast.error(
                <div>
                    <div style={{ fontWeight: 'bold' }}>Socket connection error!</div>
                    <div style={{ fontSize: '0.9rem' }}>
                        {error.message || 'Failed to connect to server'}
                    </div>
                </div>,
            );
        });

        socketIo.on('error', (error) => {
            console.error('Socket error:', error);
            toast.error(
                <div>
                    <div style={{ fontWeight: 'bold' }}>Socket error!</div>
                    <div style={{ fontSize: '0.9rem' }}>
                        {error.message || 'An unexpected socket error occurred'}
                    </div>
                </div>,
            );
        });

        socketIo.onAny((event, ...args) => {
            console.log(`[Socket Event] ${event}:`, ...args);
        });

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    return useContext(SocketContext);
};
