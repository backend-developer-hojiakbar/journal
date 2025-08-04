import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// BU QATOR O'ZGARTIRILDI: .tsx kengaytmasi olib tashlandi
import { AuthProvider } from './context/AuthContext.js'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);