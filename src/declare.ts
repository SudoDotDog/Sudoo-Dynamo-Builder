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

export enum DYNAMO_RETURN_CONSUMED_CAPACITY {

    INDEXES = "INDEXES",
    TOTAL = "TOTAL",
    NONE = "NONE"
}

export enum DYNAMO_RETURN_ITEM_COLLECTION_METRICS {

    SIZE = "SIZE",
    NONE = "NONE"
}

export enum DYNAMO_RETURN_VALUES {

    ALL_OLD = "ALL_OLD",
    UPDATED_OLD = "UPDATED_OLD",
    ALL_NEW = "ALL_NEW",
    UPDATED_NEW = "UPDATED_NEW",
    NONE = "NONE"
}
