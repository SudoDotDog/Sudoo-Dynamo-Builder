/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Set
 */

import { DynamoRecord } from "../declare";
import { ExpressionCorrectKeyHandler } from "./correct-key";

export const buildDynamoSetExpression = (records: DynamoRecord[]): string => {

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

export const buildDynamoSetAttributeNames = (records: DynamoRecord[]): Record<string, string> => {

    const attributeNames: Record<string, string> = {};
    const correctKeyHandler: ExpressionCorrectKeyHandler = ExpressionCorrectKeyHandler.fromRecords(records);

    for (const record of records) {
        if (typeof record.value !== 'undefined') {

            const keyKey: string = correctKeyHandler.getCorrectKeyKey(record.key);
            attributeNames[keyKey] = record.key;
        }
    }
    return attributeNames;
};

export const buildDynamoSetAttributeValues = (records: DynamoRecord[]): Record<string, string> => {

    const attributeValues: Record<string, string> = {};
    const correctKeyHandler: ExpressionCorrectKeyHandler = ExpressionCorrectKeyHandler.fromRecords(records);

    for (const record of records) {
        if (typeof record.value !== 'undefined') {

            const correctKeyValue: string = correctKeyHandler.getCorrectValueKey(record.key);
            attributeValues[correctKeyValue] = record.value;
        }
    }
    return attributeValues;
};
