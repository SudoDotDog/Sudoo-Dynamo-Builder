/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Update
 */

import { DynamoUpdateRecord } from "../declare";
import { ExpressionCorrectKeyHandler } from "./correct-key";
import { buildDynamoSetAttributeNames, buildDynamoSetAttributeValues } from "./set";

export const buildDynamoUpdateExpression = (records: DynamoUpdateRecord[]): string => {

    const expressionStack: string[] = [];
    const correctKeyHandler: ExpressionCorrectKeyHandler = ExpressionCorrectKeyHandler.fromRecords(records);

    for (const record of records) {

        if (typeof record.value !== 'undefined') {

            if (expressionStack.length > 0) {
                expressionStack.push(', ');
            }

            const keyKey: string = correctKeyHandler.getCorrectKeyKey(record.key);
            const valueKey: string = correctKeyHandler.getCorrectValueKey(record.key);

            switch (record.type) {
                case 'base':
                    expressionStack.push(`${keyKey} = ${valueKey}`);
                    break;
                case 'list-append':
                    expressionStack.push(`${keyKey} = list_append(${keyKey}, ${valueKey})`);
                    break;
            }
        }
    }

    if (expressionStack.length > 0) {
        expressionStack.unshift('set ');
    }
    return expressionStack.join('');
};

export const buildDynamoUpdateAttributeNames = (records: DynamoUpdateRecord[]): Record<string, string> => {

    return buildDynamoSetAttributeNames(records);
};

export const buildDynamoUpdateAttributeValues = (records: DynamoUpdateRecord[]): Record<string, any> => {

    return buildDynamoSetAttributeValues(records);
};
