import './globals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ContextProvider from './context/ContextProvider';
import CalendarContextWrapper from './context/CalendarContextWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
  <CalendarContextWrapper>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </CalendarContextWrapper>
  </ContextProvider>
);

reportWebVitals();
