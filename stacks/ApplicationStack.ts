import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { createApiGateway } from "../infrastructure/createApiGateway";
import { createRoute53 } from "../infrastructure/createRoute53";

export class ApplicationStack extends Stack {
    constructor(scope: Construct, id: string, vpc: IVpc, props?: StackProps) {
        super(scope, id, props);

       const cert = createRoute53(this);
        const db = createApiGateway(this, cert);
        

    }
}