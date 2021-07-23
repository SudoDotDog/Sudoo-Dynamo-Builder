/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Expression
 */

import { DynamoRecord, DynamoSearchAttributeType, DynamoSearchCombination, DynamoSearchRecord } from "../declare";
import { ensureSearchRecord } from "./condition";

export const buildDynamoKey = (records: DynamoRecord[]): Record<string, string> => {

    return records.reduce((previous: Record<string, string>, current: DynamoRecord) => {

        return {
            ...previous,
            [current.key]: current.value,
        };
    }, {} as Record<string, string>);
};

export const buildSingletonCombination = (record: DynamoSearchRecord): DynamoSearchCombination => {

    const combination: DynamoSearchCombination = {

        records: [record],
        relation: "OR",
    };
    return combination;
};

export const expressionHasCondition = (combinations: DynamoSearchCombination[]): boolean => {

    for (const combination of combinations) {

        for (const record of combination.records) {
            if (ensureSearchRecord(record)) {
                return true;
            }
        }
    }
    return false;
};

export const expressionHasContent = (records: DynamoRecord[]): boolean => {

    for (const record of records) {
        if (typeof record.value !== 'undefined') {
            return true;
        }
    }
    return false;
};

export const verifyDynamoAttributeType = (type: DynamoSearchAttributeType): boolean => {

    if (type === "String"
        || type === "String-Set"
        || type === "Number"
        || type === "Number-Set"
        || type === "Binary"
        || type === "Binary-Set"
        || type === "Boolean"
        || type === "Null"
        || type === "List"
        || type === "Map") {
        return true;
    }
    return false;
};

export const parseDynamoAttributeType = (type: DynamoSearchAttributeType): string => {

    switch (type) {
        case "String":
            return "S";
        case "String-Set":
            return "SS";
        case "Number":
            return "N";
        case "Number-Set":
            return "NS";
        case "Binary":
            return "B";
        case "Binary-Set":
            return "BS";
        case "Boolean":
            return "BOOL";
        case "Null":
            return "NULL";
        case "List":
            return "L";
        case "Map":
            return "M";
    }
};
