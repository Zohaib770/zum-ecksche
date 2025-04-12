
export interface Category {
  _id?: Number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Food {
  _id?: Number;
  name: string;
  description: string;
  price: String;
  category: String;
  options?: {
    name: string;
    values: {
      value: string;
      priceAdjustment: number;
    }[];
  }[];
  isAvailable?: boolean;
  order?: number;
}

export interface Option {
  _id?: Number;
  name: string;
}