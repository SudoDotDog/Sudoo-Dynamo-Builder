/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Builder
 */

import { DynamoBatchDeleteBuilder } from "./batch-delete";
import { DynamoBatchGetBuilder } from "./batch-get";
import { DynamoBatchPutBuilder } from "./batch-put";
import { DynamoDeleteBuilder } from "./delete";
import { DynamoGetBuilder } from "./get";
import { DynamoPutBuilder } from "./put";
import { DynamoQueryBuilder } from "./query";
import { DynamoScanBuilder } from "./scan";
import { DynamoUpdateBuilder } from "./update";

export class DynamoBuilder {

    public static create(tableName: string): DynamoBuilder {

        return new DynamoBuilder(tableName);
    }

    private readonly _tableName: string;

    private constructor(tableName: string) {

        this._tableName = tableName;
    }

    public batchDelete(): DynamoBatchDeleteBuilder {

        return DynamoBatchDeleteBuilder.create(this._tableName);
    }

    public batchGet(): DynamoBatchGetBuilder {

        return DynamoBatchGetBuilder.create(this._tableName);
    }

    public batchPut(): DynamoBatchPutBuilder {

        return DynamoBatchPutBuilder.create(this._tableName);
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

    public query(): DynamoQueryBuilder {

        return DynamoQueryBuilder.create(this._tableName);
    }

    public scan(): DynamoScanBuilder {

        return DynamoScanBuilder.create(this._tableName);
    }

    public update(): DynamoUpdateBuilder {

        return DynamoUpdateBuilder.create(this._tableName);
    }
}
