/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Declare
 */

export type DynamoRecord = {

    readonly key: string;
    readonly value: string;
};

export type DynamoUpdateSetRecord = {

    readonly key: string;
    readonly value: string;
};

export type DynamoUpdateAddRecord = {

    readonly key: string;
    readonly value: string[];
};

export type DynamoUpdateRemoveRecord = {

    readonly key: string;
};
