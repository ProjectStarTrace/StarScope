import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './Splash';
import Home from './Home'; // Import the home component
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import Profile from './Profile';
import Leaderboard from './Leaderboard'; // Import the Leaderboard component
import WelcomePage from './WelcomePage';
import ChooseUsername from './ChooseUsername';
import UserInterest from './UserInterest';
import DownloadStarScout from './DownloadStarScout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} /> {/* Add the Home route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/onboarding/welcome" element={<WelcomePage />} />
        <Route path="/onboarding/choose-username" element={<ChooseUsername />} />
        <Route path="/onboarding/user-interest" element={<UserInterest />} />
        <Route path="/onboarding/download-starscout" element={<DownloadStarScout />} />
      </Routes>
    </Router>
  );
}

export default App;
