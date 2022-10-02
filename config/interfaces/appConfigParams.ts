import { Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaBaseProps } from "../../infrastructure/interfaces/lambdaBaseProps";
import { LambdaNames } from "../classes/types/lambdaNames";
import { AppConfigApi } from "./appConfigApi";
import { AppConfigCiCd } from "./appConfigCiCd";
import { AppConfigDatabase } from "./appConfigDatabase";
import { AppConfigDNS } from "./AppConfigDNS";
import { AppGlobal } from "./appConfigGlobals";
import { AppConfigVirtualNetwork } from "./appConfigVirtualNetwork";

export interface AppConfigParams {    
     
    GLOBALS: AppGlobal,    
    RESOURCES: {
        API: AppConfigApi,
        DATABASE: AppConfigDatabase,
        VIRTUAL_NETWORK: AppConfigVirtualNetwork,
        CICD: AppConfigCiCd,
        DNS: AppConfigDNS,
        // lambdaLayers: Record<LambdaLayerName, C1cxLambdaLayerProp>,
        // apiGateways: Record<PexipRestApiName, C1ApiGatewayProp>,
        // dynamoDB_tables: Record<DynamoDbTableName, C1DynamoProp>
    }
};