/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Correct Key
 */

import { DynamoRecord, DynamoSearchCombination, DynamoSearchRecord } from "../declare";
import { extractRecordsFromSearchCombination, PreParseKeyProperty, preParseRecordsKeyProperty } from "./stack";

export class ExpressionCorrectKeyHandler {

    public static fromCombinations(combinations: DynamoSearchCombination[]): ExpressionCorrectKeyHandler {

        const records: DynamoSearchRecord[] = extractRecordsFromSearchCombination(combinations);
        return new ExpressionCorrectKeyHandler(records);
    }

    public static fromRecords(records: Array<DynamoSearchRecord | DynamoRecord>): ExpressionCorrectKeyHandler {

        return new ExpressionCorrectKeyHandler(records);
    }

    private _preParseProperties: Record<string, PreParseKeyProperty>;
    private _keyCounters: Record<string, number>;

    private constructor(records: Array<DynamoSearchRecord | DynamoRecord>) {

        this._preParseProperties = preParseRecordsKeyProperty(records);
        this._keyCounters = {};
    }

    public getCorrectKeyKey(key: string): string {

        return `#${key}`;
    }

    public getCorrectValueKey(key: string): string {

        const property: PreParseKeyProperty | undefined = this._preParseProperties[key];
        if (!property) {
            throw new Error(`Key ${key} not found`);
        }

        if (!property.duplicate) {
            return `:${key}`;
        }

        if (typeof this._keyCounters[key] === 'number') {

            const currentKey: string = `:__${key}_${this._keyCounters[key] + 1}`;
            this._keyCounters[key]++;
            return currentKey;
        }

        this._keyCounters[key] = 0;
        return `:__${key}_0`;
    }

    public reset(): this {

        this._keyCounters = {};
        return this;
    }
}
