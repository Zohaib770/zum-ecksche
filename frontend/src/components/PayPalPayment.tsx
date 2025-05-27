import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Apis from '../api/Apis';
import { Order } from '../types/Interfaces';

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

  const createOrder = async (data: any, actions: any) => {
    try {
      const response = await Apis.paypalCreateOrder(order);
      return response.data.id;
    } catch (error) {
      toast.error('Fehler bei der PayPal-Ordererstellung');
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      // 1. Capture payment
      const captureResponse = await Apis.paypalCaptureOrder(data.orderID, order);

      // 2. Update local order data with PayPal IDs
      const completedOrder: Order = {
        ...order,
        status: 'paid',
        paymentMethod: 'online',
        onlinePaymentMethod: 'paypal',
        paypalOrderId: captureResponse.data.details.id,
        paypalTransactionId: captureResponse.data.details.purchase_units[0]?.payments?.captures[0]?.id,
        createdAt: new Date().toISOString()
      };

      // 3. Save to your database
      const dbResponse = await Apis.addOrder(completedOrder);

      if (dbResponse) {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Zahlung erfolgreich, aber Bestellspeicherung fehlgeschlagen');
      onError(error);

    }
  }

  const buttonStyles = {
    layout: 'vertical' as const,
    shape: 'rect' as const,
    color: 'blue' as const,
    label: 'paypal' as const,
    tagline: false,
    height: 48
  };

  return (
    <div className="paypal-container">
      <PayPalScriptProvider
        options={{
          ...initialOptions,
          components: 'buttons',
          "enable-funding": "paylater,venmo",
          "disable-funding": "credit,card"
        }}
      >
        <PayPalButtons
          style={buttonStyles}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalPayment;