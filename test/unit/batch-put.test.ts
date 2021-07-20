/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Batch Put
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoBatchPutBuilder } from "../../src";

describe('Given {DynamoBatchPutBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-batch-put');

    it('should be able to create empty input', (): void => {

        const tableName: string = chance.string();

        const key1: string = chance.string();
        const key2: string = chance.string();

        const value1: string = chance.string();
        const value2: string = chance.string();

        const builder: DynamoBatchPutBuilder = DynamoBatchPutBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.BatchWriteItemInput = builder
            .addItem({
                [key1]: value1,
                [key2]: value2,
            })
            .addItem({
                [key1]: value1,
                [key2]: value2,
            })
            .build();

        expect(input).to.be.deep.equal({

            RequestItems: {
                [tableName]: [
                    {
                        PutRequest: {
                            Item: {
                                [key1]: value1,
                                [key2]: value2,
                            },
                        },
                    },
                    {
                        PutRequest: {
                            Item: {
                                [key1]: value1,
                                [key2]: value2,
                            },
                        },
                    },
                ],
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.BatchWriteItemInput);
    });
});
