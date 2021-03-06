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

    it('should be able to create simple scan input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key', 'value')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create attribute type scan input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key1', 'value')
            .attributeTypeIfExist('key2', 'String')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create attribute exist scan input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key1', 'value')
            .attributeExistence('key2')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create simple scan input - with contains', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key1', 'value1')
            .simpleFilter('key2', 'value2', 'contains')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create simple scan input with operator', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key', 'value', '>=')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create simple scan input optional', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilterIfExist('key1', 'value1')
            .simpleFilterIfExist('key2', undefined)
            .simpleFilterIfExist('key3', 'value3')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create complex scan input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key1', 'value1')
            .simpleFilter('key1', 'value2', '<>')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create scan with not used input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('out', 'start', '>')
            .simpleFilter('out', 'end', '<')
            .simpleFilter('place', 'place')
            .simpleFilterIfExist('notUsed')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create reversed input', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key1', 'value1')
            .simpleFilter('key2', 'value2', '=', true)
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create scan input with page size', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key', 'value')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });

    it('should be able to create scan input with page size and last evaluation key', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .simpleFilter('key', 'value')
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
        } as DynamoDB.DocumentClient.ScanInput);
    });
});
