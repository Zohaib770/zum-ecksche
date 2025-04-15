import AdminNavTabs from '../components/admin/AdminNavTabs';
import CategoryForm from '../components/admin/CategoryForm';
import FoodForm from '../components/admin/FoodForm';
import MenuPreview from '../components/admin/MenuPreview';
import OrderManagement from '../components/admin/OrderManagement';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'category' | 'food' | 'menu' | 'orders'>('menu'); // Set 'menu' as default active tab

    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const currentTabFromPath = pathSegments[pathSegments.length - 1];

        if (['category-form', 'category'].includes(currentTabFromPath)) {
            setActiveTab('category');
        } else if (['food-form', 'food'].includes(currentTabFromPath)) {
            setActiveTab('food');
        } else if (['menu-preview', 'menu'].includes(currentTabFromPath)) {
            setActiveTab('menu');
        } else if (['orders'].includes(currentTabFromPath)) {
            setActiveTab('orders');
        } else {
            // Default to 'menu' if the path doesn't match
            setActiveTab('menu');
            navigate('/admin/menu', { replace: true }); // Navigate to the default route
        }
    }, [location, navigate]);

    const handleTabChange = (tab: 'category' | 'food' | 'menu' | 'orders') => {
        setActiveTab(tab);
        navigate(`/admin/${tab}`, { replace: true });
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'category':
                return <CategoryForm />;
            case 'food':
                return <FoodForm />;
            case 'menu':
                return <MenuPreview />;
            case 'orders':
                return <OrderManagement />;
            default:
                return <MenuPreview />; // Fallback to MenuPreview
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Adminbereich</h1>

            <AdminNavTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="bg-white p-6 rounded-lg shadow-sm border mt-4">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default AdminPage;