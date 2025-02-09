import axios from 'axios';
import { API_BASE_URL } from '../config';

const moodService = {
    // Get user's mood entries
    getMoodEntries: async (userId, params = {}) => {
        const response = await axios.get(`${API_BASE_URL}/mood/${userId}`, { params });
        return response.data;
    },

    // Add a new mood entry
    addMoodEntry: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/mood`, data);
        return response.data;
    },

    // Get mood statistics
    getMoodStats: async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/mood/stats/${userId}`);
        return response.data;
    },

    // Get mood trends
    getMoodTrends: async (userId, timeframe = 'week') => {
        const response = await axios.get(
            `${API_BASE_URL}/mood/trends/${userId}`,
            { params: { timeframe } }
        );
        return response.data;
    },

    // Update mood entry
    updateMoodEntry: async (entryId, data) => {
        const response = await axios.put(
            `${API_BASE_URL}/mood/${entryId}`,
            data
        );
        return response.data;
    },

    // Delete mood entry
    deleteMoodEntry: async (entryId) => {
        const response = await axios.delete(`${API_BASE_URL}/mood/${entryId}`);
        return response.data;
    },

    // Get mood suggestions
    getMoodSuggestions: async (mood) => {
        const response = await axios.get(
            `${API_BASE_URL}/mood/suggestions`,
            { params: { mood } }
        );
        return response.data;
    },

    // Get mood categories
    getMoodCategories: async () => {
        const response = await axios.get(`${API_BASE_URL}/mood/categories`);
        return response.data;
    },

    // Export mood data
    exportMoodData: async (userId, format = 'json') => {
        const response = await axios.get(
            `${API_BASE_URL}/mood/export/${userId}`,
            { params: { format } }
        );
        return response.data;
    }
};

export default moodService;
