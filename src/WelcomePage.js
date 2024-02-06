// WelcomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

function WelcomePage() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate('/onboarding/choose-username'); // Navigate to the next onboarding step
    };

    return (
        <div className="onboarding-fullscreen">
            <h1>Welcome to StarScope!</h1>
            <p>Discover the universe with your personalized account.</p>
            <button onClick={handleNext}>Next</button>
        </div>
    );
}

export default WelcomePage;
