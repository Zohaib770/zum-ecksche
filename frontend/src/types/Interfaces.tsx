export interface OptionValue {
  value: string;
  price?: number;
}

export interface Option {
  _id?: number;
  name: string;
  values?: OptionValue[];
}

export interface Category {
  _id?: number;
  imageUrl?: string;
  name: string;
  description?: string;
  options?: Option[];
}

export interface Food {
  _id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  options?: Option[];
}

export interface CartItem {
  _id?: number;
  name: string;
  quantity: number;
  price: number;
  options?: Option[];
  comment: string;
}

export interface DeliveryAddress {
  _id?: number,
  street: string,
  postalCode: number,
  city: string,
  floor: string,
  comment: string,
}

export interface PersonalDetail {
  _id?: number,
  fullName: string,
  email: string,
  phone: string
}

export interface DeliveryZone {
  name: string,
  distance: string,
  min_order_price: number,
  delivery_fee: number
}

export interface Extra {
  category: string,
  value: {
    name: string,
    price: number
  }
}

export interface Order {
    _id?: number;
  cartItem: CartItem[];
  personalDetail: PersonalDetail;
  deliveryAddress?: DeliveryAddress;
  price: number;
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'online';
  onlinePaymentMethod?: 'paypal' | 'giro';
  paypalOrderId: string,
  paypalTransactionId: string,
  status: string;
  createdAt: string;
}