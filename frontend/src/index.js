// frontend/src/index.js - React Application Entry Point

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // Imports the main Material Design 3 App component

// Find the root element where the application will be mounted
// This element must be defined in the HTML file (e.g., in public/index.html)
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      {/* The App component contains all the M3 styling and logic */}
      <App />
    </React.StrictMode>
  );
} else {
    // This logs an error if the host HTML file is missing the required mounting point
    console.error("Failed to find the root element with ID 'root'. Please ensure public/index.html is correctly configured.");
}