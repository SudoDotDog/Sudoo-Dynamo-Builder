/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Scan
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoScanBuilder } from "../../src";

describe('Given {DynamoScanBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-scan');

    it('should be able to create complex scan input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .filter('key', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.ScanInput);
    });
});
