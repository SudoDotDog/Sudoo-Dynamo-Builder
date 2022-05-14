/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Query
 * @override Unit Test
 */

import { DynamoDB } from "aws-sdk";
import { expect } from "chai";
import * as Chance from "chance";
import { DynamoQueryBuilder } from "../../src";

describe('Given {DynamoQueryBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder-query');

    it('should be able to create simple query input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key', 'value')
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key': 'key',
            },
            ExpressionAttributeValues: {
                ':key': 'value',
            },
            FilterExpression: '#key = :key',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create attribute type query input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key1', 'value')
            .filterAttributeTypeIfExist('key2', 'String')
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
            },
            ExpressionAttributeValues: {
                ':key1': 'value',
                ':key2': 'S',
            },
            FilterExpression: '#key1 = :key1 AND attribute_type(#key2, #key2)',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create attribute exist query input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key1', 'value')
            .filterAttributeExistence('key2')
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
            },
            ExpressionAttributeValues: {
                ':key1': 'value',
            },
            FilterExpression: '#key1 = :key1 AND attribute_exists(#key2)',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create simple query input - with contains', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key1', 'value1')
            .filterSimple('key2', 'value2', 'contains')
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
            },
            ExpressionAttributeValues: {
                ':key1': 'value1',
                ':key2': 'value2',
            },
            FilterExpression: '#key1 = :key1 AND contains(#key2, :key2)',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create simple query input with operator', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key', 'value', '>=')
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key': 'key',
            },
            ExpressionAttributeValues: {
                ':key': 'value',
            },
            FilterExpression: '#key >= :key',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create simple query input optional', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimpleIfExist('key1', 'value1')
            .filterSimpleIfExist('key2', undefined)
            .filterSimpleIfExist('key3', 'value3')
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key3': 'key3',
            },
            ExpressionAttributeValues: {
                ':key1': 'value1',
                ':key3': 'value3',
            },
            FilterExpression: '#key1 = :key1 AND #key3 = :key3',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create complex query input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key1', 'value1')
            .filterSimple('key1', 'value2', '<>')
            .filterWith({
                records: [{
                    key: 'key3',
                    value: 'value3',
                    operator: '=',
                    reverse: false,
                }, {
                    key: 'key4',
                    value: 'value4',
                    operator: '<',
                    reverse: false,
                }],
                relation: "OR",
            })
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key3': 'key3',
                '#key4': 'key4',
            },
            ExpressionAttributeValues: {
                ':__key1_0': 'value1',
                ':__key1_1': 'value2',
                ':key3': 'value3',
                ':key4': 'value4',
            },
            FilterExpression: '#key1 = :__key1_0 AND #key1 <> :__key1_1 AND (#key3 = :key3 OR #key4 < :key4)',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create query with not used input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('out', 'start', '>')
            .filterSimple('out', 'end', '<')
            .filterSimple('place', 'place')
            .filterSimpleIfExist('notUsed')
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#out': 'out',
                '#place': 'place',
            },
            ExpressionAttributeValues: {
                ':__out_0': 'start',
                ':__out_1': 'end',
                ':place': 'place',
            },
            FilterExpression: '#out > :__out_0 AND #out < :__out_1 AND #place = :place',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create reversed input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key1', 'value1')
            .filterSimple('key2', 'value2', '=', true)
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
            },
            ExpressionAttributeValues: {
                ':key1': 'value1',
                ':key2': 'value2',
            },
            FilterExpression: '#key1 = :key1 AND (NOT #key2 = :key2)',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create query with both conditions and filters', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key1', 'value1')
            .filterSimple('key2', 'value2', 'contains')
            .conditionSimple('key1', 'value3')
            .conditionBetween('key2', 'before', 'after', true)
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            ExpressionAttributeNames: {
                '#key1': 'key1',
                '#key2': 'key2',
            },
            ExpressionAttributeValues: {
                ':__key1_0': 'value1',
                ':__key1_1': 'value3',
                ':__key2_0': 'value2',
                ':__key2_1': 'before',
                ':__key2_2': 'after',
            },
            FilterExpression: '#key1 = :__key1_0 AND contains(#key2, :__key2_0)',
            KeyConditionExpression: "#key1 = :__key1_1 AND (NOT #key2 BETWEEN :__key2_1 AND :__key2_2)",
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create query input with page limit', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key', 'value')
            .pageSize(10)
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            Limit: 10,
            ExpressionAttributeNames: {
                '#key': 'key',
            },
            ExpressionAttributeValues: {
                ':key': 'value',
            },
            FilterExpression: '#key = :key',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });

    it('should be able to create query input with page limit and last evaluation key', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoQueryBuilder = DynamoQueryBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.QueryInput = builder
            .filterSimple('key', 'value')
            .pageSize(10)
            .lastEvaluationKey({
                'key': 'value',
            })
            .build();

        expect(input).to.be.deep.equal({

            TableName: tableName,
            Limit: 10,
            ExclusiveStartKey: {
                'key': 'value',
            },
            ExpressionAttributeNames: {
                '#key': 'key',
            },
            ExpressionAttributeValues: {
                ':key': 'value',
            },
            FilterExpression: '#key = :key',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.QueryInput);
    });
});
