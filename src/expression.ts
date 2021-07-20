/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Expression
 */

import { DynamoRecord } from "./declare";

export const buildDynamoKey = (records: DynamoRecord[]): Record<string, string> => {

    return records.reduce((previous: Record<string, string>, current: DynamoRecord) => {

        return {
            ...previous,
            [current.key]: current.value,
        };
    }, {} as Record<string, string>);
};

export const buildDynamoSetExpression = (records: DynamoRecord[]): string => {

    const expressionStack: string[] = [];

    for (const record of records) {

        if (typeof record.value !== 'undefined') {

            if (expressionStack.length > 0) {
                expressionStack.push(', ');
            }

            expressionStack.push(`#${record.key} = :${record.key}`);
        }
    }

    if (expressionStack.length > 0) {
        expressionStack.unshift('set ');
    }
    return expressionStack.join('');
};

export const buildDynamoConditionExpression = (records: DynamoRecord[]): string => {

    const expressionStack: string[] = [];

    for (const record of records) {

        if (typeof record.value !== 'undefined') {

            if (expressionStack.length > 0) {
                expressionStack.push(', ');
            }

            expressionStack.push(`#${record.key} = :${record.key}`);
        }
    }
    return expressionStack.join('');
};

export const buildDynamoAttributeNames = (records: DynamoRecord[]): Record<string, string> => {

    const attributeNames: Record<string, string> = {};

    for (const record of records) {

        if (typeof record.value !== 'undefined') {

            attributeNames[`#${record.key}`] = record.key;
        }
    }

    return attributeNames;
};

export const buildDynamoAttributeValues = (records: DynamoRecord[]): Record<string, string> => {

    const attributeValues: Record<string, string> = {};

    for (const record of records) {

        if (typeof record.value !== 'undefined') {

            attributeValues[`:${record.key}`] = record.value;
        }
    }

    return attributeValues;
};
