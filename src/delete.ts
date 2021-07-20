/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Delete
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord, DynamoSearchCombination, DynamoSearchOperator } from "./declare";
import { buildDynamoAttributeNames, buildDynamoAttributeValues, buildDynamoConditionExpression, buildDynamoKey, buildSingletonCombination, expressionHasCondition } from "./expression";

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

    public where(key: string, value: string): this {

        if (typeof value === 'undefined') {
            return this;
        }

        this._where.push({
            key,
            value,
        });
        return this;
    }

    public condition(key: string, value?: any, operator: DynamoSearchOperator = '='): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.conditionEnsure(key, value, operator);
    }

    public conditionEnsure(key: string, value: string, operator: DynamoSearchOperator = '='): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            value,
            operator,
        });
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
            ExpressionAttributeNames: buildDynamoAttributeNames(this._condition),
            ExpressionAttributeValues: buildDynamoAttributeValues(this._condition),
            ...this._buildReturnParameters(),
        };
    }

    private _hasCondition(): boolean {

        return expressionHasCondition(this._condition);
    }
}
