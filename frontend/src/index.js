import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css'; // We import our new CSS file
import App from './App.jsx';   // We import our new App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);