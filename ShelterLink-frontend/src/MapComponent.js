import React from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const MapComponent = ({ center, zoom }) => {
  const API_KEY = 'AIzaSyC1tpLP2wuX5tsP22ZnXO3uBNn0JEJRnx8'; // Replace with your API key

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        <AnyReactComponent
          lat={center.lat}
          lng={center.lng}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
};

export default MapComponent;
