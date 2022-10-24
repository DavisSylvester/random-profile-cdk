import { Construct } from "constructs";
import { DomainName, EndpointType, HttpApi, HttpApiProps, HttpMethod, HttpStage, IHttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { appConfig } from "../config/app";
import { NodejsFunction, NodejsFunctionProps, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaBaseProps } from "./interfaces/lambdaBaseProps";
import * as path from "path";
import { CfnOutput, Duration } from "aws-cdk-lib";
import { IRole } from "aws-cdk-lib/aws-iam";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";
import { PropRecordHelper } from "../config/helpers/propHelper";
import { LambdaNames } from "../config/classes/types/lambdaNames";
import { HttpVerbs } from "../config/classes/types/HttpVerbs";
import { Certificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { CnameRecord } from "aws-cdk-lib/aws-route53";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";



export const createApiGateway = (scope: Construct, cert: ICertificate) => {

    const lambdaConfigProps = new PropRecordHelper<LambdaNames, LambdaBaseProps>()
        .extractRecordValues(appConfig.RESOURCES.API.LAMBDAS);
    const domainName = addCert(scope, cert);

    const zone = HostedZone.fromHostedZoneAttributes(scope, `${appConfig.GLOBALS.name}-hosted-zone-apigateway`,
        {
            hostedZoneId: appConfig.RESOURCES.DNS.zoneId,
            zoneName: appConfig.RESOURCES.DNS.domainName
        });
    
    const restApi = createRestApi(scope, domainName);
    const stages = createStages(scope, restApi);
    const lambdas = createLambdaFunctions(scope, lambdaConfigProps);
    addRoutesToApi(restApi, lambdas, lambdaConfigProps);

    const apiUrl = restApi.apiId;
    console.log('apiUrl: ', apiUrl);

    // new ARecord(scope, 'apiAliasRecord', {
    //     zone: zone,
    //     target: RecordTarget.fromAlias(new route53Targets.ApiGatewayv2DomainProperties(domain))
    //   })
    const cname = new CnameRecord(scope, `CnameApiRecord`, {
        recordName: appConfig.RESOURCES.DNS.apiSubDomain.split('.')[0],
        zone,
        domainName: domainName.regionalDomainName,
    });
    // new CnameRecord(scope, `CnameApiRecord`, {
    //     recordName: appConfig.RESOURCES.DNS.apiSubDomain.split('.')[0],
    //     zone,
    //     domainName: apiUrl,
    //   });

    //   new ARecord(scope, "apiDNS", {
    //     zone,
    //     recordName: "api-test",
    //     target: RecordTarget.fromAlias(
    //       new HttpApi(restApi)
    //     ),
    //   });
      
    createLambdaOutput(scope, lambdas);
    createApiOutput(scope, [restApi]);
};

// const createRestApi = (scope: Construct, domain: DomainName) => {   
const createRestApi = (scope: Construct, domain: DomainName): HttpApi => {

    const props: HttpApiProps = {
        apiName: appConfig.RESOURCES.API.name,
        description: appConfig.RESOURCES.API.description,
        defaultDomainMapping: {
            domainName: domain,            
          },
    };

    const rootApi = new HttpApi(scope, appConfig.RESOURCES.API.name, props);

    return rootApi;

};

const createStages = (scope: Construct, api: IHttpApi) => {

    const stages = appConfig.GLOBALS.environments.map((stage) => {
        return new HttpStage(scope, `api-stage-${stage}`, {
            httpApi: api,
            stageName: stage,
        });
    });

    return stages;
};

const createLambdaFunctions = (scope: Construct, lambdaConfigProps: LambdaBaseProps[]) => {

    const listOfProps = createLambdaProps(lambdaConfigProps);

    const createdLambdas: NodejsFunction[] = createLambdaFunction(scope, listOfProps);


    return createdLambdas;
}

const createLambdaFunction = (scope: Construct, listOfProps: NodejsFunctionProps[]) => {

    return listOfProps.map((prop) => {
        return new NodejsFunction(scope, prop.functionName!, prop);
    });

};

const createLambdaProps = (lambdaProps: LambdaBaseProps[]) => {
    return lambdaProps.map((prop) => {
        return createLambdaIntegrationProps(prop)
    });
};

const createLambdaIntegrationProps = (prop: LambdaBaseProps, role?: IRole,
    layers?: LayerVersion[]) => {

    const lambdaProp: NodejsFunctionProps = {
        entry: path.join(prop.codePath),
        functionName: prop.name,
        handler: prop.handler,
        runtime: prop.runtime || appConfig.GLOBALS.stackRuntime,
        timeout: prop.duration || Duration.minutes(2),
        memorySize: prop.memory || 256,
        environment: {
            "VERBOSE_LOGGING": "true",
            ...prop.environment
        },
        bundling: {
            minify: false,
            target: 'es2020',
            sourceMap: true,
            sourceMapMode: SourceMapMode.EXTERNAL,
            environment: prop.environment || undefined,
        },
        role,
        layers

    }
    return lambdaProp;


};

const addRoutesToApi = (httpApi: HttpApi, lambdas: NodejsFunction[],
    lambdaConfigProps: LambdaBaseProps[]) => {

    lambdaConfigProps.map((config, idx) => {
        const integration = new HttpLambdaIntegration(`integration-${config.name}`, lambdas[idx]);

        httpApi.addRoutes({
            path: config.path,
            methods: [ getUsableHttpVerb(config.method || 'get')],
            integration: integration,
        });
    });
};

const getUsableHttpVerb = (verb: HttpVerbs) => {

    switch (verb.toLowerCase()) {
        case "get":
            return HttpMethod.GET;

        case "post":
            return HttpMethod.POST;

        case "patch":
            return HttpMethod.PATCH;

        case "put":
            return HttpMethod.PUT;

        case "delete":
            return HttpMethod.DELETE;
        default:
            throw new Error(`${verb} is not a supported Http Verb`);            
           
    }
};

const createLambdaOutput = (scope: Construct, lambdas: NodejsFunction[]) => {
    lambdas.forEach((lambda, idx) => {

        new CfnOutput(scope, `lambdas${idx}`, {
            exportName: 'Function-Name',
            value: lambda.functionName
        });
    });
};

const createApiOutput = (scope: Construct, apis: HttpApi[]) => {
    apis.forEach((api, idx) => {

        new CfnOutput(scope, `api-${idx}`, {
            exportName: 'Http-API-Name',
            value: api.defaultStage?.domainUrl!
        });
    });
};


const addCert = (scope: Construct, cert: ICertificate) => {
    const customDomain = new DomainName(scope, `${appConfig.RESOURCES.DNS.apiSubDomain}-gateway`, {
        domainName: appConfig.RESOURCES.DNS.apiSubDomain,        
        certificate: Certificate.fromCertificateArn(scope, 'cert', 
        cert.certificateArn),
        endpointType: EndpointType.REGIONAL,
        
        
      });

      

      return customDomain;
};

// const addCNameRecord = (scope: Construct, restApi: IHttpApi) => {
//     new CnameRecord(scope, "apiDNS", {
//         zone: zone,
//         domainName: appConfig.RESOURCES.DNS.domainName,
//         recordName: appConfig.RESOURCES.DNS.apiSubDomain.split('.')[2]

        
//       });
// };