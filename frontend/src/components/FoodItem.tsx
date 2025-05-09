import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Category, Food, CartItem, Option, OptionValue, Extra } from '../types/Interfaces';
import Apis from "../api/Apis";
import { useFoodContext } from "../context/FoodContext";
import { convertPriceFromDotToComma } from "../utils/helpFunctions";

export default function FoodItem() {
  const { categories } = useFoodContext();
  const { addToCart } = useCart();

  const navigate = useNavigate();

  const { state } = useLocation();
  const food: Food | undefined = state?.food;

  const [availableExtras, setAvailableExtras] = useState<Extra[]>([]);

  const [totalPrice, setTotalPrice] = useState<number>(food?.price || 0);
  const [cartItem, setCartItem] = useState<CartItem>({
    name: food?.name ?? '',
    quantity: 1,
    price: food?.price ?? 0,
    options: [],
    comment: ''
  });

  if (!food) {
    return <div className="text-center p-8">Keine Speise ausgewählt.</div>;
  }

  const sizeOptions = food.options?.find(opt => opt.name === 'size')?.values || [];
  // const extraOptions = food.options?.find(opt => opt.name === 'extras')?.values || [];


  // for fleischgericht/ pizza
  //selected size for pizza
  const initialSelectedSize = sizeOptions[0];
  const [selectedSize, setSelectedSize] = useState<OptionValue>(initialSelectedSize);
  //extra ingredient price upon size selected
  const [selectedExtraBasePrice, setSelectedExtraBasePrice] = useState<number>(
    getExtrasBasePrice(categories, initialSelectedSize)
  );

  function getExtrasBasePrice(categories: Category[], selectedSize: OptionValue): number {
    const ofenfrischePizzaCategory = categories.find(
      (category) => category.name === "Ofenfrische Pizza"
    );
    if (!ofenfrischePizzaCategory?.options) return 0;

    const extrasOption = ofenfrischePizzaCategory.options.find(option =>
      option.name.toLowerCase().includes("extras")
    );
    if (!extrasOption?.values) return 0;

    const matchedValue = extrasOption.values.find(val =>
      selectedSize.value.trim().toLowerCase().includes(val.value.trim().toLowerCase())
    );

    return matchedValue?.price || 0;
  }


  const handleSizeChange = (value: OptionValue) => {

    const extrasPrice = getExtrasBasePrice(categories, value);
    setSelectedExtraBasePrice(extrasPrice);

    setCartItem(prev => {
      const existingExtras = prev.options?.find(o => o.name === 'extra')?.values || [];
      const updatedExtras = existingExtras.map(extra => ({
        ...extra,
        price: extrasPrice || extra.price
      }));

      const otherOptions = prev.options?.filter(o => o.name !== 'extra' && o.name !== 'size') || [];

      return {
        ...prev,
        price: value.price!,
        options: [
          ...otherOptions,
          ...(updatedExtras.length > 0 ? [{
            name: 'extra',
            values: updatedExtras
          }] : []),
          {
            name: 'size',
            values: [{
              value: value.value,
              price: value.price || 0
            }]
          }
        ]
      };
    });

    setSelectedSize(value);
  };

  const handleExtraChange = (extraName: string, extraPrice: number, isChecked: boolean) => {
    setCartItem(prev => {
      const existingExtras = prev.options?.find(o => o.name === 'extra')?.values || [];
      let newExtras: OptionValue[];

      if (isChecked) {
        newExtras = [...existingExtras, {
          value: extraName,
          price: selectedExtraBasePrice || extraPrice
        }];
      } else {
        newExtras = existingExtras.filter(e => e.value !== extraName);
      }

      const otherOptions = prev.options?.filter(o => o.name !== 'extra') || [];

      return {
        ...prev,
        options: [
          ...otherOptions,
          ...(newExtras.length > 0 ? [{
            name: 'extra',
            values: newExtras
          }] : [])
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

  const calculateCartItemPrice = (): number => {
    const basePrice = Number(selectedSize?.price || food.price || 0);
    const extrasPrice = cartItem.options
      ?.filter(opt => opt.name === 'extra')
      .flatMap(opt => opt.values || [])
      .reduce((sum, val) => sum + Number(val.price || 0), 0) || 0;
    const total = (Number(basePrice) + Number(extrasPrice));
    return isNaN(total) ? 0 : total;
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizeOptions.length > 0) {
      alert('Bitte wählen Sie eine Größe aus');
      return;
    }

    const completeCartItem: CartItem = {
      ...cartItem,
      name: food.name,
      price: calculateCartItemPrice(),
      options: [
        ...(selectedSize ? [{
          name: 'size',
          values: [{
            value: selectedSize.value,
            price: selectedSize.price || 0
          }]
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
        const availableExtra = await Apis.fetchExtra();
        const extrasByCategory = availableExtra.filter((extra: Extra) =>
          extra.category.toLowerCase() === food.category.toLowerCase()
        );
        setAvailableExtras(extrasByCategory);
      } catch (error) {
        console.error("Fehler beim Laden der Extras:", error);
      }
    };

    fetchExtras();
  }, [food.category, sizeOptions, selectedSize]);

  useEffect(() => {
    const calculateTotalPrice = (): number => {
      const basePrice = Number(selectedSize?.price || food.price || 0);
      const extrasPrice = cartItem.options
        ?.filter(opt => opt.name === 'extra')
        .flatMap(opt => opt.values || [])
        .reduce((sum, val) => sum + Number(val.price || 0), 0) || 0;
      const total = (Number(basePrice) + Number(extrasPrice)) * Number(cartItem.quantity);
      return isNaN(total) ? 0 : total;
    };

    setTotalPrice(calculateTotalPrice());
  }, [selectedSize, selectedExtraBasePrice, cartItem.options, cartItem.quantity, food.price]);

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
        {convertPriceFromDotToComma(totalPrice)} €
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
                  {size.price && ` (${convertPriceFromDotToComma(size.price)}€)`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      {/* Extras (only shown after size is selected) */}
      {availableExtras.length > 0 && (
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
                        item.name,
                        item.price,
                        e.target.checked)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {item.name}
                      {` (+${convertPriceFromDotToComma(selectedExtraBasePrice || item.price)}€)`}
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
                      extra.value.name,
                      extra.value.price,
                      e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {extra.value.name}
                    {extra.value.price > 0 && ` (+${convertPriceFromDotToComma(extra.value.price)}€)`}
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