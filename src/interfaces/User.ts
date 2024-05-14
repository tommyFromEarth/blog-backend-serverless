import { IAddress } from "./Address";
import { ICompany } from "./Company";

export interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    address: IAddress;
    phone: string;
    website: string;
    company: ICompany
}
