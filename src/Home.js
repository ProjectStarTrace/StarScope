import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Home.css'; // You can create a separate CSS file for Home styles
import Header from './Header';
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcnRyYWNlIiwiYSI6ImNsczI1aGV3ZjBpaHkybHBheHFmMzhhdDYifQ.I7rvnP-qM7zkJLCBSJ0QGg'; // Replace with your Mapbox access token

function Home() {

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1 // starting zoom
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
  }, []);

  return (
    <home>
    <Header />
    <div id="map" style={{ width: '100%', height: '100vh' }}></div>
    </home>
    );
}

export default Home;
