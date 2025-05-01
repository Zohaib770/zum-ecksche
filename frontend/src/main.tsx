import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FoodProvider } from './context/FoodContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FoodProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </FoodProvider>
    </BrowserRouter>
  </StrictMode >,
)
