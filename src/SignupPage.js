import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Header from './Header';
import { db } from './Firebase'; // Make sure this import points to your Firebase config file
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './SignupPage.css'; // Assuming you have a CSS file for this component

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // New state for username
    const navigate = useNavigate();

    const handleSignupWithEmail = async () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                // Store user info in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    username: username, // Store the username
                });
                navigate('/profile');
            })
            .catch((error) => {
                console.error('Signup error:', error);
                alert('Failed to sign up. Please check your details.');
            });
    };

    const handleSignupWithGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                // Check if user already exists in Firestore before adding
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(doc(db, "users", user.uid), {
                        email: user.email,
                        username: username, // This assumes you prompt for a username after Google sign-up as well
                    });
                }
                navigate('/profile');
            })
            .catch((error) => {
                console.error('Google signup error:', error);
                alert('Failed to sign up with Google. Please try again.');
            });
    };

    return (
        <>
        <Header />
        <div className="signup-container">
            <div className="signup-box">
                <h1>Sign Up</h1>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button onClick={handleSignupWithEmail}>Sign Up</button>
                <button onClick={handleSignupWithGoogle}>Sign Up with Google</button>
            </div>
            <button className="use-without-account-btn" onClick={() => navigate('/home  ')}>Use without Account</button>
        </div>
        </>
    );
}

export default SignupPage;