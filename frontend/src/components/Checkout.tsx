import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { DeliveryAddress, PersonalDetail, Order } from '../types/Interfaces';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Apis from '../api/Apis' 

const CheckoutForm: React.FC = () => {
  const { items, clearCart } = useCart();
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    postalCode: '',
    city: '',
    floor: '',
    comment: ''
  });
  const [personalDetail, setPersonalDetail] = useState<PersonalDetail>({
    fullName: '',
    email: '',
    phone: ''
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePersonalDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalDetail(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!personalDetail.fullName || !personalDetail.phone) {
      toast.error('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    if (orderType === 'delivery' && (!deliveryAddress.street || !deliveryAddress.postalCode || !deliveryAddress.city)) {
      toast.error('Bitte füllen Sie die Lieferadresse vollständig aus.');
      return;
    }

    const orderData: Order = {
      cartItem: items,
      personalDetail,
      orderType,
      paymentMethod,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      console.log('Bestelldaten:', orderData);
      await Apis.addOrder(orderData);
  
      toast.success('Bestellung erfolgreich aufgegeben!');
      clearCart();
    } catch (error) {
      console.error('Fehler beim Abschicken der Bestellung:', error);
      toast.error('Fehler beim Abschicken der Bestellung. Bitte versuchen Sie es erneut.');
    }
  };

  const calculateTotal = (): string => {
    return items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
  };

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
            className={`flex-1 py-2 px-4 rounded-md border ${
              orderType === 'delivery' 
                ? 'bg-yellow-600 text-white border-yellow-600' 
                : 'bg-white border-gray-300'
            }`}
          >
            Lieferung
          </button>
          <button
            type="button"
            onClick={() => setOrderType('pickup')}
            className={`flex-1 py-2 px-4 rounded-md border ${
              orderType === 'pickup' 
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
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Vor- und Nachname*</label>
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefonnummer*</label>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
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

      {/* Delivery Address - only shown for delivery */}
      {orderType === 'delivery' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Lieferadresse</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Straße und Hausnummer*</label>
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
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postleitzahl*</label>
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
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Stadt*</label>
              <input
                type="text"
                id="city"
                name="city"
                value={deliveryAddress.city}
                onChange={handleAddressChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Etage (optional)</label>
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
              <label htmlFor="addressComment" className="block text-sm font-medium text-gray-700">Bemerkung zur Lieferung (optional)</label>
              <input
                type="text"
                id="addressComment"
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
            className={`flex-1 py-2 px-4 rounded-md border ${
              paymentMethod === 'cash' 
                ? 'bg-yellow-600 text-white border-yellow-600' 
                : 'bg-white border-gray-300'
            }`}
          >
            Barzahlung
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('online')}
            className={`flex-1 py-2 px-4 rounded-md border ${
              paymentMethod === 'online' 
                ? 'bg-yellow-600 text-white border-yellow-600' 
                : 'bg-white border-gray-300'
            }`}
          >
            Online bezahlen
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Gesamtsumme:</span>
          <span className="text-lg font-bold text-yellow-700">{calculateTotal()}€</span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Bestellung abschließen
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;