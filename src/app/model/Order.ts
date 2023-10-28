import { User } from "./User";

export interface Order{
    id : Number;
    code : string;
    address : string;
    phone : string;
    paymentMethod : Number;
    shipPrice : Number;
    totalPrice : Number;
    receivedBy : string;
    receivedDate: string;
    shippedDate: string;
    status : string;
    owner : User;
    createdDate: string;
}