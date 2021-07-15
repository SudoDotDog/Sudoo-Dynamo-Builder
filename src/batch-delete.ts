/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Batch Delete
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";

export class DynamoBatchDeleteBuilder<T extends Record<string, any> = Record<string, any>> extends DynamoBaseBuilder {

    public static create<T extends Record<string, any> = Record<string, any>>(tableName: string): DynamoBatchDeleteBuilder<T> {

        return new DynamoBatchDeleteBuilder<T>(tableName);
    }

    private readonly _tableName: string;

    private readonly _itemObjects: T[];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;

        this._itemObjects = [];
    }

    public addDeleteKey(itemObject: T): this {

        this._itemObjects.push(itemObject);
        return this;
    }

    public addDeleteKeyList(itemObjectList: T[]): this {

        for (const each of itemObjectList) {
            this.addDeleteKey(each);
        }
        return this;
    }

    public addDeleteKeys(...itemObjects: T[]): this {

        this.addDeleteKeyList(itemObjects);
        return this;
    }

    public build(): DynamoDB.DocumentClient.BatchWriteItemInput {

        return {
            RequestItems: {
                [this._tableName]: this._itemObjects.map((item: T) => {

                    return {
                        DeleteRequest: {
                            Key: item,
                        }
                    };
                }),
            },
            ...this._buildReturnParameters(),
        };
    }
}
