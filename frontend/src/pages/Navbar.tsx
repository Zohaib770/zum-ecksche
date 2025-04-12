import React from 'react';
import { Link } from 'react-router-dom';
import texts from '../lang/de.json';
import InfoIcon from '../assets/info-icon.jpeg';
import ProfileIcon from '../assets/profile-icon.jpeg';
import WarenkorbIcon from '../assets/warenkorb-icon.jpeg';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-yellow-600 px-6 py-3 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white font-bold text-xl">
                    {texts.zum_ecksche}
                </Link>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/info"
                        className="p-2 rounded hover:bg-red-700 transition flex items-center justify-center"
                    >
                        <img src={InfoIcon} alt="Info" className="w-6 h-6 object-contain" />
                    </Link>
                    <Link
                        to="/login"
                        className="p-2 rounded hover:bg-red-700 transition flex items-center justify-center"
                    >
                        <img src={ProfileIcon} alt="Profil" className="w-6 h-6 rounded-full object-cover" />
                    </Link>
                    <Link
                        to="/warenkorb"
                        className="p-2 rounded hover:bg-red-700 transition flex items-center justify-center"
                    >
                        <img src={WarenkorbIcon} alt="Warenkorb" className="w-6 h-6 object-contain" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
