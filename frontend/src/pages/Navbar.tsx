import React from 'react';
import { Link } from 'react-router-dom';
import texts from '../lang/de.json';

import InfoIcon from '../assets/icons/info.jpeg';
import ProfileIcon from '../assets/icons/profile.jpeg';
import WarenkorbIcon from '../assets/icons/cart.jpeg';

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const t = texts.Navbar;
    const { items } = useCart();
    const { isLoggedIn, logout } = useAuth();

    return (
        <nav className="bg-yellow-600 px-6 py-3 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white font-bold text-xl">
                    {t.zum_ecksche}
                </Link>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/info"
                        className="p-2 rounded hover:bg-red-700 transition flex items-center justify-center"
                    >
                        <img src={InfoIcon} alt="Info" className="w-6 h-6 object-contain" />
                    </Link>
                    <Link
                        to={isLoggedIn ? "/admin" : "/login"}
                        className="p-2 rounded hover:bg-red-700 transition flex items-center justify-center"
                    >
                        <img src={ProfileIcon} alt="Profil" className="w-6 h-6 rounded-full object-cover" />
                    </Link>
                    {isLoggedIn && (
                        <button onClick={logout} className="text-white bg-yellow-600 px-3 py-1 rounded hover:bg-red-700">
                            Abmelden
                        </button>
                    )}
                    <Link to="/cart" className="relative p-2 rounded hover:bg-red-700 transition flex items-center justify-center">
                        <img src={WarenkorbIcon} alt="Warenkorb" className="w-6 h-6 object-contain" />
                        {items.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {items.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
