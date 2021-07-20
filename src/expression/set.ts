/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Set
 */

import { DynamoRecord } from "../declare";

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

export const buildDynamoSetAttributeNames = (records: DynamoRecord[]): Record<string, string> => {

    const attributeNames: Record<string, string> = {};

    for (const record of records) {
        if (typeof record.value !== 'undefined') {
            attributeNames[`#${record.key}`] = record.key;
        }
    }
    return attributeNames;
};

export const buildDynamoSetAttributeValues = (records: DynamoRecord[]): Record<string, string> => {

    const mappedAttributeValues: Record<string, string[]> = {};

    for (const record of records) {
        if (typeof record.value !== 'undefined') {

            const keyHash: string = `:${record.key}`;
            if (Array.isArray(mappedAttributeValues[keyHash])) {
                mappedAttributeValues[keyHash].push(record.value);
            } else {
                mappedAttributeValues[keyHash] = [record.value];
            }
        }
    }

    const attributeValues: Record<string, string> = {};
    const keys: string[] = Object.keys(mappedAttributeValues);

    for (const key of keys) {

        const values: string[] = mappedAttributeValues[key];
        if (values.length === 1) {

            attributeValues[key] = values[0];
        } else {

            for (let i = 0; i < values.length; i++) {
                const fixedKey: string = `:${key}-${i}`;
                attributeValues[fixedKey] = values[i];
            }
        }
    }
    return attributeValues;
};
