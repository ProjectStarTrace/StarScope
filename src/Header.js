import React from 'react';
import logo from './assets/StarTraceLogo_white.svg'; // Ensure this path is correct
import './Header.css'; // CSS file for styling the header

function Header() {
  return (
    <div className="header">
      <img src={logo} alt="StarTrace Logo" className="header-logo" />
    </div>
  );
}

export default Header;
