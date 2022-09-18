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
        cidr: appConfig.VIRTUAL_NETWORK.CIDR,
        subnetConfiguration: [
            {
                subnetType: SubnetType.PRIVATE_ISOLATED,
                name: appConfig.VIRTUAL_NETWORK.RDS.NAME,
                cidrMask: appConfig.VIRTUAL_NETWORK.RDS.CIDR_MASK,
                
            },

            {
                subnetType: SubnetType.PUBLIC,
                name: appConfig.VIRTUAL_NETWORK.PUBLIC.NAME,
                cidrMask: appConfig.VIRTUAL_NETWORK.PUBLIC.CIDR_MASK
            },

            {
                subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                name: appConfig.VIRTUAL_NETWORK.PUBLIC.NAME,
                
            }
        ],
    };

    return props;
};
