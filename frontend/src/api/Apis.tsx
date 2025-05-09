import { axiosPublic, axiosPrivate } from './AxiosInstance';
import { Category, Food, Option, Order, DeliveryZone, Extra } from '../types/Interfaces';

const Apis = {

  //user-login
  userLogin: async (email: string, password: string) => {
    try {
      const response = await axiosPublic.post('/api/login', { email, password });
      return response;
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Kategorie:', error);
      throw error;
    }
  },

  // categorie
  fetchCategories: async () => {
    try {
      const response = await axiosPublic.get('/api/fetch-all-category');
      return response.data as Category[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Kategorien:', error);
      throw error;
    }
  },

  addCategory: async (formData: FormData) => {
    try {
      await axiosPrivate.post('/api/create-category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Kategorie:', error);
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    try {
      await axiosPrivate.post('/api/delete-category', { categoryId: id });
    } catch (error) {
      console.error('Fehler beim delete der Kategorie:', error);
      throw error;
    }
  },

  // food
  fetchFoodsByCategory: async (categoryId: string) => {
    try {
      const response = await axiosPublic.get(`/api/fetch-foods-by-category/${categoryId}`);
      return response.data as Food[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Speisen für Kategorie:', error);
      throw error;
    }
  },

  fetchFood: async () => {
    try {
      const response = await axiosPublic.get(`/api/fetch-all-foods`);
      return response.data as Food[];
    } catch (error) {
      console.error('Fehler beim Abrufen Foods', error);
      throw error;
    }
  },

  addFood: async (food: Food) => {
    try {
      await axiosPrivate.post('/api/create-food', food);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Speise:', error);
      throw error;
    }
  },

  updateFood: async (id: number, food: Food) => {
    try {
      const response = await axiosPrivate.put(`/api/update-food/${id}`, food);
    return response.data;
    } catch (error) {
      console.error('Fehler beim bearbeiten der Speise:', error);
      throw error;
    }
  },

  deleteFood: async (id: number) => {
    try {
      await axiosPrivate.post('/api/delete-food', { foodId: id });
    } catch (error) {
      console.error('Fehler beim delete der Food:', error);
      throw error;
    }
  },

  //order
  addOrder: async (order: Order) => {
    try {
      const response = await axiosPublic.post('/api/create-order', order);
      return response;
    } catch (error) {
      console.error('Fehler beim Abrufen der Option:', error);
      throw error;
    }
  },

  fetchOrder: async () => {
    try {
      const response = await axiosPrivate.get('/api/fetch-all-order');
      return response.data as Order[];
    } catch (error) {
      console.error('Fehler beim Abrufen der fetch all order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: number, newStatus: string) => {
    try {
      const response = await axiosPrivate.post('/api/update-order-status', {
        orderId,
        newStatus,
      });
      return response.data as Order;
    } catch (error) {
      console.error('Fehler beim Abrufen der update order:', error);
      throw error;
    }
  },

  //option
  fetchOption: async () => {
    try {
      const response = await axiosPublic.get('/api/fetch-option');
      return response.data as Option[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Option:', error);
      throw error;
    }
  },

  //deliveryzone
  fetchDeliveryzone: async () => {
    try {
      const response = await axiosPublic.get('/api/fetch-deliveryzone');
      return response.data as DeliveryZone[];
    } catch (error) {
      console.error('Fehler beim Abrufen der deliveryzone:', error);
      throw error;
    }
  },

  //extra
  fetchExtra: async () => {
    try {
      const response = await axiosPublic.get('/api/fetch-extra');
      return response.data as Extra[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Extra:', error);
      throw error;
    }
  },

  //payment
  paypalCreateOrder: async (orderData: Order) => {
    try {
      const response = await axiosPublic.post('/api/paypal-create-order', {
        total: orderData.price,
        currency: 'EUR',
        items: orderData.cartItem.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customer: orderData.personalDetail
      });
      return response.data.id;
    } catch (error) {
      console.error('PayPal order creation failed:', error);
      throw error;
    }
  },

  paypalCaptureOrder: async (orderID: string, orderData: Order) => {
    try {
      const response = await axiosPublic.post('/api/paypal-capture-order', {
        orderID,
        orderData: {
          ...orderData,
          paymentMethod: 'online'
        }
      });
      return response;
    } catch (error) {
      console.error('PayPal capture failed:', error);
      throw error;
    }
  },

  stripeCreateOrder: async (order: Order) => {
    try {
      const response = await axiosPublic.post('/api/stripe-create-order', {
        amount: order.price * 100, // Stripe erwartet Cent-Beträge
        currency: 'eur',
        metadata: {
          orderId: order._id,
          customerEmail: order.personalDetail.email,
        },
        payment_method_types: ['giropay'],
      });
      return response;
    } catch (error) {
      console.error('stripe order creation failed:', error);
      throw error;
    }
  },

};

export default Apis;