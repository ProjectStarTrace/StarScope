
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase'; // Adjust this import according to your project structure
import logo from './assets/StarTraceLogo_white.svg'; // Ensure this path is correct
import './Header.css'; // CSS file for styling the header
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();


    const [activeUsers, setActiveUsers] = useState(0);
    const [activeScouts, setActiveScouts] = useState(0);

    const navigate = useNavigate();

    const goToLogin = () => navigate('/login');
    const goToSignup = () => navigate('/signup');

    useEffect(() => {
        fetchActiveUsersAndScouts();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth]);

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate('/home');
        }).catch((error) => {
            console.error('Logout error', error);
        });
    };

    const fetchActiveUsersAndScouts = async () => {
        // Fetch total number of users
        const usersSnapshot = await getDocs(collection(db, "users"));
        setActiveUsers(usersSnapshot.size);
    
        let deviceIDs = new Set();
    
        for (const userDoc of usersSnapshot.docs) {
            const starscoutDataSnapshot = await getDocs(collection(db, `users/${userDoc.id}/starscoutData`));
            starscoutDataSnapshot.forEach(doc => {
                deviceIDs.add(doc.data().deviceID);
            });
        }
    
        setActiveScouts(deviceIDs.size);
    };

    return (
        <div className="header">
            <img src={logo} alt="StarTrace Logo" className="header-logo" />
            <div className="active-info">
                <p>Active Users: {activeUsers}</p>
                <p>Active Scouts: {activeScouts}</p>
            </div>
            <div className="header-buttons">
        {isLoggedIn ? (
                <>
                    <button className="auth-button" onClick={() => navigate('/profile')}>Profile</button>
                    <button className="auth-button" onClick={handleLogout}>Log Out</button>
                </>
            ) : (
                <>
                    <button className="sign-in-btn" onClick={() => navigate('/login')}>Login</button>
                    <button className="sign-up-btn" onClick={() => navigate('/signup')}>Sign Up</button>
                </>
            )}
      </div>
        </div>
    );
}

export default Header;