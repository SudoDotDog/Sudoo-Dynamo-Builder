/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Delete
 */

import { DynamoDB } from "aws-sdk";
import { DynamoRecord } from "./declare";
import { buildDynamoKey } from "./expression";

export class DynamoDeleteBuilder {

    public static create(tableName: string): DynamoDeleteBuilder {

        return new DynamoDeleteBuilder(tableName);
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

    public build(): DynamoDB.DocumentClient.DeleteItemInput {

        return {
            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
        };
    }
}
