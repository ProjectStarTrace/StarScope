import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser, onAuthStateChanged     } from 'firebase/auth';
import Header from './Header';
import './Profile.css'

function Profile() {
    const [deviceID, setDeviceID] = useState('');   
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

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
                    <h1>Account Information</h1>
                    <p>Email: {user ? user.email : ''}</p>
                </div>
                <div className="section">
                    <h2>StarLink Metrics</h2>
                    {/* Display StarLink Metrics here */}
                </div>
                <div className="section">
                    <h2>Active Scouts</h2>
                    {/* Dynamically list active scouts here */}
                    <hr /> {/* Separating line */}
                    <div className="add-scout-subsection">
                        <h3>Add Scout Device</h3>
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
