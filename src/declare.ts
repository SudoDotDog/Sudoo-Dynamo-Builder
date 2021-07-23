/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Declare
 */

export type DynamoRecord = {

    readonly key: string;
    readonly value: any;
};

export type DynamoSearchSimpleOperator =
    "="
    | "<>"
    | ">="
    | "<="
    | ">"
    | "<"
    | "contains"
    | "begin-with";

export type DynamoSearchBetweenOperator =
    "between";

export type DynamoSearchExistenceOperator =
    "attribute-exist"
    | "attribute-not-exist";

export type DynamoSearchAttributeTypeOperator =
    "attribute-type";

export type DynamoSearchAttributeType =
    "String"
    | "String-Set"
    | "Number"
    | "Number-Set"
    | "Binary"
    | "Binary-Set"
    | "Boolean"
    | "Null"
    | "List"
    | "Map";

export type DynamoSearchOperator =
    DynamoSearchSimpleOperator
    | DynamoSearchBetweenOperator
    | DynamoSearchExistenceOperator
    | DynamoSearchAttributeTypeOperator;

export type DynamoSearchRecord = {

    readonly key: string;
} & ({

    readonly value: any;
    readonly operator: DynamoSearchSimpleOperator;
} | {

    readonly greaterThan: any;
    readonly lessThan: any;
    readonly operator: DynamoSearchBetweenOperator;
} | {

    readonly operator: DynamoSearchExistenceOperator;
} | {

    readonly type: DynamoSearchAttributeType;
    readonly operator: DynamoSearchAttributeTypeOperator;
});

export type DynamoUpdateRecord = {

    readonly key: string;
} & ({

    readonly type: 'base';
    readonly value: any;
} | {

    readonly type: 'list-append';
    readonly value: any[];
});

export type DynamoSearchCombinationRelation = "AND" | "OR";

export type DynamoSearchCombination = {

    readonly records: DynamoSearchRecord[];
    readonly relation: DynamoSearchCombinationRelation;
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
