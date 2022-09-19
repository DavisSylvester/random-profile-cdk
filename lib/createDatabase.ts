import { SecretValue } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType, IVpc, SecurityGroup, SecurityGroupProps, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, DatabaseInstanceProps, PostgresEngineVersion } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { appConfig } from "../config/app";

export const createDatabase = (scope: Construct, vpc: IVpc) => {

    const props = createCommonDatabaseProp(vpc)
    new DatabaseInstance(scope, 'rnd-db', props);
};

const createCommonDatabaseProp = (vpc: IVpc) => {
    
    const props: DatabaseInstanceProps = {

        engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14_3 }),
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        databaseName: appConfig.DATABASE.name,
        instanceIdentifier: appConfig.DATABASE.name.replace("_", "-"),
        publiclyAccessible: true,
        credentials: Credentials.fromPassword(appConfig.DATABASE.adminUsername, 
            SecretValue.unsafePlainText(appConfig.DATABASE.password)),
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


// const createSecurityGroup = () => {

//     const props: SecurityGroupProps = {

//         securityGroupName: 'developers-sg',
        
        
//     };

//     new SecurityGroup(scope, 'rnd-sg', props);
// };