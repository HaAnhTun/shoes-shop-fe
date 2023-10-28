export interface Discount {
  id: number;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  discountMethod: number;
  discountAmount: number;
  discountStatus: number;
}
