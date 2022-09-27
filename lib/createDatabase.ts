import { SecretValue } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType, IVpc, Peer, Port, SecurityGroup, SecurityGroupProps, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, DatabaseInstanceProps, PostgresEngineVersion } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { appConfig } from "../config/app";

export const createDatabase = (scope: Construct, vpc: IVpc) => {

    const props = createCommonDatabaseProp(vpc)
    new DatabaseInstance(scope, 'rnd-db', props);
    createSecurityGroup(scope, vpc)
};

const createCommonDatabaseProp = (vpc: IVpc) => {
    
    const props: DatabaseInstanceProps = {

        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14_3 }),
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        databaseName: appConfig.DATABASE.name,
        instanceIdentifier: appConfig.DATABASE.name.replace("_", "-"),
        publiclyAccessible: true,
        credentials: Credentials.fromPassword(appConfig.DATABASE.adminUsername!, 
            SecretValue.unsafePlainText(appConfig.DATABASE.password!)),
        vpc,
        vpcSubnets: {
          subnetType: SubnetType.PRIVATE_ISOLATED
        },
        securityGroups: [
          
        ],
    };
    console.log('DatabaseProps:', props);

    return props;

};

const createSecurityGroup = (scope: Construct, vpc: IVpc) => {

    const props: SecurityGroupProps = {

        securityGroupName: 'developers-sg',
        vpc,
        description:  'Developer access'
    };

    const devSG = new SecurityGroup(scope, 'random-profile-sg', props);
    devSG.addIngressRule(
        Peer.ipv4('192.1.1.1'),
        Port.tcp(5432),
        'allow Postgres Access to User'
        )
};