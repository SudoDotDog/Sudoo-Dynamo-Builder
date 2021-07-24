/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Key
 */

export const buildDynamoKeyExpression = (keys: string[]): string | undefined => {

    if (keys.length === 0) {
        return undefined;
    }

    return keys.join(", ");
};
