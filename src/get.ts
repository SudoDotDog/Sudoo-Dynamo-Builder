/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Get
 */

import { DynamoDB } from "aws-sdk";
import { DynamoRecord } from "./declare";
import { buildDynamoKey } from "./expression";

export class DynamoGetBuilder {

    public static create(tableName: string): DynamoGetBuilder {

        return new DynamoGetBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];

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

    public build(): DynamoDB.DocumentClient.GetItemInput {

        return {
            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
        };
    }
}
