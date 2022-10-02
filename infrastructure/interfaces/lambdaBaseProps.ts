import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { HttpVerbs } from "../../config/classes/types/HttpVerbs";

export interface LambdaBaseProps {
    name: string;    
    codePath: string;
    handler: string;
    duration?: Duration;
    environment?: { [name: string]: string };
    runtime?: Runtime;
    memory?: number;
    method?: HttpVerbs;
    apiName: string;
    path: string;
}