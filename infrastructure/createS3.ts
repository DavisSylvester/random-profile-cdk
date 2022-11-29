import { RemovalPolicy } from "aws-cdk-lib";
import { Instance } from "aws-cdk-lib/aws-ec2";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export const createS3 = (scope: Construct, ec2: Instance[]) => {

    const projectBucket = new Bucket(scope, 'project-artifact-folder', {

        bucketName: 'project-artifact-folder',
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
    });

    new BucketDeployment(scope, 'DeployWebsite', {
        sources: [Source.asset('./infrastructure/props/ec2/')],
        destinationBucket: projectBucket,
        
      });

      ec2.forEach((x) => {
        projectBucket.grantReadWrite(x);
      });

      return [
        projectBucket
      ];
    
};