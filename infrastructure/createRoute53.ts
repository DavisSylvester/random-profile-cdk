import { CfnOutput } from "aws-cdk-lib";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
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