/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Batch Put
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { DynamoBatchDeleteBuilder, DynamoBatchGetBuilder, DynamoBatchPutBuilder, DynamoBuilder, DynamoDeleteBuilder, DynamoGetBuilder, DynamoScanBuilder, DynamoUpdateBuilder } from "../../src";

describe('Given {DynamoBuilder} class', (): void => {

    const chance: Chance.Chance = new Chance('dynamo-builder');

    it('should be able to construct batch delete', (): void => {

        const builder: DynamoBuilder = DynamoBuilder.create(chance.string());

        const batchDeleteBuilder: DynamoBatchDeleteBuilder = builder.batchDelete();

        expect(batchDeleteBuilder).to.be.an.instanceof(DynamoBatchDeleteBuilder);
    });

    it('should be able to construct batch get', (): void => {

        const builder: DynamoBuilder = DynamoBuilder.create(chance.string());

        const batchGetBuilder: DynamoBatchGetBuilder = builder.batchGet();

        expect(batchGetBuilder).to.be.an.instanceof(DynamoBatchGetBuilder);
    });

    it('should be able to construct batch put', (): void => {

        const builder: DynamoBuilder = DynamoBuilder.create(chance.string());

        const batchPutBuilder: DynamoBatchPutBuilder = builder.batchPut();

        expect(batchPutBuilder).to.be.an.instanceof(DynamoBatchPutBuilder);
    });

    it('should be able to construct delete', (): void => {

        const builder: DynamoBuilder = DynamoBuilder.create(chance.string());

        const deleteBuilder: DynamoDeleteBuilder = builder.delete();

        expect(deleteBuilder).to.be.an.instanceof(DynamoDeleteBuilder);
    });

    it('should be able to construct get', (): void => {

        const builder: DynamoBuilder = DynamoBuilder.create(chance.string());

        const getBuilder: DynamoGetBuilder = builder.get();

        expect(getBuilder).to.be.an.instanceof(DynamoGetBuilder);
    });

    it('should be able to construct scan', (): void => {

        const builder: DynamoBuilder = DynamoBuilder.create(chance.string());

        const scanBuilder: DynamoScanBuilder = builder.scan();

        expect(scanBuilder).to.be.an.instanceof(DynamoScanBuilder);
    });

    it('should be able to construct update', (): void => {

        const builder: DynamoBuilder = DynamoBuilder.create(chance.string());

        const updateBuilder: DynamoUpdateBuilder = builder.update();

        expect(updateBuilder).to.be.an.instanceof(DynamoUpdateBuilder);
    });
});
