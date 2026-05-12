// ======================================================
// CATEGORY
// ======================================================

export interface ICategory {
  id: number;
  slug: string;
  translations: ICategoryTranslation[];
  products?: IProductSimple[];
}

export interface ICategoryTranslation {
  languageCode: string;
  name: string;
}

export interface IProductSimple {
  id: number;
  name: string;
  price: number;
  slug: string;
}

// ======================================================
// PRODUCT
// ======================================================

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  rate: number;
  slug: string;
  isAvailable: boolean;
  categoryId: number;
  mainImage?: string;
  images: IProductImage[];
}

export interface IProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export interface IProductTranslation {
  id?: number;
  productId?: number;
  languageCode: string;
  name: string;
  description: string;
}

export interface IUpdateProduct {
  id: number;
  price: number;
  rate: number;
  isAvailable: boolean;
  categoryId: number;
  slug: string;
  translations: IProductTranslation[];
  imageUrls: IProductImageDto[];
}

export interface IProductImageDto {
  id: number;
  productId: number;
  imageUrl: string;
  isMain: boolean;
}

// ======================================================
// CART
// ======================================================

export interface ICart {
  id: number;
  userId: string;
  items: ICartItem[];
  totalPrice: number;
}

export interface ICartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IAddToCart {
  cartId?: number;
  productId: number;
  quantity: number;
}

// ======================================================
// ORDER
// ======================================================

export interface IOrder {
  id: number;
  userId: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  orderItems: IOrderItem[];
}

export interface IOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface ICreateOrder {
  userId: string;
  paymentMethod: string;
  orderItems: ICreateOrderItem[];
}

export interface ICreateOrderItem {
  productId: number;
  quantity: number;
}

// ======================================================
// CUSTOMER / CHECKOUT
// ======================================================

export interface ICustomerOrder {
  id: number;
  orderDate: string;
  totalPrice: number;
  status: string;
  statusStep: string;
  paymentMethod: string;
  items: ICustomerOrderItem[];
}

export interface ICustomerOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ICheckout {
  userId: string;
  paymentMethod: string;
}

// ======================================================
// CREATE / UPDATE CATEGORY DTO
// ======================================================

export interface ICreateCategory {
  slug: string;
  translationsJson?: string;
  translations?: ICategoryTranslation[];
}

// ======================================================
// CREATE / UPDATE PRODUCT DTO
// ======================================================

export interface ICreateProduct {
  price: number;
  rate: number;
  isAvailable: boolean;
  categoryId: number;
  slug: string;

  translationsJson?: string;
  translations?: IProductTranslation[];

  images?: ICreateProductImage[];
}

export interface ICreateProductImage {
  imageFile: File;
  isMain: boolean;
}

// ======================================================
// API RESPONSE
// ======================================================

export interface IApiResponse {
  message: string;
}

export interface IApiErrorResponse {
  statusCode: number;
  message: string;
}