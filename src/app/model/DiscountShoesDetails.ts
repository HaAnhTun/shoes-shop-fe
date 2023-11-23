import { Discount } from "./Discount";
import { Product } from "./Product";

export interface DiscountShoesDetails {
  id?: number;
  discount?: Discount;
  shoesDetails: Product;
  discountAmount?: number;
  status?: number;
  brandId?: number;
}
