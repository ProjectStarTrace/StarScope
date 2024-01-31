
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase'; // Adjust this import according to your project structure
import logo from './assets/StarTraceLogo_white.svg'; // Ensure this path is correct
import './Header.css'; // CSS file for styling the header

function Header() {
    const [activeUsers, setActiveUsers] = useState(0);
    const [activeScouts, setActiveScouts] = useState(0);

    useEffect(() => {
        fetchActiveUsersAndScouts();
    }, []);

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
        <button className="sign-in-btn">Sign In</button>
        <button className="sign-up-btn">Sign Up</button>
      </div>
        </div>
    );
}

export default Header;