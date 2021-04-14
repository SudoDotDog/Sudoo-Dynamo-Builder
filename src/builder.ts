/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Builder
 */

import { DynamoUpdateBuilder } from "./update";

export class DynamoBuilder {

    public static create(tableName: string): DynamoBuilder {

        return new DynamoBuilder(tableName);
    }

    private readonly _tableName: string;

    private constructor(tableName: string) {

        this._tableName = tableName;
    }

    public update(): DynamoUpdateBuilder {

        return DynamoUpdateBuilder.create(this._tableName);
    }
}
