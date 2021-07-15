/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Update
 */

import { DynamoDB } from "aws-sdk";
import { DynamoRecord } from "./declare";
import { buildDynamoAttributeNames, buildDynamoAttributeValues, buildDynamoExpression, buildDynamoKey } from "./expression";
import { convertToStringObject } from "./util";

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

        if (typeof value === 'undefined') {
            return this;
        }

        this._where.push({
            key,
            value,
        });
        return this;
    }

    public update(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.updateString(key, convertToStringObject(value));
    }

    public updateString(key: string, value: string): this {

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
                Key: buildDynamoKey(this._where),
            };
        }

        return {

            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
            UpdateExpression: buildDynamoExpression(this._update),
            ExpressionAttributeNames: buildDynamoAttributeNames(this._update),
            ExpressionAttributeValues: buildDynamoAttributeValues(this._update),
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
}
