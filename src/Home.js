import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import firebase from 'firebase/compat/app'; // Ensure this is correctly imported based on your Firebase version
import 'firebase/compat/firestore'; // Ensure this is correctly imported based on your Firebase version
import './Home.css';
import Header from './Header';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from './Firebase'; //importing the database from Firebase const js file


// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcnRyYWNlIiwiYSI6ImNsczI1aGV3ZjBpaHkybHBheHFmMzhhdDYifQ.I7rvnP-qM7zkJLCBSJ0QGg'; // Replace with your Mapbox access token


function Home() {
    const [map, setMap] = useState(null);
  
    useEffect(() => {
      // Initialize Mapbox map
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 1
      });
  
      mapInstance.addControl(new mapboxgl.NavigationControl());
      setMap(mapInstance);
  
      // Fetch data from Firestore and display it on the map
      fetchStarlinkData().then(data => {
        data.forEach(item => {
          const { geolocation } = item;
          new mapboxgl.Marker()
            .setLngLat([geolocation.longitude, geolocation.latitude])
            .addTo(mapInstance);
        });
      });
  
    }, []);
  
    async function fetchStarlinkData() {
        const starlinkData = [];
        const usersSnapshot = await getDocs(collection(db, "users")); // Get all user documents
    
        for (const userDoc of usersSnapshot.docs) {
            const starScoutDataSnapshot = await getDocs(collection(db, `users/${userDoc.id}/starScoutData`)); // Get starScoutData for each user
            starScoutDataSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.geolocation) { // Check if geolocation data exists
                    starlinkData.push({
                        ...data,
                        geolocation: {
                            latitude: data.geolocation.latitude,
                            longitude: data.geolocation.longitude
                        }
                    });
                }
            });
        }
    
        return starlinkData;
    }
    
    return (
        <home>
            <Header />
            <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      </home>
    );
  }
  
  export default Home;