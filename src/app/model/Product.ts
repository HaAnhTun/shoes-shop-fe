import { ShoesDetail } from "../components/shoes-detail-add/shoes-detail-add.component";
import { Category } from "./Category";
import { ColorData } from "./Color";
import { SizeData } from "./Size";
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
  shoesDetails?: ShoesDetail[];
  sizeDTOS?: SizeData[];
  colorDTOS?: ColorData[];
}
