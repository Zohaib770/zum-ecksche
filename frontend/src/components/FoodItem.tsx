import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Food, CartItem, Option } from '../types/Interfaces';

export default function FoodItem() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const food: Food | undefined = state?.food;
  const { addToCart } = useCart();

  const [cartItem, setCartItem] = useState<CartItem>({
    name: food?.name ?? '',
    price: food?.price ?? '0',
    options: [],
    comment: ''
  });

  if (!food) {
    return <div className="text-center p-8">Keine Speise ausgewählt.</div>;
  }

  const calculateTotalPrice = (basePrice: string, options: Option[] = []): string => {
    for (const option of options) {
      const selectedValue = option.values?.[0];
      if (selectedValue?.price) {
        console.log("optionprice", parseFloat(selectedValue.price).toFixed(2));
        return parseFloat(selectedValue.price).toFixed(2);
      }
    }
  
    return parseFloat(basePrice || '0').toFixed(2);
  };
  

  const handleOptionChange = (optionName: string, value: string, price?: string) => {
    setCartItem((prev) => {
      const existingOptionIndex = prev.options?.findIndex((o) => o.name === optionName) ?? -1;
      let updatedOptions = [...(prev.options || [])];

      if (existingOptionIndex >= 0) {
        // Update existing option
        updatedOptions[existingOptionIndex] = {
          name: optionName,
          values: [{ value, price }],
        };
      } else {
        // Add new option
        updatedOptions.push({
          name: optionName,
          values: [{ value, price }],
        });
      }

      // Calculate new total price
      const newPrice = calculateTotalPrice(food.price, updatedOptions);

      return {
        ...prev,
        options: updatedOptions,
        price: newPrice
      };
    });
  };

  const handleCommentChange = (comment: string) => {
    setCartItem(prev => ({ ...prev, comment }));
  };

  const handleAddToCart = () => {
    const completeCartItem: CartItem = {
      ...cartItem,
      _id: Date.now(), // Generiere eine temporäre ID
      name: food.name,
      // price wird bereits korrekt berechnet in cartItem
    };

    addToCart(completeCartItem);

    // Reset form
    setCartItem({
      name: food.name,
      price: food.price, // Zurücksetzen auf Basispreis
      options: [],
      comment: ""
    });

    navigate('/cart');
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto mt-10 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{food.name}</h2>
      <p className="text-gray-600 mb-6">{food.description}</p>
      <p className="text-lg font-semibold mb-6">
        {food.price}€
      </p>

      {food.options?.map((option, i) => (
        <div key={i} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {option.name}
          </label>
          <div className="space-y-2">
            {option.values?.map((val, j) => (
              <label key={j} className="flex items-center">
                <input
                  type="radio"
                  name={option.name}
                  value={val.value}
                  checked={cartItem.options?.find(o => o.name === option.name)?.values?.[0]?.value === val.value}
                  onChange={() => handleOptionChange(option.name, val.value, val.price)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {val.value}
                  {val.price && ` (+${val.price}€)`}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kommentar
        </label>
        <textarea
          value={cartItem.comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="Z. B. ohne Zwiebeln, extra Käse..."
        />
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        In den Warenkorb legen
      </button>
    </div>
  );
}