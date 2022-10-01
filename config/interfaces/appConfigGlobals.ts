import { Runtime } from "aws-cdk-lib/aws-lambda";

export interface AppGlobal {
    name: string;
    environments: string[];
    accountNumber: string;
    region: string;
    stackRuntime: Runtime,
}