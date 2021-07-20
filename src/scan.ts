/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Scan
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoSearchCombination, DynamoSearchOperator } from "./declare";
import { buildDynamoAttributeNames, buildDynamoAttributeValues, buildDynamoConditionExpression, buildSingletonCombination } from "./expression";

export class DynamoScanBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoScanBuilder {

        return new DynamoScanBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _filter: DynamoSearchCombination[] = [];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;
    }

    public filter(key: string, value?: any, operator: DynamoSearchOperator = '='): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.filterEnsure(key, value, operator);
    }

    public filterEnsure(key: string, value: string, operator: DynamoSearchOperator = '='): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            value,
            operator,
        });
        this._filter.push(combination);
        return this;
    }

    public filterWith(combination: DynamoSearchCombination): this {

        this._filter.push(combination);
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
