/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Delete
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord, DynamoSearchCombination, DynamoSearchSimpleOperator } from "./declare";
import { buildDynamoConditionAttributeNames, buildDynamoConditionAttributeValues, buildDynamoConditionExpression } from "./expression/condition";
import { buildDynamoKey, buildSingletonCombination, expressionHasCondition } from "./expression/expression";

export class DynamoDeleteBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoDeleteBuilder {

        return new DynamoDeleteBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];
    private readonly _condition: DynamoSearchCombination[] = [];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;
    }

    public where(key: string, value: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        this._where.push({
            key,
            value,
        });
        return this;
    }

    public simpleCondition(key: string, value?: any, operator: DynamoSearchSimpleOperator = '='): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.simpleConditionEnsure(key, value, operator);
    }

    public simpleConditionEnsure(key: string, value: any, operator: DynamoSearchSimpleOperator = '='): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            value,
            operator,
        });
        this._condition.push(combination);
        return this;
    }

    public betweenCondition(key: string, greaterThan?: any, lessThan?: any): this {

        if (typeof greaterThan === 'undefined'
            || typeof lessThan === 'undefined') {
            return this;
        }

        return this.betweenConditionEnsure(key, greaterThan, lessThan);
    }

    public betweenConditionEnsure(key: string, greaterThan: any, lessThan: any): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            greaterThan,
            lessThan,
            operator: 'between',
        });
        this._condition.push(combination);
        return this;
    }

    public conditionWith(combination: DynamoSearchCombination): this {

        this._condition.push(combination);
        return this;
    }

    public build(): DynamoDB.DocumentClient.DeleteItemInput {

        if (!this._hasCondition()) {

            return {

                TableName: this._tableName,
                Key: buildDynamoKey(this._where),
                ...this._buildReturnParameters(),
            };
        }

        return {

            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
            ConditionExpression: buildDynamoConditionExpression(this._condition),
            ExpressionAttributeNames: buildDynamoConditionAttributeNames(this._condition),
            ExpressionAttributeValues: buildDynamoConditionAttributeValues(this._condition),
            ...this._buildReturnParameters(),
        };
    }

    private _hasCondition(): boolean {

        return expressionHasCondition(this._condition);
    }
}
