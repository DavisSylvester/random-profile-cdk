import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { AppConfigParams } from "./interfaces/appConfigParams";

export const appConfig: AppConfigParams = {

    GLOBALS: {
        name: 'Random-Profile',
        environments: ['dev', 'staging', 'prod'],
        accountNumber: process.env.CDK_DEPLOYMENT_ACCOUNT_NUMBER || '',
        region: process.env.CDK_DEPLOYMENT_REGION || '',
        stackRuntime: Runtime.NODEJS_16_X,
    },
    RESOURCES: {
        DATABASE: {
            adminUsername: process.env.DATABASE_USERNAME || '',
            password: process.env.DATABASE_PASSWORD || '',
            name: 'profile_contact'
        },
        VIRTUAL_NETWORK: {
            CIDR: '172.16.12.0/22',
            Subnets: {
                RDS: {
                    CIDR_MASK: 28,
                    NAME: 'random-profile-private-db'
                },
                PRIVATE: {
                    NAME: 'random-profile-nat',
                },
                PUBLIC: {
                    CIDR_MASK: 24,
                    NAME: 'random-profile-public',
                }
            }
        },
        API: {
            name: 'Random-Profile-Api',
            description: 'Random Contact Profile API',
            LAMBDAS: {
                GetProfile: {
                    name: `get-profile`,
                    runtime: Runtime.NODEJS_16_X,
                    codePath: './resources/functions/profile/index.ts',
                    handler: 'get',
                    duration: Duration.minutes(3),
                    environment: undefined,
                    memory: 128,
                    method: 'get',
                    apiName: 'profile',
                },
            },
        },
        CICD: {
            name: '',
            repoName: ''
        }
    },


};