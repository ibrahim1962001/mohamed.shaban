export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  prepStatus: string;
  available: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  prepStatus: string;
  available: boolean;
  featured: boolean;
}
