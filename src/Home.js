import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import firebase from 'firebase/compat/app'; // Ensure this is correctly imported based on your Firebase version
import 'firebase/compat/firestore'; // Ensure this is correctly imported based on your Firebase version
import './Home.css';
import Header from './Header';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from './Firebase'; //importing the database from Firebase const js file
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
//mapboxgl.accessToken ='pk.eyJ1Ijoic3RhcnRyYWNlIiwiYSI6ImNsczI1aGV3ZjBpaHkybHBheHFmMzhhdDYifQ.I7rvnP-qM7zkJLCBSJ0QGg'


// Set your Mapbox access token

function Home() {
    const [map, setMap] = useState(null);
  
    useEffect(() => {
      // Initialize Mapbox map
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9', // Satellite view
        center: [0, 0],
        zoom: 1
        
      });
      
      
      mapInstance.addControl(new mapboxgl.NavigationControl());
      setMap(mapInstance);
  
        // Inside useEffect or a similar setup
        fetchStarlinkData().then(data => {
            data.forEach(item => {
                // Create a popup content string or a DOM element
                const popupContent = `
                    <div>
                        <h3>StarScout Data</h3>
                        <p><strong>Device ID:</strong> ${item.deviceID  }</p>
                        <p><strong>RSI:</strong> ${item.rsi}</p>
                        <p><strong>Last Reported Speed:</strong> ${item.lastReportedSpeed} Mbps</p>
                        <p><strong>Percentage Uptime:</strong> ${item.percentageUptime}%</p>
                    </div>
                `;
                const markerColor = item.rsi < 50 ? 'red' : 'green'; //Marks good or bad RSI with color
                                
                // Create a marker for each data point
                const marker = new mapboxgl.Marker({ "color": markerColor })
                    .setLngLat([item.geolocation.longitude, item.geolocation.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Set the popup
                    .addTo(mapInstance);


                    
            });

            
        });

  
    }, []);
  
    async function fetchStarlinkData() {
        const starlinkData = [];
        const usersSnapshot = await getDocs(collection(db, "users")); // Get all user documents
    
        for (const userDoc of usersSnapshot.docs) {
            const starscoutDataSnapshot = await getDocs(collection(db, `users/${userDoc.id}/starscoutData`)); // Get starScoutData for each user
            
            
            starscoutDataSnapshot.forEach((starScoutDoc) => {
                const data = starScoutDoc.data();
        
                console.log("Fetched data:", data); // Log to inspect the data structure
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
        <main>
            <Header />
            <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      </main>
    );
  }
  
  export default Home;