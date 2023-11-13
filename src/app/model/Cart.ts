import { User } from "./User";

export interface Cart {
  id?: number;
  code: string;
  status?: number;
  owner: User;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
