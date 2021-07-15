/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Batch Put
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";

export class DynamoBatchPutBuilder<T extends Record<string, any> = Record<string, any>> extends DynamoBaseBuilder {

    public static create<T extends Record<string, any> = Record<string, any>>(tableName: string): DynamoBatchPutBuilder<T> {

        return new DynamoBatchPutBuilder<T>(tableName);
    }

    private readonly _tableName: string;

    private readonly _itemObjects: T[];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;

        this._itemObjects = [];
    }

    public addItem(itemObject: T): this {

        this._itemObjects.push(itemObject);
        return this;
    }

    public addItemList(itemObjectList: T[]): this {

        for (const each of itemObjectList) {
            this.addItem(each);
        }
        return this;
    }

    public addItems(...itemObjects: T[]): this {

        this.addItemList(itemObjects);
        return this;
    }

    public build(): DynamoDB.DocumentClient.BatchWriteItemInput {

        return {
            RequestItems: {
                [this._tableName]: this._itemObjects.map((item: T) => {

                    return {
                        PutRequest: {
                            Item: item,
                        },
                    };
                }),
            },
            ...this._buildReturnParameters(),
        };
    }
}
