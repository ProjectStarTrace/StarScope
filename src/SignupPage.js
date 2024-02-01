import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Header from './Header';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignupWithEmail = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up successfully
                navigate('/Profile'); // Navigate to the home page or dashboard
            })
            .catch((error) => {
                console.error('Signup error:', error);
                alert('Failed to sign up. Please check your email and password.');
            });
    };

    const handleSignupWithGoogle = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                navigate('/home'); // Navigate to the home page or dashboard
            })
            .catch((error) => {
                console.error('Google signup error:', error);
                alert('Failed to sign up with Google. Please try again.');
            });
    };

    return (
        <div>
            <Header />
            <h1>Sign Up</h1>
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
            <button onClick={handleSignupWithEmail}>Sign Up</button>
            <button onClick={handleSignupWithGoogle}>Sign Up with Google</button>
        </div>
    );
}

export default SignupPage;
