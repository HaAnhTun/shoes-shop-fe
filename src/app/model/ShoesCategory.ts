import { BaseModel } from "./BaseModel";

export interface ShoesCategory extends BaseModel{
  id?: number;
  code?: string;
  name?: string;
}
