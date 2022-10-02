import { VirtualNetworkSubnet } from "../../infrastructure/interfaces/virtualNetworkSubnet";
import { SubnetName } from "../classes/types/subnetNames";

export interface AppConfigVirtualNetwork {
    CIDR: string;
    Subnets: Record<SubnetName, VirtualNetworkSubnet>;

}

