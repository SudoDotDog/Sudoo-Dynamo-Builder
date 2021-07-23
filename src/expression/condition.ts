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

                if (ensureSearchRecord(record)) {

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
            if (ensureSearchRecord(record)) {

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
            if (ensureSearchRecord(record)) {

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
        record: for (const record of combination.records) {
            if (ensureSearchRecord(record)) {

                switch (record.operator) {
                    case '=':
                    case "<>":
                    case ">=":
                    case "<=":
                    case ">":
                    case "<":
                    case "contains":
                    case "begin-with": {
                        const correctKeyValue: string = correctKeyHandler.getCorrectValueKey(record.key);
                        attributeValues[correctKeyValue] = record.value;
                        continue record;
                    }
                    case "between": {
                        const correctGreaterKeyValue: string = correctKeyHandler.getCorrectValueKey(record.key);
                        const correctLessKeyValue: string = correctKeyHandler.getCorrectValueKey(record.key);
                        attributeValues[correctGreaterKeyValue] = record.greaterThan;
                        attributeValues[correctLessKeyValue] = record.lessThan;
                        continue record;
                    }
                    case "attribute-exist":
                    case "attribute-not-exist": {
                        continue record;
                    }
                    case "attribute-type": {
                        const correctKeyValue: string = correctKeyHandler.getCorrectValueKey(record.key);
                        attributeValues[correctKeyValue] = record.type;
                        continue record;
                    }
                }
            }
        }
    }
    return attributeValues;
};

export const ensureSearchRecord = (record: DynamoSearchRecord): boolean => {

    switch (record.operator) {
        case '=':
        case "<>":
        case ">=":
        case "<=":
        case ">":
        case "<":
        case "contains":
        case "begin-with":
            return record.value !== 'undefined';
        case "between":
            return record.greaterThan !== 'undefined'
                && record.lessThan !== 'undefined';
        case "attribute-exist":
        case "attribute-not-exist":
            return true;
        case "attribute-type":
            return record.type === 'String'
                || record.type === 'String-Set'
                || record.type === 'Number'
                || record.type === 'Number-Set'
                || record.type === 'Binary'
                || record.type === 'Binary-Set'
                || record.type === 'Boolean'
                || record.type === 'Null'
                || record.type === 'List'
                || record.type === 'Map';
    }
    return false;
};
