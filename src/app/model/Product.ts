import { Category } from "./Category";
export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  categories: Category[];
  brand: string;
  rating: number;
  image: string;
  inStock: boolean;
}
