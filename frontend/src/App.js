import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import RegisterScreen from '../components/RegisterScreen';

const App = () => {
    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            console.log('Login Success:', credentialResponse);
            // Here you would typically verify the token with your backend
            setUser(credentialResponse);
        } catch (error) {
            console.error('Login Error:', error);
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div>
                {user ? (
                    <div>
                        <h1>Welcome!</h1>
                        {/* Add your chat component here */}
                    </div>
                ) : isRegistered ? (
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => console.log('Login Failed')}
                    />
                ) : (
                    <RegisterScreen onRegister={() => setIsRegistered(true)} />
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default App;
