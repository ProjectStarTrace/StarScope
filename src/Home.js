import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import firebase from 'firebase/compat/app'; // Ensure this is correctly imported based on your Firebase version
import 'firebase/compat/firestore'; // Ensure this is correctly imported based on your Firebase version
import './Home.css';
import Header from './Header';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './Firebase'; // Make sure db is properly imported from your Firebase config

import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;



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
            const bounds = new mapboxgl.LngLatBounds();

            data.forEach(item => {
                // Create a popup content string or a DOM element
                const popupContent = `
                    <div>
                        <h3>StarScout Data</h3>
                        <p><strong>Scout ID:</strong> ${item.ScoutID  }</p>
                        <p><strong>Location:</strong> ${item.City}, ${item.Region}, ${item.Country}</p>
                        <p><strong>Download (mbps)</strong> ${item.DownloadSpeed} Mbps</p>
                        <p><strong>Upload (mbps)</strong> ${item.UploadSpeed} Mbps</p>
                        <p><strong>Upload Count:</strong> ${item.uploadCount}</p> 
                        <p><strong>Last Updated:</strong> ${item.DateTime}</p>
                    </div>
                `;
                const markerColor = item.rsi < 50 ? 'red' : 'green'; //Marks good or bad RSI with color
                                
                // Create a marker for each data point
                const marker = new mapboxgl.Marker({ "color": markerColor })
                    .setLngLat([item.geolocation.longitude, item.geolocation.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Set the popup
                    .addTo(mapInstance);

                // Extend the bounds to include each marker's position
                bounds.extend([item.geolocation.longitude, item.geolocation.latitude]);     
            });
            mapInstance.fitBounds(bounds, {
                padding: 175 // Adjust the padding as needed
             
            });
            
        });

  
    }, []);
  
    async function fetchStarlinkData() { //temporary patch we will need to change the format of the collection itself.
        // Create a query that orders the starscoutData by DateTime in descending order and limits the results to 100
        const q = query(collection(db, "starscoutData"), orderBy("DateTime", "desc"), limit(100));
    
        const querySnapshot = await getDocs(q);
        const starlinkDataArray = [];
    
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Assuming each document includes geolocation and DateTime fields
            if (data.geolocation && data.DateTime) {
                // Add the document data to the array
                starlinkDataArray.push({
                    ...data,
                    geolocation: {
                        latitude: data.geolocation.latitude,
                        longitude: data.geolocation.longitude
                    }
                });
            }
        });
    
        // The array now contains up to 100 of the most recent uploads, with geolocation data formatted as needed
        return starlinkDataArray;
    }
    
    
    
    return (
        <main>
            <Header />
            <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      </main>
    );
  }
  
  export default Home;