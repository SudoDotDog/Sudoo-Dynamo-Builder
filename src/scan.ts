/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Scan
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoSearchAttributeType, DynamoSearchCombination, DynamoSearchExistenceOperator, DynamoSearchSimpleOperator } from "./declare";
import { buildDynamoConditionAttributeNames, buildDynamoConditionAttributeValues, buildDynamoConditionExpression } from "./expression/condition";
import { buildSingletonCombination, verifyDynamoAttributeType } from "./expression/expression";

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

    public simpleFilterIfExist(
        key: string,
        value?: any,
        operator: DynamoSearchSimpleOperator = '=',
        reverse: boolean = false,
    ): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.simpleFilter(key, value, operator, reverse);
    }

    public simpleFilter(
        key: string,
        value: any,
        operator: DynamoSearchSimpleOperator = '=',
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({

            key,
            value,
            operator,
            reverse,
        });
        this._filter.push(combination);
        return this;
    }

    public attributeExist(
        key: string,
        operator: DynamoSearchExistenceOperator = 'attribute-exists',
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({

            key,
            operator,
            reverse,
        });
        this._filter.push(combination);
        return this;
    }

    public betweenIfExist(
        key: string,
        greaterThan?: any,
        lessThan?: any,
        reverse: boolean = false,
    ): this {

        if (typeof greaterThan === 'undefined'
            || typeof lessThan === 'undefined') {
            return this;
        }

        return this.between(key, greaterThan, lessThan, reverse);
    }

    public between(
        key: string,
        greaterThan: any,
        lessThan: any,
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({

            key,
            greaterThan,
            lessThan,
            operator: 'between',
            reverse,
        });
        this._filter.push(combination);
        return this;
    }

    public attributeTypeIfExist(
        key: string,
        type?: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        if (typeof type === 'undefined') {
            return this;
        }
        return this.attributeTypeIfValid(key, type, reverse);
    }

    public attributeTypeIfValid(
        key: string,
        type: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        const verifyResult: boolean = verifyDynamoAttributeType(type);
        if (!verifyResult) {
            return this;
        }
        return this.attributeType(key, type, reverse);
    }

    public attributeType(
        key: string,
        type: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            type,
            operator: 'attribute-type',
            reverse,
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
