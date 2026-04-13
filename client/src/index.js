import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Render ứng dụng React vào div#root trong index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
