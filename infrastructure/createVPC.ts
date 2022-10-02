import { SubnetType, Vpc, VpcProps } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { appConfig } from "../config/app";

export const createVPC = (scope: Construct) => {

    const props = createVpcProps(scope);
    const vpc = new Vpc(scope, 'create-vpc', props);
    return vpc;
};

const createVpcProps = (scope: Construct) => {
    
    const props: VpcProps = {

        vpcName: 'random-profile-vpc',
        cidr: appConfig.RESOURCES.VIRTUAL_NETWORK.CIDR,
        subnetConfiguration: [
            {
                subnetType: SubnetType.PRIVATE_ISOLATED,
                name: appConfig.RESOURCES.VIRTUAL_NETWORK.Subnets.DATABASE.NAME,
                cidrMask: appConfig.RESOURCES.VIRTUAL_NETWORK.Subnets.DATABASE.CIDR_MASK,
                
            },

            {
                subnetType: SubnetType.PUBLIC,
                name: appConfig.RESOURCES.VIRTUAL_NETWORK.Subnets.PUBLIC.NAME,
                cidrMask: appConfig.RESOURCES.VIRTUAL_NETWORK.Subnets.PUBLIC.CIDR_MASK
            },

            {
                subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                name: appConfig.RESOURCES.VIRTUAL_NETWORK.Subnets.PRIVATE.NAME,
                
            }
        ],
    };

    return props;
};
