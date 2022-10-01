import { LambdaBaseProps } from "../../infrastructure/interfaces/lambdaBaseProps";
import { LambdaNames } from "../classes/types/lambdaNames";

export interface AppConfigLambda {
    name: string;
    LAMBDAS: Record<LambdaNames, LambdaBaseProps>;

}