/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Put
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord } from "./declare";

export class DynamoPutBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoPutBuilder {

        return new DynamoPutBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _items: DynamoRecord[] = [];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;
    }

    public addItemIfExist(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.addItem(key, value);
    }

    public addItem(key: string, value: any): this {

        this._items.push({
            key,
            value,
        });
        return this;
    }

    public build(): DynamoDB.DocumentClient.PutItemInput {

        return {

            TableName: this._tableName,
            Item: this._buildItems(),
            ...this._buildReturnParameters(),
        };
    }

    private _buildItems(): Record<string, string> {

        const items: Record<string, string> = {};

        for (const record of this._items) {

            if (typeof record.value !== 'undefined') {

                items[record.key] = record.value;
            }
        }

        return items;
    }
}
