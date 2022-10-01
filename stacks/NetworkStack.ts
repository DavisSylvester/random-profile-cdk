import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { createVPC } from "../infrastructure/createVPC";

export class NetworkStack extends Stack {

    vpc: IVpc;

    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
  
     const vpc = createVPC(this,)
  
      this.vpc = vpc;
    }
  }
  