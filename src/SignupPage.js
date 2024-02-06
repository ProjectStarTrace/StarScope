import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Header from './Header';
import { db } from './Firebase'; // Make sure this import points to your Firebase config file
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './SignupPage.css'; // Assuming you have a CSS file for this component
import GoogleSignInIcon from './assets/googleSignIn.png';
import accountAuthBackground from './assets/accountAuthBackground.png'; // Import the background image

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // New state for username
    const [errorMessage, setErrorMessage] = useState(''); // State to handle error messages
    const navigate = useNavigate();

    const handleSignupWithEmail = async () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    username: username,
                });
                navigate('/onboarding/welcome');
            })
            .catch((error) => {
                console.error('Signup error:', error);
                setErrorMessage('Failed to sign up. Please check your details.');
            });
    };

    const handleSignupWithGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                // Attempt to fetch the user document to see if it already exists
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
    
                if (docSnap.exists()) {
                    // User document exists, meaning they've already signed up
                    setErrorMessage('An account already exists with the same email. Please sign in.');
                    // Here, you might want to navigate to a sign-in page or handle this case differently
                } else {
                    // No document for this user, meaning they're a new Google sign-in user
                    await setDoc(doc(db, "users", user.uid), {
                        email: user.email,
                        // Optionally prompt for a username later since Google sign-in doesn't provide one
                    });
                    navigate('/onboarding/welcome');
                }
            })
            .catch((error) => {
                // This catch will now primarily catch network issues or other unexpected errors
                console.error('Google sign-in error:', error);
                setErrorMessage('An error occurred during Google sign-in. Please try again.');
            });
    };
    
    return (
        <>
            <Header />
            <div className="signup-container" style={{ backgroundImage: `url(${accountAuthBackground})` }}>
                <div className="signup-box">
                    <h1>Sign Up</h1>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={handleSignupWithEmail}>Sign Up</button>
                    {errorMessage && (
                    <div className="error-message">
                        <p>{errorMessage}</p>
                        <button onClick={() => navigate('/login')} className="signin-redirect-btn">
                            Log In Instead
                        </button>
                    </div>
)}

                </div>

                <button onClick={handleSignupWithGoogle} className="google-signin-btn">
                    <img src={GoogleSignInIcon} alt="Sign up with Google" />
                </button>

                <button className="use-without-account-btn" onClick={() => navigate('/home')}>Use without Account</button>
            </div>
        </>
    );
}

export default SignupPage;
