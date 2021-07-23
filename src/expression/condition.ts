/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Condition
 */

import { DynamoSearchCombination, DynamoSearchOperator, DynamoSearchRecord } from "../declare";
import { ExpressionCorrectKeyHandler } from "./correct-key";

const buildExpressionOperations = (keyKey: string, valueKey: string, operator: DynamoSearchOperator) => {

    if (operator === 'contains') {
        return `contains(${keyKey}, ${valueKey})`;
    }

    return `${keyKey} ${operator} ${valueKey}`;
};

export const buildDynamoConditionExpression = (combinations: DynamoSearchCombination[]): string => {

    const expressionStack: string[] = [];
    const correctKeyHandler: ExpressionCorrectKeyHandler = ExpressionCorrectKeyHandler.fromCombinations(combinations);

    combination: for (const combination of combinations) {

        if (combination.records.length === 0) {
            continue combination;
        }

        const records: DynamoSearchRecord[] = combination.records;
        if (combination.records.length === 1) {

            for (const record of records) {

                if (typeof record.value !== 'undefined') {

                    if (expressionStack.length > 0) {
                        expressionStack.push(' AND ');
                    }

                    const keyKey: string = correctKeyHandler.getCorrectKeyKey(record.key);
                    const valueKey: string = correctKeyHandler.getCorrectValueKey(record.key);

                    const expressionOperation: string = buildExpressionOperations(keyKey, valueKey, record.operator);
                    expressionStack.push(expressionOperation);
                }
            }
            continue combination;
        }

        const recordsStack: string[] = [];
        for (const record of records) {

            let andJoined: boolean = false;
            if (typeof record.value !== 'undefined') {

                if (recordsStack.length > 0 && !andJoined) {
                    expressionStack.push(` AND `);
                    andJoined = true;
                }

                const keyKey: string = correctKeyHandler.getCorrectKeyKey(record.key);
                const valueKey: string = correctKeyHandler.getCorrectValueKey(record.key);

                const expressionOperation: string = buildExpressionOperations(keyKey, valueKey, record.operator);
                recordsStack.push(expressionOperation);
            }
        }
        expressionStack.push(`(${recordsStack.join(` ${combination.relation} `)})`);
    }

    return expressionStack.join('');
};

export const buildDynamoConditionAttributeNames = (combinations: DynamoSearchCombination[]): Record<string, string> => {

    const attributeNames: Record<string, string> = {};
    const correctKeyHandler: ExpressionCorrectKeyHandler = ExpressionCorrectKeyHandler.fromCombinations(combinations);

    for (const combination of combinations) {
        for (const record of combination.records) {
            if (typeof record.value !== 'undefined') {

                const keyKey: string = correctKeyHandler.getCorrectKeyKey(record.key);
                attributeNames[keyKey] = record.key;
            }
        }
    }
    return attributeNames;
};

export const buildDynamoConditionAttributeValues = (combinations: DynamoSearchCombination[]): Record<string, any> => {

    const attributeValues: Record<string, string> = {};
    const correctKeyHandler: ExpressionCorrectKeyHandler = ExpressionCorrectKeyHandler.fromCombinations(combinations);

    for (const combination of combinations) {
        for (const record of combination.records) {
            if (typeof record.value !== 'undefined') {

                const correctKeyValue: string = correctKeyHandler.getCorrectValueKey(record.key);
                attributeValues[correctKeyValue] = record.value;
            }
        }
    }
    return attributeValues;
};
