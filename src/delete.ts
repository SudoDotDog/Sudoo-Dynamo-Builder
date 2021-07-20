/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Delete
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord, DynamoSearchOperator, DynamoSearchRecord } from "./declare";
import { buildDynamoAttributeNames, buildDynamoAttributeValues, buildDynamoConditionExpression, buildDynamoKey } from "./expression";

export class DynamoDeleteBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoDeleteBuilder {

        return new DynamoDeleteBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoSearchRecord[] = [];
    private readonly _condition: DynamoRecord[] = [];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;
    }

    public where(key: string, value: string, operator: DynamoSearchOperator = '='): this {

        if (typeof value === 'undefined') {
            return this;
        }

        this._where.push({
            key,
            value,
            operator,
        });
        return this;
    }

    public condition(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.conditionEnsure(key, value);
    }

    public conditionEnsure(key: string, value: string): this {

        this._condition.push({
            key,
            value,
        });
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

        for (const record of this._condition) {
            if (typeof record.value !== 'undefined') {
                return true;
            }
        }
        return false;
    }
}
