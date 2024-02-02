// Leaderboard.js
import React, { useEffect, useState } from 'react';
import { db } from './Firebase'; // Adjust this import as necessary
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Leaderboard.css';
import Header from './Header';

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
