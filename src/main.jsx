import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { TBShieldProvider } from './context/TBShieldContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <TBShieldProvider>
        <App />
      </TBShieldProvider>
    </ThemeProvider>
  </React.StrictMode>
);
