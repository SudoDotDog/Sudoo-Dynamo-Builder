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
});
