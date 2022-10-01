import { Construct } from "constructs";
import { AddRoutesOptions, HttpApi, HttpApiProps, HttpMethod, HttpStage, IHttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { appConfig } from "../config/app";
import { NodejsFunction, NodejsFunctionProps, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaBaseProps } from "./interfaces/lambdaBaseProps";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { IRole } from "aws-cdk-lib/aws-iam";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";
import { PropRecordHelper } from "../config/helpers/propHelper";
import { LambdaNames } from "../config/classes/types/lambdaNames";

export const createApiGateway = (scope: Construct) => {


    const restApi = createRestApi(scope);
    const stages = createStages(scope, restApi);

};

const createRestApi = (scope: Construct) => {

    const props: HttpApiProps = {
        apiName: appConfig.RESOURCES.API.name,
        description: appConfig.RESOURCES.API.description
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



const addRoutes = (api: HttpApi) => {

    
    
    api.addRoutes(props);
};

const createLambdaFunctions = (scope: Construct) => {      

    const lambdaConfigProps =  new PropRecordHelper<LambdaNames, LambdaBaseProps>().extractRecordValues(appConfig.RESOURCES.API.LAMBDAS);

    const listOfProps = createLambdaProps(lambdaConfigProps);

    const createdLambdas: NodejsFunction[] = createLambdaFunction(scope, listOfProps);

    return createdLambdas;
}

const createLambdaFunction = (scope: Construct, listOfProps: NodejsFunctionProps[]) => {

    return listOfProps.map((prop) => {
        return new NodejsFunction(scope, prop.name, prop);
    });
    
};

const createLambdaProps = (lambdaProps: LambdaBaseProps[]) => {
    return lambdaProps.map((prop) => { 
        return createLambdaIntegrationProps(prop)
    });
};

const createLambdaIntegrationProps = (prop: LambdaBaseProps, role?: IRole, layers?: LayerVersion[]) => {

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