/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Query
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoSearchAttributeType, DynamoSearchCombination, DynamoSearchExistenceOperator, DynamoSearchSimpleOperator } from "./declare";
import { buildDynamoConditionAttributeNames, buildDynamoConditionAttributeValues, buildDynamoConditionExpression } from "./expression/condition";
import { buildSingletonCombination, verifyDynamoAttributeType } from "./expression/expression";
import { buildDynamoKeyExpression } from "./expression/key";
import { onlyUseValidObjectProperties } from "./util";

export class DynamoQueryBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoQueryBuilder {

        return new DynamoQueryBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _condition: DynamoSearchCombination[] = [];
    private readonly _filter: DynamoSearchCombination[] = [];
    private readonly _projection: string[] = [];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;
    }

    public filterSimpleIfExist(
        key: string,
        value?: any,
        operator: DynamoSearchSimpleOperator = '=',
        reverse: boolean = false,
    ): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.filterSimple(key, value, operator, reverse);
    }

    public filterSimple(
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

    public filterAttributeExistence(
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

    public filterBetweenIfExist(
        key: string,
        greaterThan?: any,
        lessThan?: any,
        reverse: boolean = false,
    ): this {

        if (typeof greaterThan === 'undefined'
            || typeof lessThan === 'undefined') {
            return this;
        }

        return this.filterBetween(key, greaterThan, lessThan, reverse);
    }

    public filterBetween(
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

    public filterAttributeTypeIfExist(
        key: string,
        type?: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        if (typeof type === 'undefined') {
            return this;
        }
        return this.filterAttributeTypeIfValid(key, type, reverse);
    }

    public filterAttributeTypeIfValid(
        key: string,
        type: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        const verifyResult: boolean = verifyDynamoAttributeType(type);
        if (!verifyResult) {
            return this;
        }
        return this.filterAttributeType(key, type, reverse);
    }

    public filterAttributeType(
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

    public conditionSimpleIfExist(
        key: string,
        value?: any,
        operator: DynamoSearchSimpleOperator = '=',
        reverse: boolean = false,
    ): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.conditionSimple(key, value, operator, reverse);
    }

    public conditionSimple(
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
        this._condition.push(combination);
        return this;
    }

    public conditionAttributeExistence(
        key: string,
        operator: DynamoSearchExistenceOperator = 'attribute-exists',
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({

            key,
            operator,
            reverse,
        });
        this._condition.push(combination);
        return this;
    }

    public conditionBetweenIfExist(
        key: string,
        greaterThan?: any,
        lessThan?: any,
        reverse: boolean = false,
    ): this {

        if (typeof greaterThan === 'undefined'
            || typeof lessThan === 'undefined') {
            return this;
        }

        return this.conditionBetween(key, greaterThan, lessThan, reverse);
    }

    public conditionBetween(
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
        this._condition.push(combination);
        return this;
    }

    public conditionAttributeTypeIfExist(
        key: string,
        type?: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        if (typeof type === 'undefined') {
            return this;
        }
        return this.conditionAttributeTypeIfValid(key, type, reverse);
    }

    public conditionAttributeTypeIfValid(
        key: string,
        type: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        const verifyResult: boolean = verifyDynamoAttributeType(type);
        if (!verifyResult) {
            return this;
        }
        return this.conditionAttributeType(key, type, reverse);
    }

    public conditionAttributeType(
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
        this._condition.push(combination);
        return this;
    }

    public conditionWith(combination: DynamoSearchCombination): this {

        this._filter.push(combination);
        return this;
    }

    public projectKey(key: string): this {

        return this.projectKeys(key);
    }

    public projectKeys(...keys: string[]): this {

        return this.projectKeyList(keys);
    }

    public projectKeyList(keys: string[]): this {

        this._projection.push(...keys);
        return this;
    }

    public build(): DynamoDB.DocumentClient.QueryInput {

        return onlyUseValidObjectProperties({

            TableName: this._tableName,
            ProjectionExpression: buildDynamoKeyExpression(this._projection),
            FilterExpression: buildDynamoConditionExpression(this._filter),
            KeyConditionExpression: buildDynamoConditionExpression(this._condition),
            ExpressionAttributeNames: buildDynamoConditionAttributeNames(this._filter),
            ExpressionAttributeValues: buildDynamoConditionAttributeValues(this._filter),
            ...this._buildReturnParameters(),
        });
    }
}
