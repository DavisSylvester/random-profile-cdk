import { Construct } from "constructs";
import { HttpApi, HttpApiProps, HttpStage, IHttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { appConfig } from "../config/app";

export const createApiGateway (scope: Construct) => {

    const apiGateway = createRestApi(scope);
};

const createRestApi = (scope: Construct) => {
    
    const props: HttpApiProps = {
        apiName: appConfig.API.name,
        description: 'Random Contact Profile API'
    };

    const rootApi = new HttpApi(scope, appConfig.API.name, props);

    const stages = createStages(scope, rootApi);

};

const createStages = (scope: Construct, api: IHttpApi) => {

    const stages = appConfig.GLOBAL.environments.map((stage) => {
        return new HttpStage(scope, `api-stage-${stage}`, {
            httpApi: api,
            stageName: stage,
        });
    });

    return stages;
};
