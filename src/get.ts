/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Get
 */

import { DynamoDB } from "aws-sdk";
import { DynamoRecord } from "./declare";

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
            Key: this._buildKeys(),
        };
    }

    private _buildKeys(): Record<string, string> {

        return this._where.reduce((previous: Record<string, string>, current: DynamoRecord) => {

            return {
                ...previous,
                [current.key]: current.value,
            };
        }, {} as Record<string, string>);
    }
}
