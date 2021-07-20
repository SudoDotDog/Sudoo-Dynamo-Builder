/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Stack
 */

import { DynamoSearchCombination } from "../declare";

export type PreParseKeyProperty = {

    duplicate: boolean;
};

export const preParseCombinationKeyProperty = (combinations: DynamoSearchCombination[]): Record<string, PreParseKeyProperty> => {

    const result: Record<string, PreParseKeyProperty> = {};

    for (const combination of combinations) {

        for (const record of combination.records) {

            const key = record.key;
            if (result[key]) {
                result[key].duplicate = true;
            } else {
                result[key] = {
                    duplicate: false
                };
            }
        }
    }
    return result;
};
