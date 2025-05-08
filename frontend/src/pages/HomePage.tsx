import React, { useRef } from 'react';
import FoodList from '../components/FoodList';
import HeroSection from './HeroSection';
import Footer from './Footer';
import CookieBanner from '../components/CookieBanner';

const HomePage: React.FC = () => {
    const foodListRef = useRef<HTMLDivElement>(null);

    const scrollToFoodList = () => {
        foodListRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection onMenuClick={scrollToFoodList} />
            <main ref={foodListRef} className="flex-grow">
                <FoodList />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
