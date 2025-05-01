import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Apis from '../api/Apis';

interface Order {
  cartItem: any[];
  personalDetail: {
    fullName: string;
    email: string;
    phone: string;
  };
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'online';
  deliveryAddress?: {
    street: string;
    postalCode: string;
    city: string;
    floor: string;
    comment: string;
  };
  price: number;
  onlinePaymentMethod?: 'paypal' | 'giro' | 'googlepay' | null;
  status: string;
  createdAt: string;
}

interface PayPalProps {
  order: Order;
  onSuccess: () => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

const PayPalPayment: React.FC<PayPalProps> = ({ order, onSuccess, onError, onCancel }) => {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENTID,
    currency: 'EUR',
    intent: 'capture',
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: order.price.toFixed(2),
          currency_code: 'EUR'
        },
        description: `Bestellung bei ${'YOUR_SHOP_NAME'} vom ${new Date(order.createdAt).toLocaleDateString()}`,
        payee: {
          email_address: 'sb-dbskm41134471@business.example.com',
        },
        items: order.cartItem.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          unit_amount: {
            currency_code: 'EUR',
            value: item.price.toFixed(2)
          }
        }))
      }],
      application_context: {
        brand_name: 'ZUM ECKSCHE', // This will appear in PayPal checkout
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW', // Makes the Pay Now button appear
        locale: 'de-DE' // Optional: Set to German locale
      }
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();

      // Update order status to 'paid'
      const updatedOrder = {
        ...order,
        status: 'paid',
        paymentDetails: details // Store PayPal payment details
      };

      await Apis.addOrder(updatedOrder);
      toast.success('Zahlung erfolgreich verarbeitet!');
      onSuccess();
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast.error('Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      onError(error);
    }
  };

  const buttonStyles = {
    layout: 'vertical' as const,
    shape: 'rect' as const,
    color: 'gold' as const,
  };

  return (
    <div className="paypal-container">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={buttonStyles}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
          fundingSource="paypal"
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalPayment;