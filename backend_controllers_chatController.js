const axios = require('axios');
const Conversation = require('../models/Conversation');

exports.getResponse = async (req, res) => {
    const { userId, message } = req.body;

    try {
        const openaiResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: message,
            max_tokens: 150,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const chatbotMessage = openaiResponse.data.choices[0].text.trim();

        const conversation = await Conversation.findOne({ userId });
        if (conversation) {
            conversation.messages.push({ sender: 'user', text: message });
            conversation.messages.push({ sender: 'bot', text: chatbotMessage });
            await conversation.save();
        } else {
            const newConversation = new Conversation({
                userId,
                messages: [
                    { sender: 'user', text: message },
                    { sender: 'bot', text: chatbotMessage }
                ]
            });
            await newConversation.save();
        }

        res.json({ message: chatbotMessage });
    } catch (error) {
        res.status(400).json({ error: 'Error fetching chatbot response' });
    }
};