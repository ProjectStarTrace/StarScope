import React from 'react';
import logo from './assets/StarTraceLogo_white.svg'; // Ensure this path is correct
import './Header.css'; // CSS file for styling the header

function Header() {
  return (
    <div className="header">
      <img src={logo} alt="StarTrace Logo" className="header-logo" />
      <div className="header-buttons">
        <button className="sign-in-btn">Sign In</button>
        <button className="sign-up-btn">Sign Up</button>
      </div>
    </div>
  );
}

export default Header;
