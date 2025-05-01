import React, { createContext, useContext, useEffect, useState } from 'react';
import Apis from '../api/Apis';
import { Category, Food } from '../types/Interfaces';

interface FoodContextType {
  categories: Category[];
  foodsByCategory: Record<string, Food[]>;
  loading: boolean;
}

const FoodContext = createContext<FoodContextType>({
  categories: [],
  foodsByCategory: {},
  loading: true,
});

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodsByCategory, setFoodsByCategory] = useState<Record<string, Food[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCategories = await Apis.fetchCategories();
        setCategories(fetchedCategories);

        const groupedFoods: Record<string, Food[]> = {};
        for (const cat of fetchedCategories) {
          const catId = String(cat._id ?? '');
          const foods = await Apis.fetchFoodsByCategory(catId);
          groupedFoods[catId] = foods;
        }
        setFoodsByCategory(groupedFoods);
      } catch (err) {
        console.error("Fehler beim Laden der Foods:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <FoodContext.Provider value={{ categories, foodsByCategory, loading }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFoodContext = () => useContext(FoodContext);
