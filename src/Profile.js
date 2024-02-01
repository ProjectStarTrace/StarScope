import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser } from 'firebase/auth';

function Profile() {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

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
            <h1>Profile</h1>
            <p>Email: {user ? user.email : "No user logged in"}</p>
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
}

export default Profile;
