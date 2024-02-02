import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser, onAuthStateChanged     } from 'firebase/auth';
import Header from './Header';

function Profile() {
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

    return (
        <div>
            <Header />
            <h1>Profile</h1>
            <p>Email: {user ? user.email : "No user logged in"}</p>
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
}

export default Profile;
