import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import firebase from 'firebase/compat/app'; // Ensure this is correctly imported based on your Firebase version
import 'firebase/compat/firestore'; // Ensure this is correctly imported based on your Firebase version
import './Home.css';
import Header from './Header';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from './Firebase'; //importing the database from Firebase const js file
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
  
    async function fetchStarlinkData() {
        const starlinkDataMap = {}; // Tracks the latest entry for each ScoutID
        const uploadCounts = {}; // Tracks upload counts for each ScoutID
        
        // Perform a single read operation to get all entries
        const starscoutDataSnapshot = await getDocs(collection(db, "starscoutData"));
    
        starscoutDataSnapshot.forEach((doc) => {
            const data = doc.data();
    
            if (data.geolocation && data.DateTime) { // Ensure geolocation and DateTime data exists
                // Update upload count for each ScoutID
                if (uploadCounts[data.ScoutID]) {
                    uploadCounts[data.ScoutID]++;
                } else {
                    uploadCounts[data.ScoutID] = 1;
                }
    
                // Check if the current document's date is more recent than what we have stored
                const existingEntry = starlinkDataMap[data.ScoutID];
                if (!existingEntry || new Date(data.DateTime) > new Date(existingEntry.DateTime)) {
                    // Update the map with the more recent entry, including its upload count
                    starlinkDataMap[data.ScoutID] = {
                        ...data,
                        geolocation: {
                            latitude: data.geolocation.latitude,
                            longitude: data.geolocation.longitude
                        },
                        uploadCount: uploadCounts[data.ScoutID] // Store the upload count here
                    };
                }
            }
        });
    
        // Convert the map (object) back into an array of its values, which are the data entries
        return Object.values(starlinkDataMap);
    }
    
    
    
    
    return (
        <main>
            <Header />
            <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      </main>
    );
  }
  
  export default Home;