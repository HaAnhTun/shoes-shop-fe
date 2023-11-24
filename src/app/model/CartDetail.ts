import { Cart } from "./Cart";
import { ShoesDetail } from "./ShoesDetail";

export interface CartDetail {
  id: number;
  quantity: number;
  status?: number;
  Cart: Cart;
  shoesDetails: ShoesDetail;
  lastModifiedBy: string;
  lastModifiedDate: string;
  checkBox: boolean;
}
