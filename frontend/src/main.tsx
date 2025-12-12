import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { router } from './routes';
import axios from 'axios';
import './index.css';

axios.defaults.baseURL= import.meta.env.VITE_API_URL ?? "/api/v1"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
