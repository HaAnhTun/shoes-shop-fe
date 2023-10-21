import { BaseModel } from "./BaseModel";
import { ShoesCategoryValue } from "./ShoesCategoryValue";

export interface ShoesCategory extends BaseModel {
  id?: number;
  code?: string;
  name?: string;
  shoesCategoryValueDTOList?: ShoesCategoryValue[];
}
