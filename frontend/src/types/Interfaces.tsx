export interface OptionValue {
  value: string;
  price?: string;
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
  price: string;
  category: string;
  options?: Option[];
}

export interface CartItem {
  _id?: number;
  name: string;
  price: string;
  options?: Option[];
  comment: string;
}

export interface DeliveryAddress {
  _id?: number,
  street: string,
  postalCode: string,
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

export interface Order {
  _id?: number;
  cartItem: CartItem[];
  orderType: 'delivery' | 'pickup';
  personalDetail: PersonalDetail;
  deliveryAddress?: DeliveryAddress;
  paymentMethod: 'cash' | 'online';
  status: string;
  createdAt: string;
}