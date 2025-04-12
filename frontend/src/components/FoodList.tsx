import React, { useEffect, useRef, useState, useCallback  } from 'react';
import Apis from '../api/Apis';
import { Category, Food, Option } from '../types/index';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const FoodList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodsByCategory, setFoodsByCategory] = useState<Record<string, Food[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [optionNames, setOptionNames] = useState<Option[]>([]);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryElementsRef = useRef<{[key: string]: HTMLDivElement | null}>({});
  const setCategoryRef = useCallback((categoryId: string) => {
    return (el: HTMLDivElement | null) => {
      categoryElementsRef.current[categoryId] = el;
    };
  }, []);

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
          setExpandedCategories(prev => ({ ...prev, [catId]: false })); // Initially all collapsed
        }

        setFoodsByCategory(groupedFoods);
        if (fetchedCategories.length > 0) {
          setSelectedCategoryId(String(fetchedCategories[0]._id));
        }

        const fetchOptions = await Apis.fetchOption();
        setOptionNames(fetchOptions);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      }
    };

    loadData();
  }, []);

  // Handle search - expand categories with matching foods
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Reset to default when search is cleared
      setExpandedCategories(prev => {
        const newState = {...prev};
        Object.keys(newState).forEach(key => {
          newState[key] = false;
        });
        return newState;
      });
      return;
    }

    const newExpandedState = {...expandedCategories};
    let firstMatchCategoryId: string | null = null;

    categories.forEach(cat => {
      const catId = String(cat._id);
      const foods = foodsByCategory[catId] || [];
      const hasMatch = foods.some(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      newExpandedState[catId] = hasMatch;
      
      if (hasMatch && !firstMatchCategoryId) {
        firstMatchCategoryId = catId;
      }
    });

    setExpandedCategories(newExpandedState);

    // Scroll to first matching category
    if (firstMatchCategoryId) {
      setTimeout(() => {
        scrollToCategory(firstMatchCategoryId!);
      }, 100);
    }
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (categoriesRef.current && categories.length > 0) {
      const currentIndex = categories.findIndex(cat => String(cat._id) === selectedCategoryId);
      let newIndex = currentIndex;

      if (direction === 'left' && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (direction === 'right' && currentIndex < categories.length - 1) {
        newIndex = currentIndex + 1;
      }

      if (newIndex !== currentIndex) {
        const newCategoryId = String(categories[newIndex]._id);
        setSelectedCategoryId(newCategoryId);
        scrollToCategory(newCategoryId);
        
        // Update scroll position
        const scrollAmount = categoriesRef.current.offsetWidth / 2;
        const newScroll = direction === 'left' 
          ? scrollPosition - scrollAmount 
          : scrollPosition + scrollAmount;
        
        categoriesRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
        setScrollPosition(newScroll);
      }
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const scrollToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const element = categoryElementsRef.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Suchfeld */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Suche Speise..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-md pl-10"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Kategorie Scroll Navigation */}
      <div className="flex items-center justify-center mb-4">
        <button 
          onClick={() => handleScroll('left')} 
          className="p-2 rounded-full bg-gray-200 mr-2 hover:bg-gray-300 transition"
        >
          {'<'}
        </button>
        <div ref={categoriesRef} className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={String(cat._id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategoryId === String(cat._id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
              onClick={() => scrollToCategory(String(cat._id))}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button 
          onClick={() => handleScroll('right')} 
          className="p-2 rounded-full bg-gray-200 ml-2 hover:bg-gray-300 transition"
        >
          {'>'}
        </button>
      </div>

      {/* Speisekarten Vorschau mit aufklappbaren Kategorien */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catId = String(cat._id);
          const foods = foodsByCategory[catId] || [];
          const filteredFoods = searchTerm 
            ? foods.filter(food => 
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : foods;

          if (searchTerm && filteredFoods.length === 0) return null;

          return (
            <div 
              key={catId}
              id={`category-${catId}`}
              ref={setCategoryRef(catId)}
              className="border rounded-lg overflow-hidden"
            >
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => toggleCategory(catId)}
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
                    expandedCategories[catId] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expandedCategories[catId] && (
                <div className="p-4">
                  <div className="space-y-3">
                    {filteredFoods.map((food: Food) => (
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
          );
        })}
      </div>
    </div>
  );
};

export default FoodList;