import { CfnKeyPair, Instance, InstanceClass, InstanceSize, InstanceType, IVpc, MachineImage, OperatingSystemType, Peer, Port, SecurityGroup, SubnetType, UserData } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";


const kp = (scope: Construct) => {
    const kpOne = new CfnKeyPair(scope, `keypair-davis-one`, {
        keyName: 'davis-keypair-one'
    });

    return kpOne;
};

export const createEC2 = (scope: Construct, vpc: IVpc) => {

    const kpResult = kp(scope);

    const name = 'nginx-srv-01';

    const mi = MachineImage.fromSsmParameter(
        '/aws/service/canonical/ubuntu/server/22.10/stable/current/amd64/hvm/ebs-gp2/ami-id',
        {
            os: OperatingSystemType.LINUX
        }
    );

    const mi2 = MachineImage.genericLinux({
        ["us-east-1"]: 'ami-002070d43b0a4f171',
        }
    );

    const developerSecurityGroup = new SecurityGroup(scope, 'developer-security-group', {
        vpc,
    });

    const webServer = new Instance(scope, `web-server-${name}`, {

        vpc,
        vpcSubnets: {
            subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
        // machineImage: 'ami-0aedf6b1cb669b4c7' // CentOS
        // 'ami-08ad748ca6d229b62', // Ubuntu 22.10
        machineImage: mi2,
        keyName: 'davis-samsung', // kpResult.keyName
        instanceName: name,
        securityGroup: developerSecurityGroup,
        userData
    });

    const vpnServer = new Instance(scope, `vpn-server`, {

        vpc,
        vpcSubnets: {
            subnetType: SubnetType.PUBLIC,
        },
        instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
        // machineImage: 'ami-0aedf6b1cb669b4c7' // CentOS
        // 'ami-08ad748ca6d229b62', // Ubuntu 22.10
        machineImage: mi,
        keyName: 'davis-samsung', // kpResult.keyName
        instanceName: `vpn-server-01`,
        securityGroup: developerSecurityGroup,
        userData
    });

    const vpnServer2 = new Instance(scope, `vpn-server-2`, {

        vpc,
        vpcSubnets: {
            subnetType: SubnetType.PUBLIC,
        },
        instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
        // machineImage: 'ami-0aedf6b1cb669b4c7' // CentOS
        // 'ami-08ad748ca6d229b62', // Ubuntu 22.10
        machineImage: mi,
        keyName: 'davis-samsung', // kpResult.keyName
        instanceName: `vpn-server-02`,
        securityGroup: developerSecurityGroup,
        userData
    });

    developerSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'httpIpv4');
    developerSecurityGroup.addIngressRule(Peer.anyIpv6(), Port.tcp(80), 'httpIpv6');
    developerSecurityGroup.addIngressRule(Peer.ipv4("162.248.14.89/32"), Port.allTraffic());

    return [
        webServer,
        vpnServer,
        vpnServer2
    ];
};


const userData = UserData.forLinux();
userData.addCommands(
    // 'apt update',
    // 'apt upgrade',
    // 'apt update',
    // 'apt install openvpn easy-rsa',
    'sudo apt install -y unzip',
    'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"',
    'unzip awscliv2.zip',
    'sudo ./aws/install',
    'aws s3 cp s3://project-artifact-folder/web-server-command.sh .',
    'sudo chmod +x web-server-command.sh',
    './web-server-command.sh',
    '',
    '',
    '',
);

