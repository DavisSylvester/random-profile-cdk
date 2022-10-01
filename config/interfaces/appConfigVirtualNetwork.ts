import { VirtualNetworkSubnet } from "../../infrastructure/interfaces/virtualNetworkSubnet";

export interface AppConfigVirtualNetwork {
    CIDR: string;
    Subnets: Record<string, VirtualNetworkSubnet>;

}

