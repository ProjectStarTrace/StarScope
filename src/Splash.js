import React from 'react';
import './App.css';
import earthImage from './assets/earth.jpg';
import logo from './assets/StarTraceLogo_white.svg';
import { useNavigate } from 'react-router-dom';



function Splash() {
    let navigate = useNavigate();
    
    const goToHome = () => {
        console.log("Attempting to navigate to /home");
        navigate('/home');
      };
      
  return (
    <div className="App">
      <div className="fullscreen-bg">
        <img src={earthImage} alt="Earth" className="fullscreen-bg__image" />
        <img src={logo} alt="StarTrace Logo" className="logo" />
        <button className="open-button" onClick={goToHome}>Open StarScope</button>
      </div>
    </div>
  );
}

export default Splash;
