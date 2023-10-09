import { BaseModel } from "./BaseModel";

export interface ShoesCategoryValue extends BaseModel {
  id?: number;
  value?: string;
  description?: string;
}
