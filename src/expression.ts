/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Expression
 */

import { DynamoRecord } from "./declare";

export const buildKeyExpression = (records: DynamoRecord[]): Record<string, string> => {

    return records.reduce((previous: Record<string, string>, current: DynamoRecord) => {

        return {
            ...previous,
            [current.key]: current.value,
        };
    }, {} as Record<string, string>);
};
