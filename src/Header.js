
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase'; // Adjust this import according to your project structure
import logo from './assets/StarTraceLogo_white.svg'; // Ensure this path is correct
import './Header.css'; // CSS file for styling the header
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';



function Header() {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase(); // Convert to lowercase


    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();
    const [activeUsers, setActiveUsers] = useState(0);
    const [activeScouts, setActiveScouts] = useState(0);

    const navigate = useNavigate();
    const goToLogin = () => navigate('/login');
    const goToSignup = () => navigate('/signup');
    const goToHome = () => navigate('/Home');
    
    const isAuthPage = currentPath === '/login' || currentPath === '/signup';
    const isProfilePage = currentPath === '/profile';

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

    const navigateHome = () => {
        navigate('/home');
    };

    const fetchActiveUsersAndScouts = async () => {
        // Fetch total number of users
        const usersSnapshot = await getDocs(collection(db, "users"));
        setActiveUsers(usersSnapshot.size);
    
        let ScoutIDs = new Set();
    
        for (const userDoc of usersSnapshot.docs) {
            const starscoutDataSnapshot = await getDocs(collection(db, `starscoutData`));
            starscoutDataSnapshot.forEach(doc => {
                ScoutIDs.add(doc.data().ScoutID);
            });
        }
    
        setActiveScouts(ScoutIDs.size);
    };

    return (
        <div className="header">
            <img src={logo} alt="StarTrace Logo" onClick={navigateHome} className="header-logo" />

            
            {isLoggedIn && isProfilePage ? (
                <div classname ="header-buttons">
                <button className="auth-button" onClick={goToHome}>View Scope</button>
                <button className="auth-button" onClick={handleLogout}>Log Out</button>
                </div>
            ): !isAuthPage && (
            <>
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
                    ):
                    (
                    <>
                        <button className="sign-in-btn" onClick={() => navigate('/login')}>Login</button>
                        <button className="sign-up-btn" onClick={() => navigate('/signup')}>Sign Up</button>
                    </>
                    )}
                    </div>
            </>
            )}

            
        </div>
    );
}

export default Header;