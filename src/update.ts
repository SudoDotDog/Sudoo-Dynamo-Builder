/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Update
 */

import { DynamoDB } from "aws-sdk";
import { buildDynamoSetAttributeNames, buildDynamoSetAttributeValues, buildDynamoSetExpression } from ".";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord } from "./declare";
import { buildDynamoKey, expressionHasContent } from "./expression/expression";

export class DynamoUpdateBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoUpdateBuilder {

        return new DynamoUpdateBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];

    private readonly _update: DynamoRecord[] = [];
    private readonly _append: DynamoRecord[] = [];

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

    public update(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.updateEnsure(key, value);
    }

    public updateEnsure(key: string, value: any): this {

        this._update.push({
            key,
            value,
        });
        return this;
    }

    public appendToList(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.appendToListEnsure(key, value);
    }

    public appendToListEnsure(key: string, value: any): this {

        this._append.push({
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
            ExpressionAttributeNames: buildDynamoSetAttributeNames(this._update),
            ExpressionAttributeValues: buildDynamoSetAttributeValues(this._update),
            ...this._buildReturnParameters(),
        };
    }

    private _hasContent(): boolean {

        return expressionHasContent(this._update);
    }
}
