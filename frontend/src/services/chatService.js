import axios from 'axios';
import { API_BASE_URL } from '../config';

const chatService = {
    // Get chat history
    getChatHistory: async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/chat/history/${userId}`);
        return response.data;
    },

    // Send a message
    sendMessage: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/chat`, data);
        return response.data;
    },

    // Get conversation list
    getConversations: async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/conversations/${userId}`);
        return response.data;
    },

    // Create new conversation
    createConversation: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/conversations`, data);
        return response.data;
    },

    // Get conversation messages
    getConversationMessages: async (conversationId) => {
        const response = await axios.get(
            `${API_BASE_URL}/conversations/${conversationId}/messages`
        );
        return response.data;
    },

    // Update conversation
    updateConversation: async (conversationId, data) => {
        const response = await axios.put(
            `${API_BASE_URL}/conversations/${conversationId}`,
            data
        );
        return response.data;
    },

    // Delete conversation
    deleteConversation: async (conversationId) => {
        const response = await axios.delete(
            `${API_BASE_URL}/conversations/${conversationId}`
        );
        return response.data;
    },

    // Get chat suggestions
    getChatSuggestions: async (context) => {
        const response = await axios.get(`${API_BASE_URL}/chat/suggestions`, {
            params: { context }
        });
        return response.data;
    },

    // Get chat categories
    getChatCategories: async () => {
        const response = await axios.get(`${API_BASE_URL}/chat/categories`);
        return response.data;
    },

    // Rate chat response
    rateResponse: async (messageId, rating) => {
        const response = await axios.post(
            `${API_BASE_URL}/chat/rate/${messageId}`,
            { rating }
        );
        return response.data;
    },

    // Export chat history
    exportChatHistory: async (userId, format = 'json') => {
        const response = await axios.get(
            `${API_BASE_URL}/chat/export/${userId}`,
            { params: { format } }
        );
        return response.data;
    }
};

export default chatService;
