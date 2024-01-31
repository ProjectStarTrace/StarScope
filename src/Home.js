import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import firebase from 'firebase/compat/app'; // Ensure this is correctly imported based on your Firebase version
import 'firebase/compat/firestore'; // Ensure this is correctly imported based on your Firebase version
import './Home.css';
import Header from './Header';

// Firebase configuration (replace with your actual configuration)
const firebaseConfig = {
    apiKey: "AIzaSyDWti3BwY77hiuBcg_99mbQrcxvWUCZ4pk",
    authDomain: "startrace-c6da0.firebaseapp.com",
    projectId: "startrace-c6da0",
    storageBucket: "startrace-c6da0.appspot.com",
    messagingSenderId: "849765546071",
    appId: "1:849765546071:web:c9231cd790768e0a710b12",
    measurementId: "G-Q6ZXGGF536"
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcnRyYWNlIiwiYSI6ImNsczI1aGV3ZjBpaHkybHBheHFmMzhhdDYifQ.I7rvnP-qM7zkJLCBSJ0QGg'; // Replace with your Mapbox access token

function Home() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize Mapbox map
    const mapInstance = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1 // starting zoom
    });

    // Add zoom and rotation controls to the map
    mapInstance.addControl(new mapboxgl.NavigationControl());

    setMap(mapInstance);

    // Fetch and display data
    fetchAndDisplayStarlinkReceivers(mapInstance);
  }, []);

  async function fetchAndDisplayStarlinkReceivers(mapInstance) {
    const querySnapshot = await db.collection("starlink_receivers").get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { geolocation, rsi, lastReportedSpeed, percentageUptime } = data;

      // Create a marker for each receiver and add it to the map
      new mapboxgl.Marker()
      .setLngLat([geolocation.longitude, geolocation.latitude])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setText(`RSI: ${rsi}, Speed: ${lastReportedSpeed} Mbps, Uptime: ${percentageUptime}%`))
      .addTo(mapInstance);
  });
}

return (
    <main>
        <Header />
        <div id="map" style={{ width: '100%', height: '100vh' }}></div>
    </main>
);
}

export default Home;