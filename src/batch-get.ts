/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Batch Get
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord } from "./declare";

export class DynamoBatchGetBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoBatchGetBuilder {

        return new DynamoBatchGetBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _itemObjects: DynamoRecord[][];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;

        this._itemObjects = [];
    }

    public singleKeyItem(key: string, value: string): this {

        this._itemObjects.push([{
            key,
            value,
        }]);
        return this;
    }

    public multipleKeysItem(records: DynamoRecord[]): this {

        this._itemObjects.push(records);
        return this;
    }

    public build(): DynamoDB.DocumentClient.BatchGetItemInput {

        return {
            RequestItems: {
                [this._tableName]: {
                    Keys: this._itemObjects.map((item: DynamoRecord[]) => {

                        return item.reduce((previous: Record<string, any>, current: DynamoRecord) => {

                            return {
                                ...previous,
                                [current.key]: current.value,
                            };
                        }, {});
                    }),
                },
            },
            ...this._buildReturnParameters(),
        };
    }
}
