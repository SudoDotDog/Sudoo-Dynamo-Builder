/**
 * @author WMXPY
 * @namespace Dynamo_Builder_Expression
 * @description Correct Key
 */

import { DynamoSearchCombination } from "../declare";
import { preParseCombinationKeyProperty, PreParseKeyProperty } from "./stack";

export class ExpressionCorrectKeyHandler {

    public static create(combinations: DynamoSearchCombination[]): ExpressionCorrectKeyHandler {

        return new ExpressionCorrectKeyHandler(combinations);
    }

    private _preParseProperties: Record<string, PreParseKeyProperty>;
    private _keyCounters: Record<string, number>;

    private constructor(combinations: DynamoSearchCombination[]) {

        this._preParseProperties = preParseCombinationKeyProperty(combinations);
        this._keyCounters = {};
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

            const currentKey: string = `::${key}-${this._keyCounters[key] + 1}`;
            this._keyCounters[key]++;
            return currentKey;
        }

        this._keyCounters[key] = 0;
        return `::${key}-0`;
    }
}
