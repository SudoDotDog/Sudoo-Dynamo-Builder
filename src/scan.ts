/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Scan
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord } from "./declare";
import { buildDynamoAttributeNames, buildDynamoAttributeValues, buildDynamoConditionExpression } from "./expression";

export class DynamoScanBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoScanBuilder {

        return new DynamoScanBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _filter: DynamoRecord[] = [];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;
    }

    public filter(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.filterEnsure(key, value);
    }

    public filterEnsure(key: string, value: string): this {

        this._filter.push({
            key,
            value,
        });
        return this;
    }

    public build(): DynamoDB.DocumentClient.ScanInput {

        return {

            TableName: this._tableName,
            FilterExpression: buildDynamoConditionExpression(this._filter),
            ExpressionAttributeNames: buildDynamoAttributeNames(this._filter),
            ExpressionAttributeValues: buildDynamoAttributeValues(this._filter),
            ...this._buildReturnParameters(),
        };
    }
}
