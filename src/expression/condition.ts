/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Condition
 */

import { DynamoSearchCombination, DynamoSearchRecord } from "../declare";
import { ExpressionCorrectKeyHandler } from "./correct-key";

export const buildDynamoConditionExpression = (combinations: DynamoSearchCombination[]): string => {

    const expressionStack: string[] = [];

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

                    expressionStack.push(`#${record.key} ${record.operator} :${record.key}`);
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

                recordsStack.push(`#${record.key} ${record.operator} :${record.key}`);
            }
        }
        expressionStack.push(`(${recordsStack.join(` ${combination.relation} `)})`);
    }

    return expressionStack.join('');
};

export const buildDynamoConditionAttributeNames = (combinations: DynamoSearchCombination[]): Record<string, string> => {

    const attributeNames: Record<string, string> = {};

    for (const combination of combinations) {
        for (const record of combination.records) {
            if (typeof record.value !== 'undefined') {
                attributeNames[`#${record.key}`] = record.key;
            }
        }
    }
    return attributeNames;
};

export const buildDynamoConditionAttributeValues = (combinations: DynamoSearchCombination[]): Record<string, string> => {

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
