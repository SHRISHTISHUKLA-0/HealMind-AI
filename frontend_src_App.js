import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import Chat from './components/Chat';

const App = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const handleLoginSuccess = async (response) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/google', { tokenId: response.tokenId });
            setUser(res.data.user);
            setToken(res.data.token);
        } catch (error) {
            console.error('Login failed: ', error);
        }
    };

    const handleLoginFailure = (response) => {
        console.error('Login failed: ', response);
    };

    return (
        <div>
            {user ? (
                <Chat user={user} token={token} />
            ) : (
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={handleLoginSuccess}
                    onFailure={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                />
            )}
        </div>
    );
};

export default App;