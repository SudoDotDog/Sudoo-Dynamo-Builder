/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Delete
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoDeleteBuilder } from "../../src";

describe('Given {DynamoDeleteBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-delete');

    it('should be able to create empty input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoDeleteBuilder = DynamoDeleteBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.DeleteItemInput = builder
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
        } as DynamoDB.DocumentClient.DeleteItemInput);
    });

    it('should be able to create with between condition', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoDeleteBuilder = DynamoDeleteBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.DeleteItemInput = builder
            .where('key', 'value')
            .simpleCondition('key1', 'simple')
            .betweenCondition('key2', 'greater', 'less')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            ConditionExpression: '#key1 = :key1 AND #key2 BETWEEN :__key2_0 AND :__key2_1',
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
            },
            ExpressionAttributeValues: {
                ':__key2_0': 'greater',
                ':__key2_1': 'less',
                ':key1': 'simple',
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.DeleteItemInput);
    });

    it('should be able to create one delete input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoDeleteBuilder = DynamoDeleteBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.DeleteItemInput = builder
            .where('key', 'value')
            .simpleCondition('key', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            ConditionExpression: '#key = :key',
            ExpressionAttributeNames: {
                '#key': 'key',
            },
            ExpressionAttributeValues: {
                ':key': 'value',
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.DeleteItemInput);
    });

    it('should be able to create multiple delete input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoDeleteBuilder = DynamoDeleteBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.DeleteItemInput = builder
            .where('key', 'value')
            .simpleCondition('key1', 'value')
            .simpleCondition('key2', 'value')
            .simpleCondition('key3', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            ConditionExpression: '#key1 = :key1 AND #key2 = :key2 AND #key3 = :key3',
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
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.DeleteItemInput);
    });

    it('should be able to create multiple delete input - duplicated key', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoDeleteBuilder = DynamoDeleteBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.DeleteItemInput = builder
            .where('key', 'value')
            .simpleCondition('key1', 'value')
            .simpleCondition('key2', 'value')
            .simpleCondition('key2', 'value')
            .build();

        expect(input).to.be.deep.equal({
            TableName: tableName,
            Key: {
                key: 'value',
            },
            ConditionExpression: '#key1 = :key1 AND #key2 = :__key2_0 AND #key2 = :__key2_1',
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
            },
            ExpressionAttributeValues: {
                ':key1': 'value',
                ':__key2_0': 'value',
                ':__key2_1': 'value',
            },
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.DeleteItemInput);
    });
});
