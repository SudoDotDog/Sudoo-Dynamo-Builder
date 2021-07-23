/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Update
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord, DynamoUpdateRecord } from "./declare";
import { buildDynamoKey, expressionHasContent } from "./expression/expression";
import { buildDynamoUpdateAttributeNames, buildDynamoUpdateAttributeValues, buildDynamoUpdateExpression } from "./expression/update";

export class DynamoUpdateBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoUpdateBuilder {

        return new DynamoUpdateBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];

    private readonly _update: DynamoUpdateRecord[] = [];

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

    public updateIfExist(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.update(key, value);
    }

    public update(key: string, value: any): this {

        this._update.push({
            key,
            value,
            type: 'base',
        });
        return this;
    }

    public appendToListIfExist(key: string, value?: any[]): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.appendToList(key, value);
    }

    public appendToList(key: string, value: any[]): this {

        this._update.push({
            key,
            value,
            type: 'list-append',
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
            UpdateExpression: buildDynamoUpdateExpression(this._update),
            ExpressionAttributeNames: buildDynamoUpdateAttributeNames(this._update),
            ExpressionAttributeValues: buildDynamoUpdateAttributeValues(this._update),
            ...this._buildReturnParameters(),
        };
    }

    private _hasContent(): boolean {

        return expressionHasContent(this._update);
    }
}
