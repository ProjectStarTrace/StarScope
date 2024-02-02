import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser, onAuthStateChanged} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './Firebase'; // Ensure this points to your Firestore setup

import Header from './Header';
import './Profile.css'
import starBackground from './assets/starBackground.png'; // Adjust the path as needed

function Profile() {
    const [deviceID, setDeviceID] = useState('');  
    const [userDetails, setUserDetails] = useState({ username: '', createdAt: '' }); 
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
    // Set the background style dynamically when the component mounts
    document.body.style.backgroundImage = `url(${starBackground})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    // Cleanup: Reset the background style when the component unmounts
    return () => {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
    };
}, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // No user is signed in, redirect to home
                navigate('/');
            }
            // If user is signed in, you can access the user object here, if needed
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, [navigate, auth]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setUserDetails({
                        username: docSnap.data().username,
                        createdAt: docSnap.data().createdAt,
                    });
                } else {
                    console.log("No such document!");
                }
            } else {
                navigate('/');
            }
        };

        fetchUserDetails();
    }, [navigate, auth]);

    const handleDeleteAccount = () => {
        // Confirm before deleting the account
        if (window.confirm("Are you sure you want to delete your account?")) {
            deleteUser(user)
                .then(() => {
                    alert("Account deleted successfully.");
                    navigate('/home'); // Redirect to signup page after deletion
                })
                .catch((error) => {
                    console.error('Error deleting account:', error);
                    alert("Failed to delete account.");
                });
        }
    };


    const handleAddDevice = () => {
        console.log('Adding Device ID:', deviceID);
        // Implement the logic to add the Scout DeviceID to your database
        setDeviceID(''); // Reset input field after adding
    };


    return (
        <>
            <Header />
            <div className="profile-container">
                <div className="section">
                <h2>Account Information</h2>
                    <p>Email: {user ? user.email : ''}</p>
                    <p>Username: {userDetails.username}</p>
                    <p>Date Created: {user ? user.metadata.creationTime : ''}</p>
                    
                </div>
                <div className="section">
                    <h2>StarLink Metrics</h2>
                    <p>Placeholder unit data is added</p>
                    {/* Display StarLink Metrics here */}
                </div>
                <div className="section">
                    <h2>Active Scouts</h2>
                    {/* Dynamically list active scouts here */}
                    <p>PLACEHOLDER1</p>
                    <p>PLACEHOLDER2</p>
                    <p>PLACEHOLDER3</p>
                    <hr /> {/* Separating line */}
                    <div className="add-scout-subsection">
                        <h3>Add New Scout Device</h3>
                        <input 
                            type="text" 
                            value={deviceID} 
                            onChange={(e) => setDeviceID(e.target.value)} 
                            placeholder="Enter Scout DeviceID"
                        />
                        <button onClick={handleAddDevice}>Add</button>
                    </div>
                </div>
                <button onClick={handleDeleteAccount} className="delete-account-btn">Delete Account</button>
            </div>
        </>
    );
    
}

export default Profile;
