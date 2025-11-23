// Minimal React setup needed for the 'react-scripts build' command to succeed.
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  // This is the minimal functional component that will be rendered
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Smart Wardrobe (Frontend MVP)</h1>
      <p>Deployment successful! Now connecting to API...</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);