import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export interface LambdaBaseProps {
    name: string;    
    codePath: string;
    handler: string;
    duration?: Duration;
    environment?: { [name: string]: string };
    runtime?: Runtime;
    memory?: number;
    method?: "get" | "post" | "delete" | "put" | "patch";
    apiName: string;
}