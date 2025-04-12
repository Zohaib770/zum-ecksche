import { useState, useEffect } from 'react';
import CategoryForm from '../components/CategoryForm';
import FoodForm from '../components/FoodForm';
import { Category, Food, Option } from '../types/index';
import Apis from '../api/Apis';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [optionNames, setOptionNames] = useState<Option[]>([]);
  const [foodsByCategory, setFoodsByCategory] = useState<Record<string, Food[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const fetchedCategories = await Apis.fetchCategories();
      setCategories(fetchedCategories);
      const foodsGrouped: Record<string, Food[]> = {};

      for (const cat of fetchedCategories) {
        const categoryId = String(cat._id ?? '');
        const foods = await Apis.fetchFoodsByCategory(categoryId);
        foodsGrouped[categoryId] = foods;
        setExpandedCategories(prev => ({ ...prev, [categoryId]: true }));
      }
      setFoodsByCategory(foodsGrouped);

      const fetchOptions = await Apis.fetchOption();
      setOptionNames(fetchOptions);

    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddCategory = async (categoryData: Omit<Category, '_id' | 'imageUrl'>, image: File | null) => {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description || '');
      if (image) {
        formData.append('image', image);
      }

      await Apis.addCategory(formData);
      loadData();
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Kategorie:', error);
    }
  };

  const handleAddFood = async (foodData: Omit<Food, '_id'>) => {
    try {
      await Apis.addFood(foodData);
      loadData();
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Speise:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Zum Ecksche</h1>
      <h2 className="text-xl font-semibold mb-8 border-b pb-2">Adminbereich – Kategorien & Speisen</h2>

      {/* <div className="grid md:grid-cols-2 gap-8 mb-12"> */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Kategorie hinzufügen</h3>
          <CategoryForm onSubmit={handleAddCategory} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Speise hinzufügen</h3>
          <FoodForm categories={categories} optionnames={optionNames} onAdd={handleAddFood} />
        </div>
      {/* </div> */}

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Speisekarte Vorschau</h3>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat._id?.toString()} className="border rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleCategory(String(cat._id))}
              >
                <div className="flex items-center">
                  {cat.imageUrl && (
                    <img
                      src={`${BACKEND_URL}/${cat.imageUrl}`}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                  )}
                  <h3 className="font-medium">{cat.name}</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedCategories[String(cat._id)] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expandedCategories[String(cat._id)] && (
                <div className="p-4">
                  <div className="space-y-3">
                    {(foodsByCategory[String(cat._id)] || []).map((food: Food) => (
                      <div key={String(food._id)} className="pb-3 border-b last:border-0">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{food.name}</h4>
                            {food.description && (
                              <p className="text-sm text-gray-600">{food.description}</p>
                            )}
                          </div>
                          <span className="font-medium">{food.price}€</span>
                        </div>
                        {food.options?.map((option, i) => (
                          <div key={i} className="mt-1 text-sm">
                            <span className="text-gray-600">{option.name}: </span>
                            {option.values.map((val, j) => (
                              <span key={j} className="mr-2">
                                {val.value} {val.priceAdjustment !== 0 && `(${val.priceAdjustment}€)`}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}