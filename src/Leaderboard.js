// Leaderboard.js
import React, { useEffect, useState } from 'react';
import { db } from './Firebase'; // Adjust this import as necessary
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Leaderboard.css';
import Header from './Header';
import leaderboardBackground from './assets/leaderboardBackground.jpg';

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            const usersCollectionRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollectionRef);
            const leaderboard = [];

            for (const userDoc of usersSnapshot.docs) {
                const starScoutDataRef = collection(db, `users/${userDoc.id}/starscoutData`);
                const starScoutSnapshot = await getDocs(starScoutDataRef);
                const entryCount = starScoutSnapshot.size; // Number of entries for this user

                if (entryCount > 0) {
                    leaderboard.push({
                        userId: userDoc.id,
                        username: userDoc.data().username, // Assuming you store usernames in the user document
                        entryCount: entryCount,
                    });
                }
            }

            // Sort by entryCount in descending order and take top 10
            const top10 = leaderboard.sort((a, b) => b.entryCount - a.entryCount).slice(0, 10);
            setLeaderboardData(top10);
        };

        fetchLeaderboardData();
    }, []);

    useEffect(() => {
        // Apply background image to the body when the component mounts
        document.body.style.backgroundImage = `url(${leaderboardBackground})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.margin = '0'; // Remove default margin
        document.body.style.height = '100%'; // Ensure height covers full page height
        document.body.style.backgroundAttachment = 'fixed'; // Optional: Fixes background during scroll

        // Cleanup function to reset the body's background when the component unmounts
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.margin = '';
            document.body.style.height = '';
            document.body.style.backgroundAttachment = '';
        };
    }, []);

    return (
        <>
        <Header />
        <div className="leaderboard-container">
            <h1 className="leaderboard-title">Leaderboard</h1>
            <ul className="leaderboard-list">
                {leaderboardData.map((user, index) => (
                    <li key={index} className="leaderboard-item">
                        <span>{index + 1}</span>
                        <strong>{user.username}</strong> {user.entryCount} StarScout uploads
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
}

export default Leaderboard;
