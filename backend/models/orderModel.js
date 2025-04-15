// models/Order.ts
import mongoose from 'mongoose';

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
    price: { type: String, required: true },
    options: [optionSchema],
    comment: { type: String },
  });

const OrderSchema = new mongoose.Schema({
  cartItem: [CartItemSchema],
  personalDetail: PersonalDetailSchema,
  orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
  paymentMethod: { type: String, enum: ['cash', 'online'], required: true },
  deliveryAddress: { type: DeliveryAddressSchema, required: function () {
    return this.orderType === 'delivery';
  }},
  status: { type: String, default: 'pending' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
