import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Header from './Header';
import './LoginPage.css';
import GoogleSignInIcon from './assets/googleSignIn.png';
import accountAuthBackground from './assets/accountAuthBackground.png'; // Import the background image

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginWithEmail = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully
                navigate('/profile'); // Navigate to the home page or dashboard
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
                navigate('/profile'); // Navigate to the home page or dashboard
            })
            .catch((error) => {
                console.error('Google login error:', error);
                alert('Failed to log in with Google. Please try again.');
            });
    };

    return (
        <>
        <Header />
        <div className="login-container" style={{ backgroundImage: `url(${accountAuthBackground})` }}>
            <div className="login-box">
                <h1>Login</h1>
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button onClick={handleLoginWithEmail}>Log In</button>
            </div>

            <button onClick={handleLoginWithGoogle} className="google-signin-btn">
            <img src={GoogleSignInIcon} alt="Sign up with Google" />
            </button>

            <button className="use-without-account-btn" onClick={() => navigate('/home')}>Use without Account</button>
            

        </div>
        </>
    );
}

export default LoginPage;