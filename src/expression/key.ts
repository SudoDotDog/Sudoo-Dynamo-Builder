/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Key
 */

export const buildDynamoKeyExpression = (keys: string[]): string => {

    return keys.join(", ");
};
