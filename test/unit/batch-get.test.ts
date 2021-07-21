/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Batch Get
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoBatchGetBuilder } from "../../src";

describe('Given {DynamoBatchGetBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-batch-get');

    it('should be able to create empty get input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoBatchGetBuilder = DynamoBatchGetBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.BatchGetItemInput = builder.build();

        expect(input).to.be.deep.equal({

            RequestItems: {
                [tableName]: {
                    Keys: [],
                },
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.BatchGetItemInput);
    });

    it('should be able to create get input - single key items', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoBatchGetBuilder = DynamoBatchGetBuilder.create(tableName);
        builder.singleKeyItem('key1', 'value1');
        builder.singleKeyItemList([{
            key: 'key2',
            value: 'value2',
        }, {
            key: 'key3',
            value: 'value3',
        }]);

        const input: DynamoDB.DocumentClient.BatchGetItemInput = builder.build();

        expect(input).to.be.deep.equal({

            RequestItems: {
                [tableName]: {
                    Keys: [
                        {
                            key1: "value1",
                        },
                        {
                            key2: "value2",
                        },
                        {
                            key3: "value3",
                        },
                    ],
                },
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.BatchGetItemInput);
    });

    it('should be able to create get input - multiple key items', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoBatchGetBuilder = DynamoBatchGetBuilder.create(tableName);
        builder.multipleKeysItem([{
            key: 'key1',
            value: 'value1',
        }, {
            key: 'key2',
            value: 'value2',
        }]);
        builder.multipleKeysItemList([
            [{
                key: 'key3',
                value: 'value3',
            }, {
                key: 'key4',
                value: 'value4',
            }],
            [{
                key: 'key5',
                value: 'value5',
            }],
        ]);

        const input: DynamoDB.DocumentClient.BatchGetItemInput = builder.build();

        expect(input).to.be.deep.equal({

            RequestItems: {
                [tableName]: {
                    Keys: [
                        {
                            key1: "value1",
                            key2: "value2",
                        },
                        {
                            key3: "value3",
                            key4: "value4",
                        },
                        {
                            key5: "value5",
                        },
                    ],
                },
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.BatchGetItemInput);
    });
});
