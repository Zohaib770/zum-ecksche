import React from 'react';

interface AdminNavTabsProps {
  activeTab: 'category' | 'food' | 'menu' | 'orders';
  onTabChange: (tab: 'category' | 'food' | 'menu' | 'orders') => void;
}

const AdminNavTabs: React.FC<AdminNavTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hide border-b">
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          activeTab === 'category' 
            ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onTabChange('category')}
      >
        Kategorie hinzufügen
      </button>
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          activeTab === 'food' 
            ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onTabChange('food')}
      >
        Speise hinzufügen
      </button>
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          activeTab === 'menu' 
            ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onTabChange('menu')}
      >
        Menü Vorschau
      </button>
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          activeTab === 'orders' 
            ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onTabChange('orders')}
      >
        Bestellungen
      </button>
    </div>
  );
};

export default AdminNavTabs;