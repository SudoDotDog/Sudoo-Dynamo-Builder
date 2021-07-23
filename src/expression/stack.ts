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

    record: for (const record of records) {

        const key = record.key;
        if (result[key]) {
            result[key].duplicate = true;
        } else {

            if (typeof (record as any).operator === 'string') {

                const assertRecord: DynamoSearchRecord = record as DynamoSearchRecord;
                if (assertRecord.operator === 'between') {

                    result[key] = {
                        duplicate: true,
                    };
                    continue record;
                }
            }
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
