import React from 'react';
import { useCart } from '../context/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { convertPriceFromCommaToDot } from '../utils/helpFunctions';
import { toast } from 'react-toastify';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart } = useCart();

  const calculateTotal = (): string => {
    const total = items.reduce((sum, item) => {
      const basePrice = item.price * item.quantity;
      return sum + basePrice;
    }, 0);

    return total.toFixed(2).replace('.', ',');
  };

  const handleGoToCheckout = () => {
    const total = parseFloat(calculateTotal());
    if (total < 12) {
      toast.error('Mindestbestellwert ist 12 €');
      return;
    }
    navigate('/checkout');
  };

  const handleGoToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Warenkorb</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Dein Warenkorb ist leer.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.quantity} x {item.name}</h2>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>

              {item.options && item.options.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700">
                  {item.options.map((option, idx) => (
                    <li key={idx}>
                      {option.name}: {option.values?.map((val, index) => (
                        <strong key={index}> {val.value} </strong>
                      ))}
                    </li>
                  ))}
                </ul>
              )}

              {item.comment && (
                <p className="mt-2 text-sm italic text-gray-500">
                  Kommentar: {item.comment}
                </p>
              )}

              <p className="mt-2 font-medium">
                Preis: {item.quantity * item.price}€
              </p>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-lg font-semibold">Gesamtsumme:</span>
            <span className="text-lg font-bold text-yellow-700">{calculateTotal()}€</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleGoToHomePage}
              className="mt-4 flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md"
            >
              weiter bestellen
            </button>
            <button
              onClick={handleGoToCheckout}
              className="mt-4 flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              zum bezahlen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;