/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Builder
 */

import { DynamoDeleteBuilder } from "./delete";
import { DynamoGetBuilder } from "./get";
import { DynamoPutBuilder } from "./put";
import { DynamoUpdateBuilder } from "./update";

export class DynamoBuilder {

    public static create(tableName: string): DynamoBuilder {

        return new DynamoBuilder(tableName);
    }

    private readonly _tableName: string;

    private constructor(tableName: string) {

        this._tableName = tableName;
    }

    public delete(): DynamoDeleteBuilder {
        return DynamoDeleteBuilder.create(this._tableName);
    }

    public get(): DynamoGetBuilder {

        return DynamoGetBuilder.create(this._tableName);
    }

    public put(): DynamoPutBuilder {

        return DynamoPutBuilder.create(this._tableName);
    }

    public update(): DynamoUpdateBuilder {

        return DynamoUpdateBuilder.create(this._tableName);
    }
}
