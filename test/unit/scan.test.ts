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
            .filter('key', 'value')
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

    it('should be able to create simple scan input with operator', (): void => {

        const tableName: string = chance.string();

        const builder: DynamoScanBuilder = DynamoScanBuilder.create(tableName);
        const input: DynamoDB.DocumentClient.ScanInput = builder
            .filter('key', 'value', '>=')
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
            .filter('key1', 'value1')
            .filter('key2', undefined)
            .filter('key3', 'value3')
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
            .filter('key1', 'value1')
            .filter('key1', 'value2', '<>')
            .filterWith({
                records: [{
                    key: 'key3',
                    value: 'value3',
                    operator: '=',
                }, {
                    key: 'key4',
                    value: 'value4',
                    operator: '<',
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
                '::key1-0': 'value1',
                '::key1-1': 'value2',
                ':key3': 'value3',
                ':key4': 'value4',
            },
            FilterExpression: '#key1 = ::key1-0 AND #key1 <> ::key1-1 AND (#key3 = :key3 OR #key4 < :key4)',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
        } as DynamoDB.DocumentClient.ScanInput);
    });
});
