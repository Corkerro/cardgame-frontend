import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import Loader from "./Loader.jsx";

export default function RequireAuth() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('jwt');
            const isDevMode = import.meta.env.VITE_DEV_MODE === '1';

            if (isDevMode) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setIsAuthenticated(true);
                setLoading(false);
                return;
            }

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const baseURL = import.meta.env.VITE_API_BASE_URL;
                await axios.get(`${baseURL}/auth/check`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('jwt');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}
