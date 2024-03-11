import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { db } from './Firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Header from './Header';
import './Profile.css';
import starBackground from './assets/starBackground.png';

function Profile() {
    const [deviceID, setDeviceID] = useState('');
    const [userDetails, setUserDetails] = useState({ username: '', createdAt: '' });
    const [activeScouts, setActiveScouts] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = `url(${starBackground})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate, auth]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setUserDetails({
                        username: docSnap.data().username,
                        createdAt: docSnap.data().createdAt,
                    });
                }
            } else {
                navigate('/');
            }
        };

        fetchUserDetails();
    }, [navigate, auth, user]);

    useEffect(() => {
        const fetchActiveScouts = async () => {
            if (userDetails.username) {
                const scoutsQuery = query(collection(db, "starScoutData"), where("username", "==", userDetails.username));
                const querySnapshot = await getDocs(scoutsQuery);
                const scouts = [];
                querySnapshot.forEach((doc) => {
                    scouts.push(doc.data());
                });
                setActiveScouts(scouts);
            }
        };

        fetchActiveScouts();
    }, [userDetails.username]);

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            deleteUser(user)
                .then(() => {
                    alert("Account deleted successfully.");
                    navigate('/home');
                })
                .catch((error) => {
                    console.error('Error deleting account:', error);
                    alert("Failed to delete account.");
                });
        }
    };

    const handleAddDevice = () => {
        console.log('Adding Device ID:', deviceID);
        setDeviceID('');
    };

    return (
        <>
            <Header />
            <div className="profile-container">
                {/* Account Information Section */}
                <div className="section">
                    <h2>Account Information</h2>
                    <p>Email: {user ? user.email : ''}</p>
                    <p>Username: {userDetails.username}</p>
                    <p>Date Created: {user ? user.metadata.creationTime : ''}</p>
                </div>
                {/* StarLink Metrics Section */}
                <div className="section">
                    <h2>StarLink Metrics</h2>
                    {/* Placeholder for StarLink Metrics */}
                </div>
                {/* Active Scouts Section */}
                <div className="section">
                    <h2>Active Scouts</h2>
                    {activeScouts.length > 0 ? (
                        activeScouts.map((scout, index) => (
                            <p key={index}>Scout ID: {scout.deviceID} - Data: {JSON.stringify(scout)}</p>
                        ))
                    ) : (
                        <p>No active scouts found.</p>
                    )}
                    <hr />
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
