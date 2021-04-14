/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Update
 */

import { DynamoDB } from "aws-sdk";
import { DynamoRecord } from "./declare";

export class DynamoUpdateBuilder {

    public static create(tableName: string): DynamoUpdateBuilder {

        return new DynamoUpdateBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];
    private readonly _update: DynamoRecord[] = [];

    private constructor(tableName: string) {

        this._tableName = tableName;
    }

    public where(key: string, value: string): this {

        this._where.push({
            key,
            value,
        });
        return this;
    }

    public update(key: string, value: string): this {

        this._update.push({
            key,
            value,
        });
        return this;
    }

    public build(): DynamoDB.DocumentClient.UpdateItemInput {

        if (!this._hasContent()) {

            return {
                TableName: this._tableName,
                Key: this._buildKeys(),
            };
        }

        return {
            TableName: this._tableName,
            Key: this._buildKeys(),
            UpdateExpression: this._buildUpdateExpression(),
            ExpressionAttributeNames: this._buildExpressionAttributeNames(),
            ExpressionAttributeValues: this._buildExpressionAttributeValues(),
        };
    }

    private _hasContent(): boolean {

        for (const record of this._update) {
            if (typeof record.value !== 'undefined') {
                return true;
            }
        }
        return false;
    }

    private _buildKeys(): Record<string, string> {

        return this._where.reduce((previous: Record<string, string>, current: DynamoRecord) => {

            return {
                ...previous,
                [current.key]: current.value,
            };
        }, {} as Record<string, string>);
    }

    private _buildUpdateExpression(): string {

        const expressionStack: string[] = [];

        for (const record of this._update) {

            if (typeof record.value !== 'undefined') {

                if (expressionStack.length > 0) {
                    expressionStack.push(', ');
                }

                expressionStack.push(`#${record.key} = :${record.key}`);
            }
        }

        if (expressionStack.length > 0) {
            expressionStack.unshift('set ');
        }

        return expressionStack.join('');
    }

    private _buildExpressionAttributeNames(): Record<string, string> {

        const attributeNames: Record<string, string> = {};

        for (const record of this._update) {

            if (typeof record.value !== 'undefined') {

                attributeNames[`#${record.key}`] = record.key;
            }
        }

        return attributeNames;
    }

    private _buildExpressionAttributeValues(): Record<string, string> {

        const attributeValues: Record<string, string> = {};

        for (const record of this._update) {

            if (typeof record.value !== 'undefined') {

                attributeValues[`:${record.key}`] = record.value;
            }
        }

        return attributeValues;
    }
}
