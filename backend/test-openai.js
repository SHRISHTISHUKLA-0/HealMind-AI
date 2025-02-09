require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    try {
        console.log('Testing OpenAI API connection...');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a mental health support chatbot."
                },
                {
                    role: "user",
                    content: "Hello, can you help me?"
                }
            ],
            max_tokens: 50
        });

        console.log('API Test Successful!');
        console.log('Response:', completion.choices[0].message.content);
        return true;
    } catch (error) {
        console.error('API Test Failed!');
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        return false;
    }
}

testOpenAI();
