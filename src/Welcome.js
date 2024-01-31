import React from 'react';
import './App.css';
import earthImage from './assets/earth.jpg';
import logo from './assets/StarTraceLogo_white.svg';

function Welcome() {
  return (
    <div className="App">
      <div className="fullscreen-bg">
        <img src={earthImage} alt="Earth" className="fullscreen-bg__image" />
        <img src={logo} alt="StarTrace Logo" className="logo" />
        <button className="open-button">Open StarScope</button>
      </div>
    </div>
  );
}

export default Welcome;
