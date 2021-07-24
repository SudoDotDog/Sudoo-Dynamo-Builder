/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Get
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord } from "./declare";
import { buildDynamoKey } from "./expression/expression";
import { buildDynamoKeyExpression } from "./expression/key";
import { onlyUseValidObjectProperties } from "./util";

export class DynamoGetBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoGetBuilder {

        return new DynamoGetBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];
    private readonly _projection: string[] = [];

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

    public projectKey(key: string): this {

        return this.projectKeys(key);
    }

    public projectKeys(...keys: string[]): this {

        return this.projectKeyList(keys);
    }

    public projectKeyList(keys: string[]): this {

        this._projection.push(...keys);
        return this;
    }

    public build(): DynamoDB.DocumentClient.GetItemInput {

        return onlyUseValidObjectProperties({

            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
            ProjectionExpression: buildDynamoKeyExpression(this._projection),
            ...this._buildReturnParameters(),
        });
    }
}
