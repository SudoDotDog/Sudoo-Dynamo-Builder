/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Expression
 */

import { DynamoRecord, DynamoSearchCombination, DynamoSearchRecord } from "./declare";

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

    const attributeValues: Record<string, string> = {};

    for (const record of records) {
        if (typeof record.value !== 'undefined') {
            attributeValues[`:${record.key}`] = record.value;
        }
    }
    return attributeValues;
};

export const buildSingletonCombination = (record: DynamoSearchRecord): DynamoSearchCombination => {

    const combination: DynamoSearchCombination = {

        records: [record],
        relation: "OR",
    };
    return combination;
};

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
                    recordsStack.push(` AND `);
                    andJoined = true;
                }

                recordsStack.push(`#${record.key} ${record.operator} :${record.key}`);
            }
        }
        expressionStack.push(`(${recordsStack.join(` ${combination.relation} `)})`);
    }

    return expressionStack.join('');
};

export const buildDynamoAttributeNames = (combinations: DynamoSearchCombination[]): Record<string, string> => {

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

export const buildDynamoAttributeValues = (combinations: DynamoSearchCombination[]): Record<string, string> => {

    const mappedAttributeValues: Record<string, string[]> = {};

    for (const combination of combinations) {
        for (const record of combination.records) {
            if (typeof record.value !== 'undefined') {

                const keyHash: string = `:${record.key}`;
                if (Array.isArray(mappedAttributeValues[keyHash])) {
                    mappedAttributeValues[keyHash].push(record.value);
                } else {
                    mappedAttributeValues[keyHash] = [record.value];
                }
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

export const expressionHasCondition = (combinations: DynamoSearchCombination[]): boolean => {

    for (const combination of combinations) {

        for (const record of combination.records) {
            if (typeof record.value !== 'undefined') {
                return true;
            }
        }
    }
    return false;
};
