/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Update
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoUpdateBuilder } from "../../src";

describe('Given {DynamoUpdateBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-update');

    it('should be able to create empty input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoUpdateBuilder = DynamoUpdateBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.UpdateItemInput = builder
            .where('key', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
        } as DynamoDB.DocumentClient.UpdateItemInput);
    });

    it('should be able to create one update input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoUpdateBuilder = DynamoUpdateBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.UpdateItemInput = builder
            .where('key', 'value')
            .update('key', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            UpdateExpression: 'set #key = :key',
            ExpressionAttributeNames: {
                '#key': 'key',
            },
            ExpressionAttributeValues: {
                ':key': 'value',
            },
        } as DynamoDB.DocumentClient.UpdateItemInput);
    });

    it('should be able to create multiple update input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoUpdateBuilder = DynamoUpdateBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.UpdateItemInput = builder
            .where('key', 'value')
            .update('key1', 'value')
            .update('key2', 'value')
            .update('key3', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            UpdateExpression: 'set #key1 = :key1, #key2 = :key2, #key3 = :key3',
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
                '#key3': 'key3',
            },
            ExpressionAttributeValues: {
                ':key1': 'value',
                ':key2': 'value',
                ':key3': 'value',
            },
        } as DynamoDB.DocumentClient.UpdateItemInput);
    });
});
