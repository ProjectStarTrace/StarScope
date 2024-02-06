import React, { useState } from 'react';
import { db } from './Firebase'; // Ensure correct import path
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function ChooseUsername() {
    const [username, setUsername] = useState('');
    const [isTaken, setIsTaken] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const checkUsername = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setIsTaken(true);
        } else {
            // Username is not taken, update the user's document with the new username
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, {
                    username: username
                }).then(() => {
                    navigate('/onboarding/user-interest'); // Proceed to the next step
                }).catch((error) => {
                    console.error("Error updating document: ", error);
                });
            }
        }
    };

    return (
        <div className="onboarding-fullscreen">
            <h1>Choose a Username</h1>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            {isTaken && <p>This username is already taken. Please choose another.</p>}
            <button onClick={checkUsername}>Next</button>
        </div>
    );
}

export default ChooseUsername;
