import { ShoesDetail } from "../components/shoes-detail-add/shoes-detail-add.component";
import { Order } from "./Order";

export interface OrderDetals {
  id?: number;
  quantity?: number;
  price?: number;
  discount?: number;
  status?: number;
  order?: Order;
  shoesDetails: ShoesDetail;
}
