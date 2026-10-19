import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
// Load the feedback tool only in development; production excludes its bundle.
const Agentation = import.meta.env.DEV
  ? React.lazy(() => import('agentation').then(module => ({ default: module.Agentation })))
  : null;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {Agentation && <React.Suspense fallback={null}>
      <Agentation endpoint="http://localhost:4747" />
    </React.Suspense>}
  </React.StrictMode>
);
