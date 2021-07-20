/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Expression
 */

import { DynamoRecord, DynamoSearchCombination, DynamoSearchRecord } from "../declare";

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
            if (typeof record.value !== 'undefined') {
                return true;
            }
        }
    }
    return false;
};
