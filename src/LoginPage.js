import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginWithEmail = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully
                navigate('/Profile'); // Navigate to the home page or dashboard
            })
            .catch((error) => {
                console.error('Login error:', error);
                alert('Failed to log in. Please check your email and password.');
            });
    };

    const handleLoginWithGoogle = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                navigate('/Profile'); // Navigate to the home page or dashboard
            })
            .catch((error) => {
                console.error('Google login error:', error);
                alert('Failed to log in with Google. Please try again.');
            });
    };

    return (
        <div>
            <h1>Login</h1>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
            />
            <button onClick={handleLoginWithEmail}>Log In</button>
            <button onClick={handleLoginWithGoogle}>Log In with Google</button>
        </div>
    );
}

export default LoginPage;
