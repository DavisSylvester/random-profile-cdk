import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { createEC2 } from "../infrastructure/createEC2";

export class ServerStack extends Stack {

    constructor(scope: Construct, id: string, vpc: IVpc, props?: StackProps) {
        super(scope, id, props);

        const ec2 = createEC2(this, vpc);
        

    }
}