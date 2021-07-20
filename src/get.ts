/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Get
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoSearchOperator, DynamoSearchRecord } from "./declare";
import { buildDynamoKey } from "./expression";

export class DynamoGetBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoGetBuilder {

        return new DynamoGetBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoSearchRecord[] = [];

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

    public build(): DynamoDB.DocumentClient.GetItemInput {

        return {

            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
            ...this._buildReturnParameters(),
        };
    }
}
