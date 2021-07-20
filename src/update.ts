/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Update
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord } from "./declare";
import { buildDynamoAttributeNames, buildDynamoAttributeValues, buildDynamoKey, buildDynamoSetExpression } from "./expression";

export class DynamoUpdateBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoUpdateBuilder {

        return new DynamoUpdateBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];
    private readonly _update: DynamoRecord[] = [];

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

    public update(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.updateEnsure(key, value);
    }

    public updateEnsure(key: string, value: string): this {

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
                ...this._buildReturnParameters(),
            };
        }

        return {

            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
            UpdateExpression: buildDynamoSetExpression(this._update),
            ExpressionAttributeNames: buildDynamoAttributeNames(this._update),
            ExpressionAttributeValues: buildDynamoAttributeValues(this._update),
            ...this._buildReturnParameters(),
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
