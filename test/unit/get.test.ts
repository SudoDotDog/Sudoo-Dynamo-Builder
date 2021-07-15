/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Get
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoGetBuilder } from "../../src";

describe('Given {DynamoGetBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-get');

    it('should be able to create get query input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoGetBuilder = DynamoGetBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.GetItemInput = builder
            .where('key', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.GetItemInput);
    });
});
