import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error
            if (error.response.status === 401) {
                // Unauthorized - clear local storage and redirect to login
                localStorage.clear();
                window.location.href = '/login';
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'No response from server. Please check your internet connection.',
            });
        } else {
            // Request setup error
            return Promise.reject({
                message: 'Error setting up the request.',
            });
        }
    }
);

export const auth = {
    register: async (userData) => {
        return await api.post('/api/auth/register', userData);
    },
    login: async (credentials) => {
        const response = await api.post('/api/auth/login', credentials);
        if (response.token) {
            localStorage.setItem('token', response.token);
        }
        return response;
    },
    logout: async () => {
        localStorage.removeItem('token');
        return await api.post('/api/auth/logout');
    },
    getProfile: async () => {
        return await api.get('/api/auth/profile');
    },
    updateProfile: async (data) => {
        return await api.put('/api/auth/profile', data);
    }
};

export const chat = {
    sendMessage: async (message) => {
        return await api.post('/api/chat/message', { message });
    },
    getHistory: async () => {
        return await api.get('/api/chat/history');
    },
    deleteHistory: async () => {
        return await api.delete('/api/chat/history');
    }
};

export const mood = {
    saveMood: async (moodData) => {
        return await api.post('/api/mood', moodData);
    },
    getHistory: async (filters) => {
        return await api.get('/api/mood/history', { params: filters });
    },
    getStats: async () => {
        return await api.get('/api/mood/stats');
    },
    deleteMood: async (moodId) => {
        return await api.delete(`/api/mood/${moodId}`);
    }
};

export const meditation = {
    saveSession: async (sessionData) => {
        return await api.post('/api/meditation/session', sessionData);
    },
    getSessions: async () => {
        return await api.get('/api/meditation/sessions');
    },
    getStats: async () => {
        return await api.get('/api/meditation/stats');
    },
    updateProgress: async (sessionId, progress) => {
        return await api.put(`/api/meditation/session/${sessionId}`, { progress });
    }
};

export const breathing = {
    savePattern: async (patternData) => {
        return await api.post('/api/breathing/pattern', patternData);
    },
    getPatterns: async () => {
        return await api.get('/api/breathing/patterns');
    },
    updatePattern: async (patternId, data) => {
        return await api.put(`/api/breathing/pattern/${patternId}`, data);
    },
    deletePattern: async (patternId) => {
        return await api.delete(`/api/breathing/pattern/${patternId}`);
    }
};

export const goals = {
    create: async (goalData) => {
        return await api.post('/api/goals', goalData);
    },
    getAll: async () => {
        return await api.get('/api/goals');
    },
    update: async (goalId, data) => {
        return await api.put(`/api/goals/${goalId}`, data);
    },
    delete: async (goalId) => {
        return await api.delete(`/api/goals/${goalId}`);
    },
    updateProgress: async (goalId, progress) => {
        return await api.put(`/api/goals/${goalId}/progress`, { progress });
    }
};

export const sleep = {
    saveJournal: async (journalData) => {
        return await api.post('/api/sleep/journal', journalData);
    },
    getJournals: async (filters) => {
        return await api.get('/api/sleep/journals', { params: filters });
    },
    updateJournal: async (journalId, data) => {
        return await api.put(`/api/sleep/journal/${journalId}`, data);
    },
    getStats: async () => {
        return await api.get('/api/sleep/stats');
    }
};

// Health check
export const checkHealth = async () => {
    return await api.get('/api/health');
};

// Retry mechanism for failed requests
export const retryRequest = async (apiCall, maxRetries = 3) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;
            if (i === maxRetries - 1) break;
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
    throw lastError;
};

export default api;
