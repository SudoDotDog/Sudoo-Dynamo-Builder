/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Put
 */

import { DynamoDB } from "aws-sdk";
import { DynamoRecord } from "./declare";

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

        if (typeof value === 'string') {
            return this.addItemString(key, value);
        }

        if (value instanceof Date) {
            return this.addItemString(key, value.toISOString());
        }

        if (Boolean(value.toString)) {
            return this.addItemString(key, value.toString());
        }

        return this.addItemString(key, String(value));
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
