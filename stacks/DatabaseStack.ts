import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { createDatabase } from "../lib/createDatabase";

export class DatabaseStack extends Stack {
    constructor(scope: Construct, id: string, vpc: IVpc, props?: StackProps) {
      super(scope, id, props);
  
     const db = createDatabase(this, vpc);
  
      
    }
  }
  