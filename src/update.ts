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

    private readonly _where: DynamoRecord[];
    private readonly _update: DynamoRecord[];

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

        return {
            TableName: this._tableName,
            Key: {},
        };
    }
}
