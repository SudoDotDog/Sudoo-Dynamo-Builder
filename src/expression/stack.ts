/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Stack
 */

import { DynamoRecord, DynamoSearchCombination, DynamoSearchRecord } from "../declare";

export type PreParseKeyProperty = {

    duplicate: boolean;
};

export const preParseRecordsKeyProperty = (records: Array<DynamoSearchRecord | DynamoRecord>): Record<string, PreParseKeyProperty> => {

    const result: Record<string, PreParseKeyProperty> = {};

    for (const record of records) {

        const key = record.key;
        if (result[key]) {
            result[key].duplicate = true;
        } else {
            result[key] = {
                duplicate: false
            };
        }
    }
    return result;
};

export const extractRecordsFromSearchCombination = (combinations: DynamoSearchCombination[]): DynamoSearchRecord[] => {

    return combinations.reduce((result: DynamoSearchRecord[], combination: DynamoSearchCombination) => {

        return result.concat(combination.records);
    }, []);
};
