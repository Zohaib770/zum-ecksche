import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from "./pages/Navbar";
import HomePage from "./pages/HomePage";
import FoodItem from './components/FoodItem';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

import InfoPage from "./pages/InfoPage";
import SuccessPage from "./pages/SuccessPage";
import CookieBanner from './components/CookieBanner';

function App() {

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fooditem" element={<FoodItem />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/info" element={<InfoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/erfolg" element={<SuccessPage />} />

        <Route path="/admin/*" element={<AdminPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieBanner />
    </>
  )
}

export default App
