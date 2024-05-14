import { IGeo } from "./Geo";

export interface IAddress {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: IGeo;
}
