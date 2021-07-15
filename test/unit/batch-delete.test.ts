/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Batch Delete
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoBatchDeleteBuilder } from "../../src";

describe('Given {DynamoBatchDeleteBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-batch-delete');

    it('should be able to create empty input', (): void => {

        const tableName: string = chance.string();

        const key1: string = chance.string();
        const key2: string = chance.string();

        const value1: string = chance.string();
        const value2: string = chance.string();

        const builder: DynamoBatchDeleteBuilder = DynamoBatchDeleteBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.BatchWriteItemInput = builder
            .addDeleteKey({
                [key1]: value1,
                [key2]: value2,
            })
            .addDeleteKey({
                [key1]: value1,
                [key2]: value2,
            })
            .build();


        expect(input).to.be.deep.equal({

            RequestItems: {
                [tableName]: [
                    {
                        DeleteRequest: {
                            Key: {
                                [key1]: value1,
                                [key2]: value2,
                            },
                        },
                    },
                    {
                        DeleteRequest: {
                            Key: {
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
