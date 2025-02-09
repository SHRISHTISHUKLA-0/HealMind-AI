const axios = require('axios');

async function testConnection() {
    try {
        // Test registration
        console.log('Testing registration endpoint...');
        const registerResponse = await axios.post('http://localhost:3000/register', {
            name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword',
            age: 25
        });
        console.log('Registration Response:', registerResponse.data);
        console.log('✅ Backend is running and registration endpoint is working!');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Backend server is not running! Please start the server.');
        } else {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    }
}

testConnection();
