// src/components/Map.js
import React from 'react';
import GoogleMapReact from 'google-map-react';

const Map = ({ center, zoom }) => {
  const API_KEY = 'AIzaSyC1tpLP2wuX5tsP22ZnXO3uBNn0JEJRnx8'; // Replace with your actual Google Maps API key

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {/* You can add markers here if needed */}
      </GoogleMapReact>
    </div>
  );
};

export default Map;