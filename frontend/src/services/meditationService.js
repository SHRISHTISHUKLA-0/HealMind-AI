import axios from 'axios';
import { API_BASE_URL } from '../config';

const meditationService = {
    // Get meditation sessions
    getSessions: async () => {
        const response = await axios.get(`${API_BASE_URL}/meditation-sessions`);
        return response.data;
    },

    // Start a new meditation session
    startSession: async (sessionData) => {
        const response = await axios.post(`${API_BASE_URL}/meditation-sessions`, sessionData);
        return response.data;
    },

    // End a meditation session
    endSession: async (sessionId, data) => {
        const response = await axios.put(
            `${API_BASE_URL}/meditation-sessions/${sessionId}/end`,
            data
        );
        return response.data;
    },

    // Get meditation statistics
    getStats: async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/meditation-sessions/stats/${userId}`);
        return response.data;
    },

    // Get meditation history
    getHistory: async (userId, params) => {
        const response = await axios.get(`${API_BASE_URL}/meditation-sessions/history/${userId}`, {
            params
        });
        return response.data;
    },

    // Get meditation recommendations
    getRecommendations: async (userId) => {
        const response = await axios.get(
            `${API_BASE_URL}/meditation-sessions/recommendations/${userId}`
        );
        return response.data;
    },

    // Rate a meditation session
    rateSession: async (sessionId, rating) => {
        const response = await axios.post(
            `${API_BASE_URL}/meditation-sessions/${sessionId}/rate`,
            { rating }
        );
        return response.data;
    },

    // Get meditation guides
    getGuides: async () => {
        const response = await axios.get(`${API_BASE_URL}/meditation-sessions/guides`);
        return response.data;
    },

    // Save meditation notes
    saveNotes: async (sessionId, notes) => {
        const response = await axios.post(
            `${API_BASE_URL}/meditation-sessions/${sessionId}/notes`,
            { notes }
        );
        return response.data;
    }
};

export default meditationService;
