import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import QuestionnairePage from './QuestionnairePage';
import Map from './Map';

function Header() {
  return (
    <header className="header">
      <div className="logo-section">
        <img src="gdsclogo.png" alt="GDSC Stanford Logo" className="logo" />
        <span className="header-text">Help us find the perfect shelter for you.</span>
      </div>
      <div className="login-section">
        <button className="login-button">Shelter Login</button>
        <div className="user-icon"></div>
      </div>
    </header>
  );
}

function MainContent() {
  return (
    <div className="content">
      <MapSection />
      <Sidebar />
    </div>
  );
}


function MapSection() {
  const center = {
    lat: 37.7749,
    lng: -122.4194 // Negative for Western Hemisphere
  };
  const zoom = 15; // Adjust the zoom level as needed

  return (
    <div className="map-container">
      <Map center={center} zoom={zoom} />
      {/* <div className="map-buttons">
        <button className="browse-button">Browse Shelters Near You</button>
      </div> */}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="match-section">
        <p className="match-question">Want to be automatically matched with the best help near you?</p>
        <p className="take-questionnaire">Take this 3-minute questionnaire and let us place you with your best-matched shelters.</p>
        <Link to="/questionnaire" className="questionnaire-button">Take The Questionnaire</Link>
      </div>
      <div className="about-section">
        <p>About this Project</p>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Header />
      <MainContent />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
