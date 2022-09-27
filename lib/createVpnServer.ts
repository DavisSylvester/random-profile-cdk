import { Instance, InstanceClass, InstanceSize, InstanceType, IVpc, 
    MachineImage, SubnetType, UserData } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export const createVpnServer = (scope: Construct, vpc: IVpc) => {
    const userData = UserData.forLinux();
    userData.addCommands(
        'apt update',
        'apt upgrade',
        'apt update',
        'apt install openvpn easy-rsa',
        '',
        '',
        '',
        '',
    );


    const ec2Instance = new Instance(scope, 'ec2-instance', {
        vpc,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
        instanceType: InstanceType.of(
          InstanceClass.BURSTABLE2,
          InstanceSize.MICRO,
        ),
        machineImage: MachineImage.fromSsmParameter("/aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id"),
        keyName: 'davis-ec2-key-pair',
        userData
      });
    
  
};
