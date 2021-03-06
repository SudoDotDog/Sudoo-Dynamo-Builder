/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Delete
 */

import { DynamoDB } from "aws-sdk";
import { DynamoBaseBuilder } from "./base";
import { DynamoRecord, DynamoSearchAttributeType, DynamoSearchCombination, DynamoSearchExistenceOperator, DynamoSearchSimpleOperator } from "./declare";
import { buildDynamoConditionAttributeNames, buildDynamoConditionAttributeValues, buildDynamoConditionExpression } from "./expression/condition";
import { buildDynamoKey, buildSingletonCombination, expressionHasCondition, verifyDynamoAttributeType } from "./expression/expression";
import { onlyUseValidObjectProperties } from "./util";

export class DynamoDeleteBuilder extends DynamoBaseBuilder {

    public static create(tableName: string): DynamoDeleteBuilder {

        return new DynamoDeleteBuilder(tableName);
    }

    private readonly _tableName: string;

    private readonly _where: DynamoRecord[] = [];
    private readonly _condition: DynamoSearchCombination[] = [];

    private constructor(tableName: string) {

        super();

        this._tableName = tableName;
    }

    public where(key: string, value: any): this {

        if (typeof value === 'undefined') {
            return this;
        }

        this._where.push({
            key,
            value,
        });
        return this;
    }

    public simpleConditionIfExist(
        key: string,
        value?: any,
        operator: DynamoSearchSimpleOperator = '=',
        reverse: boolean = false,
    ): this {

        if (typeof value === 'undefined') {
            return this;
        }

        return this.simpleCondition(key, value, operator, reverse);
    }

    public simpleCondition(
        key: string,
        value: any,
        operator: DynamoSearchSimpleOperator = '=',
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            value,
            operator,
            reverse,
        });
        this._condition.push(combination);
        return this;
    }

    public betweenConditionIfBothExist(
        key: string,
        greaterThan?: any,
        lessThan?: any,
        reverse: boolean = false,
    ): this {

        if (typeof greaterThan === 'undefined'
            || typeof lessThan === 'undefined') {
            return this;
        }
        return this.betweenCondition(key, greaterThan, lessThan, reverse);
    }

    public betweenCondition(
        key: string,
        greaterThan: any,
        lessThan: any,
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            greaterThan,
            lessThan,
            operator: 'between',
            reverse,
        });
        this._condition.push(combination);
        return this;
    }

    public attributeExistenceCondition(
        key: string,
        operator: DynamoSearchExistenceOperator = 'attribute-exists',
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            operator,
            reverse,
        });
        this._condition.push(combination);
        return this;
    }

    public attributeTypeConditionIfExist(
        key: string,
        type?: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        if (typeof type === 'undefined') {
            return this;
        }
        return this.attributeTypeConditionIfValid(key, type, reverse);
    }

    public attributeTypeConditionIfValid(
        key: string,
        type: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        const verifyResult: boolean = verifyDynamoAttributeType(type);
        if (!verifyResult) {
            return this;
        }
        return this.attributeTypeCondition(key, type, reverse);
    }

    public attributeTypeCondition(
        key: string,
        type: DynamoSearchAttributeType,
        reverse: boolean = false,
    ): this {

        const combination: DynamoSearchCombination = buildSingletonCombination({
            key,
            type,
            operator: 'attribute-type',
            reverse,
        });
        this._condition.push(combination);
        return this;
    }

    public conditionWith(combination: DynamoSearchCombination): this {

        this._condition.push(combination);
        return this;
    }

    public build(): DynamoDB.DocumentClient.DeleteItemInput {

        if (!this._hasCondition()) {

            return onlyUseValidObjectProperties({

                TableName: this._tableName,
                Key: buildDynamoKey(this._where),
                ...this._buildReturnParameters(),
            });
        }

        return onlyUseValidObjectProperties({

            TableName: this._tableName,
            Key: buildDynamoKey(this._where),
            ConditionExpression: buildDynamoConditionExpression(this._condition),
            ExpressionAttributeNames: buildDynamoConditionAttributeNames(this._condition),
            ExpressionAttributeValues: buildDynamoConditionAttributeValues(this._condition),
            ...this._buildReturnParameters(),
        });
    }

    private _hasCondition(): boolean {

        return expressionHasCondition(this._condition);
    }
}
