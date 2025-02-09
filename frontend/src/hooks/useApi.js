import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();

    const execute = useCallback(async (...params) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunc(...params);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            if (err.response?.status === 401) {
                logout();
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunc, logout]);

    return {
        data,
        error,
        loading,
        execute
    };
};

export const useApiWithPolling = (apiFunc, interval = 5000) => {
    const [polling, setPolling] = useState(false);
    const api = useApi(apiFunc);

    const startPolling = useCallback(async (...params) => {
        setPolling(true);
        while (polling) {
            try {
                await api.execute(...params);
                await new Promise(resolve => setTimeout(resolve, interval));
            } catch (error) {
                console.error('Polling error:', error);
                setPolling(false);
            }
        }
    }, [api, interval, polling]);

    const stopPolling = () => {
        setPolling(false);
    };

    return {
        ...api,
        polling,
        startPolling,
        stopPolling
    };
};
