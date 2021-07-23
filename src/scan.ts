/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Scan
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoSearchCombination, DynamoSearchSimpleOperator } from "./declare";
import { buildDynamoConditionAttributeNames, buildDynamoConditionAttributeValues, buildDynamoConditionExpression } from "./expression/condition";
import { buildSingletonCombination } from "./expression/expression";

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

    public simpleFilter(key: string, value?: any, operator: DynamoSearchSimpleOperator = '='): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.simpleFilterEnsure(key, value, operator);
    }

    public simpleFilterEnsure(key: string, value: any, operator: DynamoSearchSimpleOperator = '='): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({

            key,
            value,
            operator,
        });
        this._filter.push(combination);
        return this;
    }

    public between(key: string, greaterThan?: any, lessThan?: any): this {

        if (typeof greaterThan === 'undefined'
            || typeof lessThan === 'undefined') {
            return this;
        }

        return this.betweenEnsure(key, greaterThan, lessThan);
    }

    public betweenEnsure(key: string, greaterThan: any, lessThan: any): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({

            key,
            greaterThan,
            lessThan,
            operator: 'between',
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
            ExpressionAttributeNames: buildDynamoConditionAttributeNames(this._filter),
            ExpressionAttributeValues: buildDynamoConditionAttributeValues(this._filter),
            ...this._buildReturnParameters(),
        };
    }
}
