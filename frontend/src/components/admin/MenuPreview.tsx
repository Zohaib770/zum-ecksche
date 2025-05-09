import React, { useState, useEffect } from 'react';
import { Category, Food } from '../../types/Interfaces';
import Apis from '../../api/Apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFoodContext } from "../../context/FoodContext";
import { convertPriceFromDotToComma } from '../../utils/helpFunctions';

const MenuPreview: React.FC = () => {

  const {
    categories,
    foodsByCategory,
  } = useFoodContext();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };


  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-6">Speisekarte Vorschau</h3>
      <div className="space-y-4">
        {categories.map((cat, catIndex) => (
          <div key={cat._id?.toString()} className="border rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => toggleCategory(String(cat._id))}
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  {cat.imageUrl && (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/${cat.imageUrl}`}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                  )}
                  <h3 className="font-medium">
                    {`${catIndex + 1}.`} {cat.name} {cat.description && <span className="text-gray-600">({cat.description})</span>}
                  </h3>
                </div>

                {/* Display category options if they exist */}
                {cat.options && cat.options.length > 0 && (
                  <div className="mt-1 ml-13 pl-3 text-sm text-gray-500">
                    {cat.options.map((option, i) => (
                      <div key={i}>
                        <span className="font-medium">{option.name}:</span>
                        {option.values?.map((val, j) => (
                          <span key={j} className="ml-2">
                            {val.value}
                            {val.price && ` (${convertPriceFromDotToComma(val.price)}) €`}
                            {j < (option.values?.length || 0) - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedCategories[String(cat._id)] ? 'rotate-180' : ''
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
                  {(foodsByCategory[String(cat._id)] || []).map((food, foodIndex) => (
                    <FoodItem key={String(food._id)} food={food} index={`${catIndex + 1}.${foodIndex + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FoodItem: React.FC<{ food: Food; index: string }> = ({ food, index }) => (
  <div className="pb-3 border-b last:border-0">
    <div className="flex justify-between">
      <div>
        <h4 className="font-medium">
          {index}. {food.name} <span className="font-medium">{convertPriceFromDotToComma(food.price)}€</span></h4>
        {food.description && <p className="text-sm text-gray-600">{food.description}</p>}
      </div>
    </div>
    {food.options?.map((option, i) => (
      <div key={i} className="mt-1 text-sm">
        <span className="text-gray-600">{option.name}: </span>
        {option.values?.map((val, j) => (
          <span key={j} className="mr-2">
            {val.value}
            {val.price && ` (${convertPriceFromDotToComma(val.price)} €)`}
            {j < (option.values?.length || 0) - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    ))}
  </div>
);

export default MenuPreview;