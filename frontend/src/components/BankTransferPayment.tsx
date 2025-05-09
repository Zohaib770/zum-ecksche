import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Order } from '../types/Interfaces';
import Apis from '../api/Apis';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface BankTransferPaymentProps {
  order: Order;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const BankTransferPayment: React.FC<BankTransferPaymentProps> = ({ order, onSuccess, onError }) => {
  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;

      const response = await Apis.stripeCreateOrder(order);

      const clientSecret = response.data.clientSecret;
      console.log(" cleint secret = ", clientSecret);
      const result = await stripe?.confirmGiropayPayment(clientSecret, {
        payment_method: {
          // giropay: {},
          // sofort: {
          //   country: 'DE',
          // },
          billing_details: {
            name: order.personalDetail.fullName,
            email: order.personalDetail.email,
          },
        },
        return_url: 'http://localhost:3000/payment-result',
      });

      if (result?.error) {
        console.log("==== ", result?.error);
        onError(result.error);
      } else if (result?.paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (error) {
      onError(error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Mit Bankkonto bezahlen
    </button>
  );
};

export default BankTransferPayment;