import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Food, CartItem, OptionValue, Extra } from '../types/Interfaces';
import Apis from "../api/Apis";
import { useFoodContext } from "../context/FoodContext";

export default function FoodItem() {

  const { categories } = useFoodContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [availableExtras, setAvailableExtras] = useState<Extra[]>([]);
  const food: Food | undefined = state?.food;
  const { addToCart } = useCart();

  const [cartItem, setCartItem] = useState<CartItem>({
    name: food?.name ?? '',
    quantity: 1,
    price: food?.price ?? '0',
    options: [],
    comment: ''
  });

  const [selectedSize, setSelectedSize] = useState<OptionValue>();
  const [selectedExtraBasePrice, setSelectedExtraBasePrice] = useState<string>();

  if (!food) {
    return <div className="text-center p-8">Keine Speise ausgewählt.</div>;
  }

  // Find size options if they exist
  const sizeOptions = food.options?.find(opt => opt.name === 'size')?.values || [];
  const extraOptions = food.options?.find(opt => opt.name === 'extras')?.values || [];

  const calculateTotalPrice = (): string => {

    let basePrice = parseFloat(cartItem.price || food.price || '0');

    const extrasPrice = cartItem.options
      ?.filter(opt => opt.name === 'extra')
      .flatMap(opt => opt.values?.map(val => parseFloat(val.price || '0')) || [])
      .reduce((sum, price) => sum + price, 0) || 0;

    const total = (basePrice + extrasPrice) * cartItem.quantity;
    return total.toFixed(2);
    // const firstOptionWithPrice = food.options?.[0]?.values?.[0]?.price;
    // const basePrice = firstOptionWithPrice ?? food.price;
    // return `${calculateTotalItemPrice(basePrice, cartItem.quantity)}`;

    /* let basePrice = food.price;
    if (selectedSize?.price) {
      basePrice = selectedSize.price;
    }

    // Add prices from selected extras
    const extrasPrice = cartItem.options
      ?.filter(opt => opt.name === 'extra')
      .flatMap(opt => opt.values?.map(val => parseFloat(val.price || '0')) || [])
      .reduce((sum, price) => sum + price, 0) || 0;

    const total = parseFloat(basePrice || '0') + extrasPrice;
    return total.toFixed(2); */
  };

  const handleSizeChange = (value: OptionValue) => {
    setSelectedSize(value);

    const ofenfrischePizzaCategory = categories.find(
      (category) => category.name === "Ofenfrische Pizza"
    );
    // console.log("📦 Ofenfrische Pizza Category:", ofenfrischePizzaCategory);
    if (!ofenfrischePizzaCategory?.options) return;

    const extrasOption = ofenfrischePizzaCategory.options.find(option =>
      option.name.toLowerCase().includes("extras")
    );

    const matchedValue = extrasOption?.values?.find(val =>
      value.value.trim().toLowerCase().includes(val.value.trim().toLowerCase())
    );

    const matchedPrice = matchedValue?.price;
    setSelectedExtraBasePrice(matchedPrice);


    setCartItem(prev => ({
      ...prev,
      price: value.price || food.price,
      options: prev.options?.filter(opt => opt.name !== 'size') || []
    }));
  };

  const handleExtraChange = (extraName: string, isChecked: boolean) => {
    setCartItem(prev => {
      const existingExtras = prev.options?.find(o => o.name === 'extra')?.values || [];
      let newExtras;

      const price = selectedExtraBasePrice?.toString() || '0';

      if (isChecked) {
        newExtras = [...existingExtras, { value: extraName, price }];
      } else {
        newExtras = existingExtras.filter(e => e.value !== extraName);
      }

      const otherOptions = prev.options?.filter(o => o.name !== 'extra') || [];

      return {
        ...prev,
        options: [
          ...otherOptions,
          ...(newExtras.length > 0 ? [{ name: 'extra', values: newExtras }] : [])
        ]
      };
    });
  };

  const handleQuantityChange = (change: number) => {
    setCartItem(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change)
    }));
  };

  const handleCommentChange = (comment: string) => {
    setCartItem(prev => ({ ...prev, comment }));
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizeOptions.length > 0) {
      alert('Bitte wählen Sie eine Größe aus');
      return;
    }

    const completeCartItem: CartItem = {
      ...cartItem,
      name: food.name,
      price: calculateTotalPrice(),
      options: [
        ...(selectedSize ? [{
          name: 'size',
          values: [{ value: selectedSize.value, price: selectedSize.price }]
        }] : []),
        ...(cartItem.options || [])
      ]
    };

    addToCart(completeCartItem);
    navigate('/cart');
  };

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const result = await Apis.fetchExtra();
        const pizzaExtras = result.filter((extra: any) => extra.category === 'Ofenfrische Pizza');
        setAvailableExtras(pizzaExtras);
      } catch (error) {
        console.error("Fehler beim Laden der Extras:", error);
      }
    };

    if (food.category === 'Ofenfrische Pizza') {
      fetchExtras();
    }
  }, [food.category]);

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto mt-10 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">
        <span>{cartItem.quantity} x {food.name} </span>
        <button onClick={() => handleQuantityChange(-1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-0 px-2 rounded">
          -
        </button>
        <button onClick={() => handleQuantityChange(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-0 px-2 rounded">
          +
        </button>
      </h2>

      <p className="text-gray-600 mb-6">{food.description}</p>

      <p className="text-lg font-semibold mb-6">
        {calculateTotalPrice()}€
      </p>

      {/* Size Selection (Radio Buttons) */}
      {sizeOptions.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Größe*
          </label>
          <div className="space-y-2">
            {sizeOptions.map((size, i) => (
              <label key={i} className="flex items-center">
                <input
                  type="radio"
                  name="size"
                  value={size.value}
                  checked={selectedSize?.value === size.value}
                  onChange={() => handleSizeChange(size)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {size.value}
                  {size.price && ` (${size.price}€)`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Extras (only shown after size is selected) */}
      {selectedSize && availableExtras.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Extras</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableExtras.map((extra, index) => (
              Array.isArray(extra.value) ? (
                extra.value.map((item, itemIndex) => (
                  <label key={`${index}-${itemIndex}`} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={cartItem.options?.some(
                        opt => opt.name === 'extra' &&
                          opt.values?.some(val => val.value === item.name)
                      )}
                      onChange={(e) => handleExtraChange(
                        item.name, e.target.checked)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {item.name}
                      {` (+${selectedExtraBasePrice}€)`}
                    </span>
                  </label>
                ))
              ) : (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={cartItem.options?.some(
                      opt => opt.name === 'extra' &&
                        opt.values?.some(val => val.value === extra.value.name)
                    )}
                    onChange={(e) => handleExtraChange(
                      extra.value.name, e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {extra.value.name}
                    {extra.value.price > 0 && ` (+${extra.value.price}€)`}
                  </span>
                </label>
              )
            ))}
          </div>
        </div>
      )}

      {/* Comment */}
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