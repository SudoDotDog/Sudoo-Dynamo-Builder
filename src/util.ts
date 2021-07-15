/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Util
 */

export const joinAndConditions = (conditions: string[]): string => {

    return conditions.map((each) => {
        if (typeof each === 'string') {
            return each.trim();
        }
        return each;
    }).join(' AND ');
};

export const joinOrConditions = (conditions: string[]): string => {

    return conditions.map((each) => {
        if (typeof each === 'string') {
            return each.trim();
        }
        return each;
    }).join(' OR ');
};
