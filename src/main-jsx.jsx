import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppJSX from './AppJSX.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppJSX />
  </StrictMode>
);
