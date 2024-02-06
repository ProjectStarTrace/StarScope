import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react'; // Ensure you've installed qrcode.react

function DownloadStarScout() {
    const navigate = useNavigate();

    return (
        <div className="onboarding-fullscreen">
            <h1>Download StarScout</h1>
            <QRCode value="https://startrace.dev/downloads" />
            <p>Scan to download StarScout for a better experience with StarLink.</p>
            <button onClick={() => navigate('/home')}>Explore</button>
        </div>
    );
}

export default DownloadStarScout;
