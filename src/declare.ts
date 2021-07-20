/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Declare
 */

export type DynamoRecord = {

    readonly key: string;
    readonly value: string;
};

export type DynamoSearchOperator = "=" | "<>" | ">=" | "<=" | ">" | "<";

export type DynamoSearchRecord = {

    readonly key: string;
    readonly value: string;

    readonly operator: DynamoSearchOperator;
};

export type DynamoUpdateRemoveRecord = {

    readonly key: string;
};

export type DynamoReturnParameters = {

    ReturnConsumedCapacity: DYNAMO_RETURN_CONSUMED_CAPACITY;
    ReturnItemCollectionMetrics: DYNAMO_RETURN_ITEM_COLLECTION_METRICS;
    ReturnValues: DYNAMO_RETURN_VALUES;
};

export enum DYNAMO_RETURN_CONSUMED_CAPACITY {

    INDEXES = "INDEXES",
    TOTAL = "TOTAL",
    NONE = "NONE", // Default
}

export enum DYNAMO_RETURN_ITEM_COLLECTION_METRICS {

    SIZE = "SIZE",
    NONE = "NONE", // Default
}

export enum DYNAMO_RETURN_VALUES {

    ALL_OLD = "ALL_OLD",
    UPDATED_OLD = "UPDATED_OLD",
    ALL_NEW = "ALL_NEW",
    UPDATED_NEW = "UPDATED_NEW",
    NONE = "NONE", // Default
}
