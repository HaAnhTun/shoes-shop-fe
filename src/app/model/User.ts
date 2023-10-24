import { BaseModel } from "./BaseModel";

export interface User extends BaseModel {
    login: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
}