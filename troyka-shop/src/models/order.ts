export interface Product {
  id: number;
  quantity: number;
  attributes: {
    name: string;
    size: any;
    slug: string;
    image: any;
    price: number;
    amount: number;
    locale: string;
    subtitle: string;
    createdAt: string;
    thumbnail: any;
    updatedAt: string;
    categories: string;
    description: string;
    publishedAt: string;
    localizations: any;
    productSlider: any;
    original_price: number;
  };
  selectedSize: 'string';
  oneQuantityPrice: number;
}

export interface Order {
  id: number;
  stripeId?: string;
  products: Product[];
  paymentMethod: string;
  orderId: string;
  status: string;
  addressInfo: any;
  credentialsInfo: {
    email: string,
    firstName: string,
    secondName: string,
    phoneNumber: string
  }
  user?: string | null;
  totalPrice: number;
  isPaid: boolean;
  billingAddressInfo?: any
}
