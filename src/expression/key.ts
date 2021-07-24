/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Key
 */

import { DynamoRecord } from "../declare";
import { ExpressionCorrectKeyHandler } from "./correct-key";

export const buildDynamoKeyExpression = (records: DynamoRecord[]): string => {

    const expressionStack: string[] = [];
    const correctKeyHandler: ExpressionCorrectKeyHandler = ExpressionCorrectKeyHandler.fromRecords(records);

    for (const record of records) {

        if (typeof record.value !== 'undefined') {

            if (expressionStack.length > 0) {
                expressionStack.push(', ');
            }

            const keyKey: string = correctKeyHandler.getCorrectKeyKey(record.key);
            const valueKey: string = correctKeyHandler.getCorrectValueKey(record.key);
            expressionStack.push(`${keyKey} = ${valueKey}`);
        }
    }

    if (expressionStack.length > 0) {
        expressionStack.unshift('set ');
    }
    return expressionStack.join('');
};
