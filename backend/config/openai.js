const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateResponse(prompt) {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    "role": "system", 
                    "content": "You are a mental health support chatbot. Respond with empathy and understanding, but make it clear you are not a replacement for professional mental health care."
                },
                { 
                    "role": "user", 
                    "content": prompt 
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        return completion.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}

module.exports = { generateResponse };
