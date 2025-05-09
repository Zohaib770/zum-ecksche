import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { DeliveryAddress, PersonalDetail, Order, DeliveryZone } from '../types/Interfaces';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Apis from '../api/Apis';
import { useNavigate } from 'react-router-dom';
import { convertPriceFromDotToComma } from '../utils/helpFunctions';
import PayPalPayment from './PayPalPayment';

const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState<'paypal' | 'giro' | null>(null);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    postalCode: 0,
    city: '',
    floor: '',
    comment: ''
  });
  const [personalDetail, setPersonalDetail] = useState<PersonalDetail>({
    fullName: '',
    email: '',
    phone: ''
  });

  const calculateTotal = (): number => {
    let total: number = 0;

    for (const item of items) {
      const price: number = item.price * item.quantity;
      total += price;
    }

    return total;
  };


  // Handle form field changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeliveryAddress(prev => ({ ...prev, city: e.target.value }));
  };

  const handlePersonalDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalDetail(prev => ({ ...prev, [name]: value }));
  };

  // Load delivery zones
  const loadDeliveryZones = async () => {
    try {
      const zones = await Apis.fetchDeliveryzone();
      setDeliveryZones(zones);
    } catch (error) {
      toast.error('Fehler beim Laden der Lieferzonen');
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!personalDetail.fullName || !personalDetail.phone || !personalDetail.email) {
      toast.error('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    if (orderType === 'delivery') {
      const selectedZone = deliveryZones.find(zone => zone.name === deliveryAddress.city);
      const minAmount = selectedZone?.min_order_price ?? 0;

      if (calculateTotal() < minAmount) {
        toast.error(`Mindestbestellwert für ${deliveryAddress.city} ist ${minAmount} €.`);
        return;
      }

      if (!deliveryAddress.street || !deliveryAddress.postalCode || !deliveryAddress.city) {
        toast.error('Bitte füllen Sie die Lieferadresse vollständig aus.');
        return;
      }
    }

    if (paymentMethod === 'online' && !onlinePaymentMethod) {
      toast.error('Bitte wählen Sie eine Online-Zahlungsmethode aus.');
      return;
    }

    try {
      const orderData: Order = {
        cartItem: items,
        personalDetail,
        orderType,
        paymentMethod,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        price: calculateTotal(),
        // onlinePaymentMethod: paymentMethod === 'online' ? onlinePaymentMethod : undefined,
        paypalOrderId: '',
        paypalTransactionId: '',
        status: paymentMethod === 'cash' ? 'new' : 'pending_payment',
        createdAt: new Date().toISOString()
      };

      if (paymentMethod === 'cash') {
        await Apis.addOrder(orderData);
        toast.success('Bestellung erfolgreich aufgegeben!');
        clearCart();
        navigate('/erfolg');
      }
    } catch (error) {
      console.error('Fehler beim Abschicken der Bestellung:', error);
      toast.error('Fehler beim Abschicken der Bestellung. Bitte versuchen Sie es erneut.');
    }
  };

  useEffect(() => {
    loadDeliveryZones();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Kasse</h1>

      {/* Order Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bestellart</h2>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`flex-1 py-2 px-4 rounded-md border ${orderType === 'delivery'
              ? 'bg-yellow-600 text-white border-yellow-600'
              : 'bg-white border-gray-300'
              }`}
          >
            Lieferung
          </button>
          <button
            type="button"
            onClick={() => setOrderType('pickup')}
            className={`flex-1 py-2 px-4 rounded-md border ${orderType === 'pickup'
              ? 'bg-yellow-600 text-white border-yellow-600'
              : 'bg-white border-gray-300'
              }`}
          >
            Abholung
          </button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Persönliche Daten</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Vor- und Nachname*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={personalDetail.fullName}
              onChange={handlePersonalDetailChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefonnummer*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personalDetail.phone}
              onChange={handlePersonalDetailChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={personalDetail.email}
              onChange={handlePersonalDetailChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      {orderType === 'delivery' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Lieferadresse</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Straße und Hausnummer*
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postleitzahl*
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={deliveryAddress.postalCode}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Stadt*
                <span
                  className="text-gray-500 cursor-pointer ml-2"
                  title="Lieferkosten:
                    - bis 2 km: ab 12€
                    - bis 4 km: ab 20€
                    - bis 6 km: ab 30€
                    - bis 7 km: ab 35€"
                >
                  ℹ️
                </span>
              </label>
              <select
                id="city"
                value={deliveryAddress.city}
                onChange={handleCityChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                required
              >
                <option value="">Bitte wählen</option>
                {deliveryZones.map((zone) => (
                  <option key={zone.name} value={zone.name}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                Etage (optional)
              </label>
              <input
                type="text"
                id="floor"
                name="floor"
                value={deliveryAddress.floor}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Bemerkung zur Lieferung (optional)
              </label>
              <input
                type="text"
                id="comment"
                name="comment"
                value={deliveryAddress.comment}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Zahlungsmethode</h2>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`flex-1 py-2 px-4 rounded-md border ${paymentMethod === 'cash'
              ? 'bg-yellow-600 text-white border-yellow-600'
              : 'bg-white border-gray-300'
              }`}
          >
            Barzahlung
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('online')}
            className={`flex-1 py-2 px-4 rounded-md border ${paymentMethod === 'online'
              ? 'bg-yellow-600 text-white border-yellow-600'
              : 'bg-white border-gray-300'
              }`}
          >
            Online bezahlen
          </button>
        </div>

        {paymentMethod === 'online' && (
          <div className="mt-4 space-y-3">
            <h3 className="text-lg font-medium">Online-Zahlungsmethode wählen:</h3>
            <div className="space-y-2">
              {['paypal', 'giro'].map((method) => (
                <label key={method} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="onlinePayment"
                    checked={onlinePaymentMethod === method}
                    onChange={() => setOnlinePaymentMethod(method as any)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span>
                    {method === 'paypal' && 'PayPal'}
                    {method === 'giro' && 'Giro Business Account'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Gesamtsumme:</span>
          <span className="text-xl font-bold text-yellow-700">
            {convertPriceFromDotToComma(calculateTotal())}€
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Weiter bestellen
          </button>
          {/* Show either PayPal button or regular submit button */}
          {paymentMethod === 'online' && onlinePaymentMethod === 'paypal' ? (
            <button
              type="button"
              onClick={() => setShowPayPalModal(true)} // Add state for this if needed
              className="w-full py-3 px-4 rounded-lg"
            >
              <PayPalPayment
                order={{
                  cartItem: items,
                  personalDetail,
                  deliveryAddress,
                  price: calculateTotal(),
                  orderType,
                  paymentMethod,
                  paypalOrderId: '',
                  paypalTransactionId: '',
                  status: 'pending_payment',
                  createdAt: new Date().toISOString()
                }}
                onSuccess={() => {
                  toast.success('Zahlung erfolgreich!');
                  clearCart();
                  // navigate('/erfolg');
                }}
                onError={(error) => {
                  toast.error('Zahlung fehlgeschlagen');
                  console.error(error);
                }}
                onCancel={() => {
                  toast.info('Zahlung wurde abgebrochen');
                  setShowPayPalModal(false);
                }}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Bestellung abschließen
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default CheckoutForm;