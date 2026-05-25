import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppContextProvider } from './Context/AppContext.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
  
    <AppContextProvider>
      <App />
    </AppContextProvider>

  </BrowserRouter>
);
