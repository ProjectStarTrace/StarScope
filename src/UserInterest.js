import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserInterest() {
    const navigate = useNavigate();

    const handleInterest = (hasStarLink) => {
        if (hasStarLink) {
            // If they have StarLink, direct them to download StarScout
            navigate('/onboarding/download-starscout');
        } else {
            // Interested users go straight to explore
            navigate('/home');
        }
    };

    return (
        <div className="onboarding-fullscreen">
            <h1>Your Interest</h1>
            <p>Do you already have StarLink internet or are you just exploring?</p>
            <button onClick={() => handleInterest(true)}>I have StarLink</button>
            <button onClick={() => handleInterest(false)}>Just Exploring</button>
        </div>
    );
}

export default UserInterest;
