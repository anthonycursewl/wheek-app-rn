export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  code?: string;
  barcode?: string;
  stock?: number;
  unit?: string;
  category?: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category?: string;
  date: string;
  paymentMethod?: string;
  notes?: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber?: string;
  providerName: string;
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
