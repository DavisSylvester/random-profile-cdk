import { CfnOutput } from "aws-cdk-lib";
import { IRestApi, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";
import { appConfig } from "../config/app";

export const createRoute53 = (scope: Construct) => {

    const myHostedZone = HostedZone.fromHostedZoneId(scope, `${appConfig.GLOBALS.name}-hosted-zone`,
        appConfig.RESOURCES.DNS.zoneId!);

    const cert = new Certificate(scope, `${appConfig.GLOBALS.name}-certificate`, {
        domainName: appConfig.RESOURCES.DNS.apiSubDomain,
        validation: CertificateValidation.fromDns(myHostedZone),
      });
    
    new CfnOutput(scope, `${appConfig.GLOBALS.name}-certificate-output`, {
        value: cert.certificateArn,        
    });

    return cert;
};