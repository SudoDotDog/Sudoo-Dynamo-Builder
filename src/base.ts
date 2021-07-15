/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Base
 */

import { DynamoReturnParameters, DYNAMO_RETURN_CONSUMED_CAPACITY, DYNAMO_RETURN_ITEM_COLLECTION_METRICS, DYNAMO_RETURN_VALUES } from "./declare";

export class DynamoBaseBuilder {

    private _returnConsumedCapacity: DYNAMO_RETURN_CONSUMED_CAPACITY;
    private _returnItemCollectionMetrics: DYNAMO_RETURN_ITEM_COLLECTION_METRICS;
    private _returnValues: DYNAMO_RETURN_VALUES;

    protected constructor() {

        this._returnConsumedCapacity = DYNAMO_RETURN_CONSUMED_CAPACITY.NONE;
        this._returnItemCollectionMetrics = DYNAMO_RETURN_ITEM_COLLECTION_METRICS.NONE;
        this._returnValues = DYNAMO_RETURN_VALUES.NONE;
    }

    public setReturnConsumedCapacity(consumedCapacity: DYNAMO_RETURN_CONSUMED_CAPACITY): this {

        this._returnConsumedCapacity = consumedCapacity;
        return this;
    }

    public setReturnItemCollectionMetrics(itemCollectionMetrics: DYNAMO_RETURN_ITEM_COLLECTION_METRICS): this {

        this._returnItemCollectionMetrics = itemCollectionMetrics;
        return this;
    }

    public setReturnValues(returnValues: DYNAMO_RETURN_VALUES): this {

        this._returnValues = returnValues;
        return this;
    }

    protected _buildReturnParameters(): DynamoReturnParameters {

        return {
            ReturnConsumedCapacity: this._returnConsumedCapacity,
            ReturnItemCollectionMetrics: this._returnItemCollectionMetrics,
            ReturnValues: this._returnValues
        };
    }
}
