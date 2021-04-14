/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Put
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoPutBuilder } from "../../src";

describe('Given {DynamoPutBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-put');

    it('should be able to create put input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoPutBuilder = DynamoPutBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.PutItemInput = builder
            .addItem('key', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Item: {
                key: 'value',
            },
        } as DynamoDB.DocumentClient.PutItemInput);
    });
});
