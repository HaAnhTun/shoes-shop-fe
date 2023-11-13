import { BrandData } from "./Brand";
import { ColorData } from "./Color";
import { Shoes } from "./Shoes";
import { SizeData } from "./Size";

export interface ShoesDetail {
  id?: number;
  code: string;
  price: number;
  import_price: number;
  tax: number;
  quantity: number;
  status: number;
  images: File[];
  description: string;
  shoes: Shoes;
  brand: BrandData;
  color: ColorData;
  size: SizeData;
}
