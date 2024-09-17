import React from 'react';
import ReactDOM from 'react-dom/client';  // Importa createRoot
import './index.css';
import App from './App';
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './sync'; // Para sincronización

// Cambia ReactDOM.render por createRoot
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);  // Crea la raíz para React 18

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}