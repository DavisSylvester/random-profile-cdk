import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export const appConfig = {

    GLOBAL: {
        name: 'Random-Profile',
        environments: ['dev', 'staging', 'prod'],
    },
    DATABASE: {
        adminUsername: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: 'profile_contact'
    },
    VIRTUAL_NETWORK: {
        CIDR: '172.16.12.0/22',
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
    },
    API: {
        name: 'Random-Profile-Api',
        LAMBDAS: {
            'createClient': {
                name: `create-client`,
                runtime: Runtime.NODEJS_16_X,
                codePath: './resources/functions/profile/index.ts',
                handler: 'get',
                duration: Duration.minutes(3),
                environment: undefined,
                memory: 128,
                method: 'get',
                apiName: 'profile',
        }
    }
};