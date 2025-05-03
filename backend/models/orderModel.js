const mongoose = require('mongoose');
const { optionSchema } = require('./optionModel');

const DeliveryAddressSchema = new mongoose.Schema({
  street: String,
  postalCode: String,
  city: String,
  floor: String,
  comment: String,
}, { _id: false });

const PersonalDetailSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
}, { _id: false });

const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  price: { type: String, required: true },
  options: [optionSchema],
  comment: { type: String },
});

const OrderSchema = new mongoose.Schema({
  cartItem: [cartItemSchema],
  personalDetail: PersonalDetailSchema,
  deliveryAddress: {
    type: DeliveryAddressSchema, required: function () {
      return this.orderType === 'delivery';
    }
  },
  price: { type: String },
  orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
  paymentMethod: { type: String, enum: ['cash', 'online'], required: true },
  onlinePaymentMethod: { type: String, enum: ['paypal', 'giro'], required: false },
  payPalOrderId: { type: String, default: '' },
  paypalTransactionId: { type: String, default: '' },
  status: { type: String, default: 'new' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;


