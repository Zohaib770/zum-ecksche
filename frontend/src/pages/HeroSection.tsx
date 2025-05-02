import React from "react";
import { FaClock, FaEuroSign } from "react-icons/fa";
import texts from "../lang/de.json";

interface HeroSectionProps {
    onMenuClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onMenuClick }) => {
    const t = texts.HeroSection;

    return (
        <div className="relative h-[500px] bg-cover bg-center flex items-center justify-start px-10">
            <div className="absolute inset-0 bg-black opacity-50" style={{ zIndex: 1 }} />
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('src/assets/herosection.jpg')",
                    zIndex: 0,
                }}
            />
            <div className="p-8 rounded-lg max-w-xl relative z-10">
                <h1 className="text-4xl font-bold mb-2 text-white">
                    {t.title}
                </h1>
                <h2 className="text-2xl mb-4 font-semibold text-white">
                    {t.subtitle}
                </h2>
                <p className="mb-6 text-gray-200">
                    {t.description}
                </p>

                <div className="flex gap-6 text-sm text-gray-200">
                    <div className="flex items-center gap-2">
                        <FaClock />
                        <span>{t.delivery_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaEuroSign />
                        <span>{t.min_order}</span>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={onMenuClick}
                        className="bg-white hover:bg-yellow-100 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        {t.menu_button}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
