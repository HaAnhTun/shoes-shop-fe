import { Cart } from "./Cart";
import { ShoesDetail } from "./ShoesDetail";

export interface CartDetailSave {
  quantity?: number;
  status?: 1;
  shoesDetails?: ShoesDetail;
}
