/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Builder
 */

export class DynamoBuilder {

    public static create(tableName: string): DynamoBuilder {

        return new DynamoBuilder(tableName);
    }

    private readonly _tableName: string;

    private constructor(tableName: string) {

        this._tableName = tableName;
    }
}
