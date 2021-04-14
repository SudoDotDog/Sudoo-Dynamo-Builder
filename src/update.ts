/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Update
 */

export class DynamoUpdateBuilder {

    public static create(tableName: string): DynamoUpdateBuilder {

        return new DynamoUpdateBuilder(tableName);
    }

    private readonly _tableName: string;
    private readonly _keys: Record<string, string>;

    private constructor(tableName: string) {

        this._tableName = tableName;
    }

    public key(key: string, value: string): this {

        this._keys[key] = value;
        return this;
    }
}
