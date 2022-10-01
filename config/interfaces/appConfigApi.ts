import { LambdaBaseProps } from "../../infrastructure/interfaces/lambdaBaseProps";
import { LambdaNames } from "../classes/types/lambdaNames";

export interface AppConfigApi {
    name: string;
    description: string;
    LAMBDAS: Record<LambdaNames, LambdaBaseProps>;
}