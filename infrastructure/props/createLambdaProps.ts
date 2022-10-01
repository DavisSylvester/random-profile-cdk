import { IRole } from "aws-cdk-lib/aws-iam";
import { Code, LayerVersionProps, Runtime, LayerVersion } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction, NodejsFunctionProps, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs"
import { LambdaBaseProps } from "../interfaces/lambdaBaseProps";

export const createLambdaFunctionProps = (prop: LambdaBaseProps, role?: IRole, layers?: LayerVersion[]) => {

    
    const lambdaProp: NodejsFunctionProps = {
        entry: path.join(prop.codePath),        
        functionName: prop.name,        
        handler: prop.handler,        
        runtime: prop.runtime || Runtime.NODEJS_16_X,
        timeout: prop.duration || Duration.minutes(2),
        memorySize: prop.memory || 128,
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