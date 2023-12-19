import { BaseModel } from "./BaseModel";

export interface User extends BaseModel {
    id: number;
    login: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    imageUrl: string;
    activated: boolean;
    authorities: string[];
    address: string;
    dob: string;
}