import { CIDR_MASK } from "../classes/types/cidrMask";

export interface VirtualNetworkSubnet {
    CIDR_MASK?: CIDR_MASK;
    NAME: string;
}