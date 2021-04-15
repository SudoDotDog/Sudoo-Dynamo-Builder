/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Put
 */

import { DynamoDB } from "aws-sdk";
import { DynamoRecord } from "./declare";
import { convertToStringObject } from "./util";

export class DynamoPutBuilder {

    public static create(tableName: string): DynamoPutBuilder {

        return new DynamoPutBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _items: DynamoRecord[] = [];

    private constructor(tableName: string) {

        this._tableName = tableName;
    }

    public addItem(key: string, value?: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.addItemString(key, convertToStringObject(value));
    }

    public addItemString(key: string, value: string): this {

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
