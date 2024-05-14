import { DecimalNumber } from "aws-sdk/clients/glue";

export interface IGeo {
    lat: DecimalNumber;
    lng: DecimalNumber
}
