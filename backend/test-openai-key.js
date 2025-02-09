require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    try {
        console.log('Testing OpenAI connection...');
        console.log('API Key starts with:', process.env.OPENAI_API_KEY.substring(0, 5) + '...');
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Hello, are you working?"
                }
            ],
        });

        console.log('Success! Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.message.includes('auth')) {
            console.error('This seems to be an authentication error. Please check your API key.');
        }
    }
}

testOpenAI();
